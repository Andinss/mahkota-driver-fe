"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { User } from "./types/auth";
import {
  getAccessToken,
  clearTokens,
  getStoredUser,
  setLogoutToast,
  migrateLegacySession,
} from "./token";
import { authApi } from "./api/auth";
import { HttpClientError } from "./api-http";
import { toastWarning } from "@/components/ui/toast-provider";

const IDLE_TIMEOUT_MS = 24 * 60 * 60 * 1000;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, turnstileToken?: string, remember?: boolean) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (raw: Record<string, unknown>): User => {
  const permissions =
    Array.isArray(raw.permissions) && raw.permissions.length
      ? (raw.permissions as string[])
      : Array.isArray((raw.role as { permissions?: { name?: string }[] } | null)?.permissions)
        ? ((raw.role as { permissions: { name?: string }[] }).permissions
            .map((p) => p.name)
            .filter(Boolean) as string[])
        : [];
  return { ...raw, permissions } as User;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAuthenticatedRef = useRef(false);

  const clearIdleTimers = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    clearIdleTimers();

    idleTimerRef.current = setTimeout(() => {
      setLogoutToast("idle");
      clearTokens();
      setUser(null);
      isAuthenticatedRef.current = false;
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }, IDLE_TIMEOUT_MS);
  }, [clearIdleTimers]);

  const resetIdleTimer = useCallback(() => {
    if (isAuthenticatedRef.current) {
      startIdleTimer();
    }
  }, [startIdleTimer]);

  useEffect(() => {
    migrateLegacySession();

    const token = getAccessToken();
    if (!token) {
      queueMicrotask(() => setIsLoading(false));
      return;
    }

    const stored = getStoredUser<Record<string, unknown>>();
    if (stored) {
      const initialUser = normalizeUser(stored);
      isAuthenticatedRef.current = true;
      startIdleTimer();
      queueMicrotask(() => {
        setUser(initialUser);
        setIsLoading(false);
      });
    }

    authApi
      .getMe()
      .then((freshUser) => {
        const permissions =
          freshUser.permissions?.length
            ? freshUser.permissions
            : (freshUser.role as unknown as { permissions?: { name?: string }[] })?.permissions
                ?.map((p) => p.name)
                .filter(Boolean) || [];
        const nextUser = { ...freshUser, permissions } as User;
        setUser(nextUser);
        isAuthenticatedRef.current = true;
        startIdleTimer();
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof HttpClientError && error.statusCode === 401) {
          clearTokens();
          setUser(null);
          isAuthenticatedRef.current = false;
          clearIdleTimers();
          setIsLoading(false);
          return;
        }

        const stillHasToken = !!getAccessToken();
        if (stillHasToken && stored) {
          setUser(normalizeUser(stored));
          isAuthenticatedRef.current = true;
          startIdleTimer();
          setIsLoading(false);
          toastWarning("Gagal sinkronisasi profil. Data lokal tetap digunakan.");
          return;
        }

        if (stillHasToken && !stored) {
          setIsLoading(false);
          return;
        }

        clearTokens();
        setUser(null);
        isAuthenticatedRef.current = false;
        clearIdleTimers();
        setIsLoading(false);
      });

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove", "click"];
    const handleActivity = () => resetIdleTimer();
    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      clearIdleTimers();
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [startIdleTimer, clearIdleTimers, resetIdleTimer]);

  const login = useCallback(
    async (
      email: string,
      password: string,
      turnstileToken?: string,
      remember?: boolean,
    ): Promise<User | null> => {
      const result = await authApi.login(
        { email, password, turnstile_token: turnstileToken },
        remember ?? true,
      );
      const raw = result.user as unknown as Record<string, unknown>;
      const permissions =
        Array.isArray(raw.permissions) && raw.permissions.length
          ? (raw.permissions as string[])
          : ((raw.role as { permissions?: { name?: string }[] } | null)?.permissions
              ?.map((p) => p.name)
              .filter(Boolean) as string[]) || [];
      const userData = { ...result.user, permissions } as User;
      setUser(userData);
      isAuthenticatedRef.current = true;
      startIdleTimer();
      return userData;
    },
    [startIdleTimer],
  );

  const logout = useCallback(() => {
    setLogoutToast("intentional");
    clearTokens();
    setUser(null);
    isAuthenticatedRef.current = false;
    clearIdleTimers();
  }, [clearIdleTimers]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

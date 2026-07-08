"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { User } from "./types/auth";
import { getAccessToken, clearTokens, getStoredUser } from "./token";
import { authApi } from "./api/auth";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, turnstileToken?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAuthenticatedRef = useRef(false);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => {
      clearTokens();
      setUser(null);
      isAuthenticatedRef.current = false;
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }, IDLE_TIMEOUT_MS);
  }, [clearIdleTimer]);

  const resetIdleTimer = useCallback(() => {
    if (isAuthenticatedRef.current) {
      startIdleTimer();
    }
  }, [startIdleTimer]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const stored = getStoredUser<Record<string, any>>();
    if (stored) {
      const permissions = stored.permissions?.length
        ? stored.permissions
        : stored.role?.permissions?.map((p: any) => p.name) || [];
      setUser({ ...stored, permissions } as User);
      isAuthenticatedRef.current = true;
      startIdleTimer();
      setIsLoading(false);
    }

    authApi.getMe()
      .then((freshUser: any) => {
        const permissions = freshUser?.permissions?.length
          ? freshUser.permissions
          : freshUser?.role?.permissions?.map((p: any) => p.name) || [];
        setUser({ ...freshUser, permissions } as User);
        isAuthenticatedRef.current = true;
        startIdleTimer();
        setIsLoading(false);
      })
      .catch(() => {
        isAuthenticatedRef.current = false;
        clearTokens();
        setUser(null);
        clearIdleTimer();
        setIsLoading(false);
      });

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove", "click"];
    const handleActivity = () => resetIdleTimer();
    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      clearIdleTimer();
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [startIdleTimer, clearIdleTimer, resetIdleTimer]);

  const login = useCallback(async (email: string, password: string, turnstileToken?: string) => {
    const result = await authApi.login({ email, password, turnstile_token: turnstileToken });
    const raw = result.user as any;
    const permissions = raw.permissions?.length
      ? raw.permissions
      : raw.role?.permissions?.map((p: any) => p.name) || [];
    setUser({ ...result.user, permissions } as User);
    isAuthenticatedRef.current = true;
    startIdleTimer();
  }, [startIdleTimer]);

  const logout = useCallback(() => {
    sessionStorage.setItem("intentional_logout", "true");
    clearTokens();
    setUser(null);
    isAuthenticatedRef.current = false;
    clearIdleTimer();
  }, [clearIdleTimer]);

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

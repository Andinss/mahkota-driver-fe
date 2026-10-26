"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { toastSuccess, toastWarning } from "@/components/ui/toast-provider";
import { SESSION_EXPIRED_MESSAGE } from "@/lib/utils/error-message";
import { consumeLogoutToast } from "@/lib/token";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const reason = consumeLogoutToast();
      if (reason === "intentional") {
        toastSuccess("You have been successfully logged out.");
      } else if (reason === "idle") {
        toastWarning("Sesi Anda berakhir karena tidak ada aktivitas. Silakan login kembali.");
      } else {
        // Token kedaluwarsa / sesi berakhir tanpa penanda logout.
        toastWarning(SESSION_EXPIRED_MESSAGE);
      }
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

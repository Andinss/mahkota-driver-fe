"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { toastSuccess, toastWarning } from "@/components/ui/toast-provider";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isIntentionalLogout, setIsIntentionalLogout] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const intentional = sessionStorage.getItem("intentional_logout") === "true";
      if (intentional) {
        sessionStorage.removeItem("intentional_logout");
        toastSuccess("You have been successfully logged out.");
      } else {
        toastWarning("You do not have permission to access this page. Please login first.");
      }
      setIsIntentionalLogout(intentional);
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

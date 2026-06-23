"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";

interface PermissionGuardProps {
  permission: string;
  redirectTo?: string;
  children: ReactNode;
}

export function PermissionGuard({
  permission,
  redirectTo = "/dashboard",
  children,
}: PermissionGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!canAccess(user?.permissions, permission)) {
      router.replace(redirectTo);
    }
  }, [isLoading, user, permission, redirectTo, router]);

  if (isLoading) return null;
  if (!canAccess(user?.permissions, permission)) return null;

  return <>{children}</>;
}

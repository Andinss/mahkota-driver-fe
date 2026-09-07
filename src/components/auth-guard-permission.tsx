"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { toastError } from "@/components/ui/toast-provider";

interface PermissionGuardProps {
  permission: string;
  fallbackPermission?: string;
  children: ReactNode;
}

export function PermissionGuard({
  permission,
  fallbackPermission,
  children,
}: PermissionGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const hasAccess =
    canAccess(user?.permissions, permission) ||
    (fallbackPermission ? canAccess(user?.permissions, fallbackPermission) : false);

  useEffect(() => {
    if (isLoading) return;
    if (!hasAccess) {
      toastError("Anda tidak memiliki izin untuk mengakses halaman ini.");
      router.replace("/dashboard");
    }
  }, [isLoading, hasAccess, router]);

  if (isLoading) return null;
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}

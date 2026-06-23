"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";

interface CanProps {
  permission: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({ permission, fallback = null, children }: CanProps) {
  const { user } = useAuth();
  if (canAccess(user?.permissions, permission)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}

"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { AlertDialog } from "@/components/ui/alert";

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
  const [showAlert, setShowAlert] = useState(false);

  const hasAccess =
    canAccess(user?.permissions, permission) ||
    (fallbackPermission ? canAccess(user?.permissions, fallbackPermission) : false);

  useEffect(() => {
    if (isLoading) return;
    if (!hasAccess) {
      setShowAlert(true);
    }
  }, [isLoading, hasAccess]);

  const handleClose = () => {
    setShowAlert(false);
    router.replace("/dashboard");
  };

  if (isLoading) return null;
  if (!hasAccess) {
    return (
      <AlertDialog
        isOpen={showAlert}
        onClose={handleClose}
        title="Akses Ditolak"
        message="Anda tidak memiliki izin untuk mengakses halaman ini."
        confirmText="OK"
        type="error"
        autoCloseDelay={0}
      />
    );
  }

  return <>{children}</>;
}

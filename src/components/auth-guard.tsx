"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AlertDialog } from "@/components/ui/alert";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAlert(true);
    }
  }, [isLoading, isAuthenticated]);

  const handleRedirect = () => {
    setShowAlert(false);
    router.replace("/auth/login");
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        {showAlert && (
          <AlertDialog
            isOpen={showAlert}
            onClose={handleRedirect}
            type="warning"
            title="Access Denied"
            message="You do not have permission to access this page. Please login first."
            autoCloseDelay={2000}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}

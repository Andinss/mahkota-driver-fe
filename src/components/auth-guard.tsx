"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AlertDialog } from "@/components/ui/alert";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [isIntentionalLogout, setIsIntentionalLogout] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const intentional = sessionStorage.getItem("intentional_logout") === "true";
      if (intentional) {
        sessionStorage.removeItem("intentional_logout");
      }
      setIsIntentionalLogout(intentional);
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
            type={isIntentionalLogout ? "success" : "warning"}
            title={isIntentionalLogout ? "Logout Successful" : "Access Denied"}
            message={
              isIntentionalLogout
                ? "You have been successfully logged out."
                : "You do not have permission to access this page. Please login first."
            }
            autoCloseDelay={2000}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}

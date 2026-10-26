"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { SupervisorDashboard } from "@/components/dashboard/supervisor-dashboard";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Driver punya dashboard sendiri (portal driver).
  const isDriverPortal = canAccess(
    user?.permissions,
    "driver_portal.dashboard",
  );
  // Supervisor hanya punya driver.read.own (tanpa read.all former admin/owner).
  const isSupervisor =
    canAccess(user?.permissions, "driver.read.own") &&
    !canAccess(user?.permissions, "driver.read.all");

  useEffect(() => {
    if (!isLoading && isDriverPortal) {
      router.replace("/dashboard/driver");
    }
  }, [isLoading, isDriverPortal, router]);

  if (isLoading || isDriverPortal) {
    return (
      <div className="p-7 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 dark:text-slate-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return isSupervisor ? <SupervisorDashboard /> : <AdminDashboard />;
}

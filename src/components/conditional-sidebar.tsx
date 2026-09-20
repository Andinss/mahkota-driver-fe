"use client";

import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/sidebar";
import DriverSidebar from "@/components/driver-sidebar";

export default function ConditionalSidebar() {
  const { user } = useAuth();
  const isDriver = user?.role?.code === "DRIVER";

  if (isDriver) {
    return <DriverSidebar />;
  }

  return <Sidebar />;
}

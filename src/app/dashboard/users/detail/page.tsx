"use client";

import { PermissionGuard } from "@/components/auth-guard-permission";
import UserDetailPage from "./user-detail";

export default function UserDetail() {
  return (
    <PermissionGuard permission="user.read">
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950">
      <UserDetailPage />
    </div>
    </PermissionGuard>
  );
}

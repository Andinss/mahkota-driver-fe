"use client";
import { PageHeader } from "@/components/page-header";
import { confirmToast, toastSuccess, toastError, toastInfo } from "@/components/ui/toast-provider";
import { RoleCard } from "@/components/role/role-list/card";
import { RoleBanner } from "@/components/role/role-list/role-banner";
import { RoleTable } from "@/components/role/role-list/role-list-table";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ExportOptions } from "@/components/ui/export";
import { rolesApi } from "@/lib/api/roles";
import type { RoleItem } from "@/lib/types/role";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { PermissionGuard } from "@/components/auth-guard-permission";

const RolePage = () => {
  const { user } = useAuth();
  const handleExport = (options: ExportOptions) => {
    console.log("Export options from role page:", options);
    toastInfo(`Exporting role data as ${options.format} with ${options.type} data`);
  };

  const searchParams = useSearchParams();

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toastShownRef = useRef(false);


  const fetchRoles = async () => {
    if (!canAccess(user?.permissions, 'role.read')) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await rolesApi.getList();
      setRoles(Array.isArray(res.data) ? res.data : []);
    } catch {
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Tampilkan alert jika ada success di param URL
  useEffect(() => {
    const success = searchParams.get("success");
    const role = searchParams.get("role");

    if (success && role && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Update" : "Registration";
      toastSuccess(`${action} Successful - Role ${decodeURIComponent(role)} has been ${success} successfully.`);

      window.history.replaceState({}, "", "/dashboard/role");
    }
  }, [searchParams]);

  const handleDeleteClick = async (role: any) => {
    const confirmed = await confirmToast({
      title: "Delete Role",
      message: `Are you sure you want to delete ${role.name}? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      variant: "danger",
    });
    if (confirmed) {
      try {
        await rolesApi.delete(role.id);
        toastSuccess(`Role ${role.name} has been deleted successfully`);
        fetchRoles();
      } catch {
        toastError("Failed to delete role. Please try again.");
      }
    }
  };

  return (
    <PermissionGuard permission="role.read">
    <div className="m-8">
      <PageHeader
        title="Role Management"
        description="Manage roles and permissions for users in the system."
        buttonText={canAccess(user?.permissions, "role.create") ? "Add New Role" : undefined}
        buttonHref={canAccess(user?.permissions, "role.create") ? "/dashboard/role/new" : undefined}
      />

      {/* table */}
      {isLoading ? (
        <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-gray-200 dark:border-gray-700 mt-5 p-12 text-center text-slate-500 dark:text-gray-400">
          Loading roles...
        </div>
      ) : (
        <RoleTable roles={roles} onDelete={handleDeleteClick} onExport={handleExport} />
      )}

      <div className="mt-12 grid grid-cols-12 gap-6">
        {/*banner biru */}
        <div className="col-span-12 lg:col-span-7">
          <RoleBanner />
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* card */}
          <RoleCard
            title="Total Roles"
            value={String(roles.length)}
            icon="group"
            iconColor="text-slate-600 dark:text-gray-400"
            trend={{
              value: `${roles.filter((r) => r.is_active).length} active`,
              color: "text-emerald-500",
              icon: "trending_up",
            }}
          />

          <RoleCard
            title="Active Roles"
            value={String(roles.filter((r) => r.is_active).length)}
            icon="verified_user"
            iconColor="text-blue-600"
            progressBar={{
              percentage: roles.length > 0 ? Math.round((roles.filter((r) => r.is_active).length / roles.length) * 100) : 0,
              label: "Utilization Capacity",
            }}
          />
        </div>
      </div>
      

    </div>
    </PermissionGuard>
  );
};

export default RolePage;

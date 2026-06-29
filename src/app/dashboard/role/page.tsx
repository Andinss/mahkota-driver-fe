"use client";
import { PageHeader } from "@/components/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RoleCard } from "@/components/role/role-list/card";
import { RoleBanner } from "@/components/role/role-list/role-banner";
import { RoleTable } from "@/components/role/role-list/role-list-table";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertDialog } from "@/components/ui/alert";
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
    alert(`Exporting role data as ${options.format} with ${options.type} data`);
  };

  const searchParams = useSearchParams();

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // confirm dialog delete
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

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

    if (success && role) {
      const action = success === "updated" ? "Update" : "Registration";
      setAlertTitle(`${action} Successful`);
      setAlertMessage(
        `Role ${decodeURIComponent(role)} has been ${success} successfully.`,
      );
      setAlertType("success");
      setIsAlertOpen(true);

      window.history.replaceState({}, "", "/dashboard/role");
    }
  }, [searchParams]);

  const handleDeleteClick = (role: any) => {
    setSelectedRole(role);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;
    setIsDeleting(true);
    try {
      await rolesApi.delete(selectedRole.id);
      setIsConfirmDeleteOpen(false);
      setAlertTitle("Delete Successful");
      setAlertMessage(`Role ${selectedRole.name} has been deleted successfully`);
      setAlertType("success");
      setIsAlertOpen(true);
      setSelectedRole(null);
      fetchRoles();
    } catch {
      setIsConfirmDeleteOpen(false);
      setAlertTitle("Delete Failed");
      setAlertMessage("Failed to delete role. Please try again.");
      setAlertType("error");
      setIsAlertOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
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
        <div className="bg-white rounded-2xl border border-gray-200 mt-5 p-12 text-center text-slate-500">
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
            iconColor="text-slate-600"
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
      {/* Confirm dialog delete */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        message={`Are you sure you want to delete ${selectedRole?.name}? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
        cancelText="Cancel"
        variant="danger"
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        confirmText="OK"
      />
    </div>
    </PermissionGuard>
  );
};

export default RolePage;

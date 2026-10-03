"use client";
import { PageHeader } from "@/components/page-header";
import {
  confirmToast,
  toastSuccess,
  toastError,
  toastInfo,
} from "@/components/ui/toast-provider";
import { RoleCard } from "@/components/role/role-list/card";
import { RoleBanner } from "@/components/role/role-list/role-banner";
import { RoleTable } from "@/components/role/role-list/role-list-table";
import { Pagination } from "@/components/ui/pagination";
import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ExportOptions } from "@/components/ui/export";
import { rolesApi } from "@/lib/api/roles";
import type { RoleItem } from "@/lib/types/role";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { PermissionGuard } from "@/components/auth-guard-permission";

const RolePage = () => {
  const { user } = useAuth();
  const handleExport = async (options: ExportOptions) => {
    if (!options) return;
    const params: Record<string, string | number | undefined> = {
      format: options.format,
      columns: options.columns.join(","),
      type: options.type,
    };
    if (options.type === "filtered" && search.trim()) {
      params.search = search.trim();
    }
    try {
      await rolesApi.exportData(params);
      toastInfo(`Exporting role data as ${options.format}`);
    } catch {
      toastError("Failed to export role data. Please try again.");
    }
  };

  const searchParams = useSearchParams();

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const toastShownRef = useRef(false);

  const fetchRoles = async () => {
    if (!canAccess(user?.permissions, "role.read")) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await rolesApi.getList({ is_active: "all" });
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

  useEffect(() => {
    const success = searchParams.get("success");
    const role = searchParams.get("role");

    if (success && role && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Update" : "Registration";
      toastSuccess(
        `${action} Successful - Role ${decodeURIComponent(role)} has been ${success} successfully.`,
      );
      window.history.replaceState({}, "", "/dashboard/roles");
    }
  }, [searchParams]);

  const filteredRoles = useMemo(() => {
    if (!search.trim()) return roles;
    const q = search.toLowerCase();
    return roles.filter((r) => r.name.toLowerCase().includes(q));
  }, [roles, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRoles.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const pagedRoles = filteredRoles.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

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
          title="Role List Overview"
          description="Manage roles and permissions for users in the system."
          buttonText={
            canAccess(user?.permissions, "role.create")
              ? "Add New Role"
              : undefined
          }
          buttonHref={
            canAccess(user?.permissions, "role.create")
              ? "/dashboard/roles/new"
              : undefined
          }
        />

        {/* Search */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mt-5">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Cari nama role..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-lg">
                    close
                  </span>
                </button>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {filteredRoles.length} dari {roles.length} role
            </span>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mt-5 p-12 text-center text-slate-500 dark:text-slate-400">
            Loading roles...
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mt-5 overflow-hidden">
            <RoleTable
              roles={pagedRoles}
              onDelete={handleDeleteClick}
              onExport={handleExport}
            />
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalResults={filteredRoles.length}
              resultsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setItemsPerPage(size);
                setCurrentPage(1);
              }}
            />
          </div>
        )}

        <div className="mt-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <RoleBanner />
          </div>
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <RoleCard
              title="Total Roles"
              value={String(roles.length)}
              icon="group"
              iconColor="text-slate-600 dark:text-slate-400"
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
                percentage:
                  roles.length > 0
                    ? Math.round(
                        (roles.filter((r) => r.is_active).length /
                          roles.length) *
                          100,
                      )
                    : 0,
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

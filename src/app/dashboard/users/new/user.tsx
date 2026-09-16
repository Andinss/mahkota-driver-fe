"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { AddUserForm, UserFormData } from "@/components/user/new/add-user-form";
import { confirmToast, toastError } from "@/components/ui/toast-provider";
import CardUser from "@/components/user/new/card-user";
import { usersApi } from "@/lib/api/users";
import { rolesApi } from "@/lib/api/roles";
import { driverApi } from "@/lib/api/driver";
import { useAuth } from "@/lib/auth-context";
import type { RoleItem } from "@/lib/types/role";
import type { CreateUserPayload, UserItem } from "@/lib/types/user";
import type { DriverItem } from "@/lib/types/driver";

export default function AddNewUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("id");
  const { user } = useAuth();

  const [mode, setMode] = useState<"add" | "edit">(userIdParam ? "edit" : "add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<UserFormData | undefined>();
  const [isLoadingUser, setIsLoadingUser] = useState(!!userIdParam);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<{ id: string; name: string; employeeId: string; email: string }[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");

  const isAdmin = user?.permissions?.includes("role.create") ?? false;
  const filteredRoles = isAdmin
    ? roles
    : roles.filter((r) => r.code?.toUpperCase() === "DRIVER");

  useEffect(() => {
    rolesApi.getList().then((res) => {
      const list = Array.isArray(res.data) ? res.data : [];
      setRoles(list);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    Promise.all([
      driverApi.getList({ limit: 1000 }),
      usersApi.getList({ limit: 1000 }),
    ]).then(([driverRes, userRes]) => {
      const driverItems = Array.isArray(driverRes.data) ? driverRes.data : [];
      const userItems = Array.isArray(userRes.data) ? userRes.data : [];
      const linkedDriverIds = new Set(
        userItems
          .map((u: UserItem) => (u as any).driver_id)
          .filter(Boolean)
      );
      const driversWithoutUser = driverItems
        .filter((d: DriverItem) => !linkedDriverIds.has(d.id))
        .map((d: DriverItem) => ({
          id: d.id,
          name: `${d.first_name} ${d.last_name}`.trim(),
          employeeId: d.employee_id,
          email: d.email,
        }));
      setAvailableDrivers(driversWithoutUser);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (userIdParam) {
      setMode("edit");
      setIsLoadingUser(true);
      usersApi
        .getById(userIdParam)
        .then((res: any) => {
          const u = res?.data ?? res;
          if (u?.username || u?.email) {
            setInitialData({
              username: u.username || "",
              fullname: u.fullname || "",
              email: u.email || "",
              role: u.role_id || "",
              isActive: u.is_active !== undefined ? u.is_active : true,
              driver_id: u.driver_id || "",
            });
            if (u.driver_id) {
              setSelectedDriverId(u.driver_id);
            }
          }
          setIsLoadingUser(false);
        })
        .catch(() => {
          setMode("add");
          setIsLoadingUser(false);
        });
    } else {
      setMode("add");
      setInitialData(undefined);
    }
  }, [userIdParam]);

  const handleSubmit = async (data: UserFormData) => {
    const actionLabel = mode === "add" ? "create this user" : "update this user";
    const actionTitle = mode === "add" ? "Confirm Registration" : "Confirm Update";
    const confirmLabel = mode === "add" ? "Yes, Create User" : "Yes, Update User";
    const confirmed = await confirmToast({
      title: actionTitle,
      message: `Are you sure you want to ${actionLabel}? Please review all information carefully. This action cannot be undone.`,
      confirmText: confirmLabel,
      variant: "info",
    });
    if (confirmed) {
      setIsSubmitting(true);
      try {
        if (mode === "edit" && userIdParam) {
          const payload: Partial<CreateUserPayload> = {
            username: data.username,
            email: data.email,
            role_id: data.role,
            is_active: data.isActive,
            driver_id: data.driver_id,
          };
          await usersApi.update(userIdParam, payload);
        } else {
          const payload: CreateUserPayload = {
            username: data.username,
            fullname: data.fullname,
            email: data.email,
            role_id: data.role,
            is_active: data.isActive,
            driver_id: data.driver_id,
          };
          await usersApi.create(payload);
        }

        const action = mode === "edit" ? "updated" : "registered";
        const userName = data?.username || "New User";
        router.push(`/dashboard/users?success=${action}&user=${encodeURIComponent(userName)}`);
      } catch {
        toastError("Failed to save user. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/users");
  };

  const handleSaveDraft = () => {
    console.log("Save draft:", initialData);
  };

  if (isLoadingUser) {
    return (
      <PermissionGuard permission="user.create">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[400px]">
          <p className="text-slate-500 dark:text-slate-400">Loading user data...</p>
        </div>
      </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permission="user.create">
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {mode === "add" ? "Tambah User Baru" : "Edit User"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mode === "add" ? "Lengkapi form di bawah untuk membuat user baru" : "Perbarui informasi user"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          <AddUserForm
            key={mode === "edit" ? userIdParam : "add"}
            mode={mode}
            initialData={initialData}
            roles={filteredRoles}
            drivers={availableDrivers}
            selectedDriverId={selectedDriverId}
            onDriverChange={setSelectedDriverId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
          />
          <CardUser />
        </div>
      </div>
    </div>
    </PermissionGuard>
  );
}

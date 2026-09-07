"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { AddUserForm, UserFormData } from "@/components/user/new/add-user-form";
import { confirmToast, toastError } from "@/components/ui/toast-provider";
import CardUser from "@/components/user/new/card-user";
import { usersApi } from "@/lib/api/users";
import { rolesApi } from "@/lib/api/roles";
import { useAuth } from "@/lib/auth-context";
import type { RoleItem } from "@/lib/types/role";
import type { CreateUserPayload } from "@/lib/types/user";

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
            });
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
          };
          await usersApi.update(userIdParam, payload);
        } else {
          const payload: CreateUserPayload = {
            username: data.username,
            fullname: data.fullname,
            email: data.email,
            role_id: data.role,
            is_active: data.isActive,
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
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 dark:text-slate-400">Loading user data...</p>
      </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permission="user.create">
    <div className="p-8">
      <AddUserForm
        key={mode === "edit" ? userIdParam : "add"}
        mode={mode}
        initialData={initialData}
        roles={filteredRoles}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        isSubmitting={isSubmitting}
      />
      <CardUser />

      

    </div>
    </PermissionGuard>
  );
}

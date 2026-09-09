"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import Advice from "@/components/role/new/advice";
import GeneralInformation from "@/components/role/new/general";
import RoleHierarchy from "@/components/role/new/hierarchy";
import { PermissionList } from "@/components/role/new/permission-list";
import { confirmToast, toastError } from "@/components/ui/toast-provider";
import { rolesApi } from "@/lib/api/roles";
import { permissionsApi } from "@/lib/api/permissions";
import type { PermissionItem } from "@/lib/types/permission";
import type { CreateRolePayload } from "@/lib/types/role";


interface FormErrors {
  roleName?: string;
}

const RoleFormPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleIdParam = searchParams.get("id");

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    roleName: "",
    roleDescription: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [allPermissions, setAllPermissions] = useState<PermissionItem[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [initialPermissionIds, setInitialPermissionIds] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<string>("Never (Draft)");

  useEffect(() => {
    permissionsApi.getList().then((res) => {
      const list = Array.isArray(res.data) ? res.data : [];
      setAllPermissions(list);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setErrors({});
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (field === "roleName") {
      value = value.replace(/[^a-zA-Z0-9\s'-]/g, "");
    }
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (hasSubmitted && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const roleNameValue = formValues.roleName.trim();

    if (!roleNameValue) {
      newErrors.roleName = "Role name is required";
      isValid = false;
    } else if (!/^[a-zA-Z0-9\s'-]+$/.test(roleNameValue)) {
      newErrors.roleName = "Role name can only contain letters, numbers, spaces, hyphens, and apostrophes";
      isValid = false;
    } else if (roleNameValue.length < 2) {
      newErrors.roleName = "Role name must be at least 2 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (roleIdParam) {
      setMode("edit");
      rolesApi.getById(roleIdParam).then((res) => {
        const role = res.data;
        setFormValues({
          roleName: role.name,
          roleDescription: role.description || "",
        });

        rolesApi.getPermissions(roleIdParam).then((permRes) => {
          const perms = Array.isArray(permRes.data) ? permRes.data : [];
          const ids = perms.map((p: any) => p.id);
          setSelectedPermissionIds(ids);
          setInitialPermissionIds(ids);
        }).catch(() => {});

        setLastSaved("Draft saved");
      }).catch(() => {
        setMode("add");
        setFormValues({
          roleName: "",
          roleDescription: "",
        });
        setSelectedPermissionIds([]);
        setLastSaved("Never (Draft)");
      });
    } else {
      setMode("add");
      setFormValues({
        roleName: "",
        roleDescription: ""
      });
      setSelectedPermissionIds([]);
      setLastSaved("Never (Draft)");
    }
  }, [roleIdParam]);

  const handleSaveClick = async () => {
    setHasSubmitted(true);

    if (!validateForm()) {
      return;
    }

    const confirmed = await confirmToast({
      title: mode === "add" ? "Confirm Registration" : "Confirm Update",
      message:
        mode === "add"
          ? `Are you sure you want to create this role? Please review all information carefully. This action cannot be undone.`
          : `Are you sure you want to update this role? Please review all information carefully.`,
      confirmText: mode === "add" ? "Yes, Create Role" : "Yes, Update Role",
      cancelText: "Review Again",
      variant: "info",
    });

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const code = formValues.roleName.toLowerCase().replace(/\s+/g, "_");
      const payload: CreateRolePayload = {
        name: formValues.roleName,
        description: formValues.roleDescription || undefined,
        code,
      };

      if (mode === "edit" && roleIdParam) {
        await rolesApi.update(roleIdParam, payload);
        const toAdd = selectedPermissionIds.filter((id) => !initialPermissionIds.includes(id));
        const toRemove = initialPermissionIds.filter((id) => !selectedPermissionIds.includes(id));
        if (toAdd.length > 0) {
          await rolesApi.assignPermissions(roleIdParam, { permissionIds: toAdd });
        }
        if (toRemove.length > 0) {
          await rolesApi.removePermissions(roleIdParam, { permissionIds: toRemove });
        }
      } else {
        const created = await rolesApi.create(payload);
        const newRoleId = created.data?.id || (created as any)?.id;
        if (newRoleId && selectedPermissionIds.length > 0) {
          await rolesApi.assignPermissions(newRoleId, { permissionIds: selectedPermissionIds });
        }
      }

      setIsSubmitting(false);
      const action = mode === "edit" ? "updated" : "registered";
      const roleNameForRedirect = formValues.roleName || "New Role";

      router.push(`/dashboard/role?success=${action}&role=${encodeURIComponent(roleNameForRedirect)}`);
    } catch (err: any) {
      setIsSubmitting(false);
      toastError(err?.message || "Failed to save role. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/role");
  };

  return (
    <PermissionGuard permission="role.create">
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
                {mode === "add" ? "Tambah Role Baru" : "Edit Role"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mode === "add" ? "Lengkapi form di bawah untuk membuat role baru" : "Perbarui informasi role"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          <GeneralInformation 
            roleName={formValues.roleName}
            setRoleName={(value) => handleInputChange("roleName", value)}
            roleDescription={formValues.roleDescription}
            setRoleDescription={(value) => handleInputChange("roleDescription", value)}
            error={hasSubmitted ? errors.roleName : undefined}
          />
          {allPermissions.length > 0 && (
            <PermissionList
              allPermissions={allPermissions}
              selectedIds={selectedPermissionIds}
              onChange={setSelectedPermissionIds}
            />
          )}
          <RoleHierarchy allPermissions={allPermissions} selectedIds={selectedPermissionIds} />
          <Advice />

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSubmitting || (hasSubmitted && !formValues.roleName.trim())}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                {isSubmitting ? "hourglass_empty" : "check_circle"}
              </span>
              {isSubmitting ? "Menyimpan..." : mode === "add" ? "Simpan Role" : "Update Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </PermissionGuard>
  );
};

export default RoleFormPage;

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import Advice from "@/components/role/new/advice";
import GeneralInformation from "@/components/role/new/general";
import RoleHierarchy from "@/components/role/new/hierarchy";
import { PermissionList } from "@/components/role/new/permission-list";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { rolesApi } from "@/lib/api/roles";
import { permissionsApi } from "@/lib/api/permissions";
import type { PermissionItem } from "@/lib/types/permission";
import type { CreateRolePayload } from "@/lib/types/role";
import { AlertDialog } from "@/components/ui/alert";


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

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSaveClick = () => {
    setHasSubmitted(true);

    if (!validateForm()) {
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsSubmitting(true);
    setIsConfirmOpen(false);

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
      setErrorMessage(err?.message || "Failed to save role. Please try again.");
      setIsErrorOpen(true);
    }
  };

  const handleCancel = () => {
      router.push("/dashboard/role");
  };

  return (
    <PermissionGuard permission="role.create">
    <div className="m-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-8 space-y-6">
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
        </div>
        <div className="lg:col-span-4 space-y-6">
          <RoleHierarchy allPermissions={allPermissions} selectedIds={selectedPermissionIds} />
          <Advice />
        </div>
      </div>

      <div className="mt-12 mb-8 flex items-center justify-between p-6 bg-white dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg sticky bottom-8 z-10">
        <div className="hidden sm:block">
          <p className="text-xs text-gray-500 dark:text-gray-400">Last saved: {lastSaved}</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:opacity-80 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSubmitting || (hasSubmitted && !formValues.roleName.trim())}
            className="flex-1 sm:flex-none px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:bg-gray-400 dark:disabled:bg-gray-600 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">
              {mode === "add" ? "add" : "save"}
            </span>
            {isSubmitting ? "Saving..." : mode === "add" ? "Create Role" : "Update Role"}
          </button>
        </div>
      </div>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title={mode === "add" ? "Confirm Registration" : "Confirm Update"}
        message={
          mode === "add"
            ? `Are you sure you want to create this role? Please review all information carefully. This action cannot be undone.`
            : `Are you sure you want to update this role? Please review all information carefully.`
        }
        confirmText={mode === "add" ? "Yes, Create Role" : "Yes, Update Role"}
        cancelText="Review Again"
        variant="info"
      />

      <AlertDialog
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Error"
        message={errorMessage}
        type="error"
      />
    </div>
    </PermissionGuard>
  );
};

export default RoleFormPage;

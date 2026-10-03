import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { RoleItem, CreateRolePayload, UpdateRolePayload, AddPermissionsToRolePayload } from "../types/role";
import type { PermissionItem } from "../types/permission";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const rolesApi = {
  getList: (params?: { is_active?: "true" | "false" | "all" }) =>
    api.get<SuccessResponse<RoleItem[]>>(
      "/roles",
      params as Record<string, string | undefined>,
    ),

  getById: (id: string) =>
    api.get<SuccessResponse<RoleItem>>(`/roles/${id}`),

  create: (payload: CreateRolePayload) =>
    api.post<SuccessResponse<RoleItem>>("/roles", payload),

  update: (id: string, payload: UpdateRolePayload) =>
    api.patch<SuccessResponse<RoleItem>>(`/roles/${id}`, payload),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/roles/${id}`),

  assignPermissions: (id: string, payload: AddPermissionsToRolePayload) =>
    api.post<SuccessResponse<RoleItem>>(`/roles/${id}/permissions`, payload),

  removePermissions: (id: string, payload: AddPermissionsToRolePayload) =>
    api.deleteWithBody<SuccessResponse<RoleItem>>(`/roles/${id}/permissions`, payload),

  getPermissions: (id: string) =>
    api.get<SuccessResponse<PermissionItem[]>>(`/roles/${id}/permissions`),

  exportData: async (params: Record<string, string | number | undefined>) => {
    const { blob, filename } = await api.download("/roles/export", params);
    triggerDownload(blob, filename);
  },
};

import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { RoleItem, CreateRolePayload, UpdateRolePayload, AddPermissionsToRolePayload } from "../types/role";
import type { PermissionItem } from "../types/permission";

export const rolesApi = {
  getList: () =>
    api.get<SuccessResponse<RoleItem[]>>("/roles"),

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
};

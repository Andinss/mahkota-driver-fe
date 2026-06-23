import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { PermissionItem, CreatePermissionPayload, UpdatePermissionPayload } from "../types/permission";

export const permissionsApi = {
  getList: () =>
    api.get<SuccessResponse<PermissionItem[]>>("/permissions"),

  getById: (id: string) =>
    api.get<SuccessResponse<PermissionItem>>(`/permissions/${id}`),

  create: (payload: CreatePermissionPayload) =>
    api.post<SuccessResponse<PermissionItem>>("/permissions", payload),

  update: (id: string, payload: UpdatePermissionPayload) =>
    api.patch<SuccessResponse<PermissionItem>>(`/permissions/${id}`, payload),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/permissions/${id}`),
};

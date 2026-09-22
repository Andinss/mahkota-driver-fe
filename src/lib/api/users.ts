import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type {
  UserItem,
  UserSummary,
  CreateUserPayload,
  UpdateUserPayload,
  UserListParams,
} from "../types/user";

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

export const usersApi = {
  getList: (params?: UserListParams) =>
    api.get<SuccessResponsePaginated<UserItem>>(
      "/users",
      params as Record<string, string | number | undefined>,
    ),

  getSummary: () =>
    api.get<SuccessResponse<UserSummary>>("/users/summary"),

  getById: (id: string) =>
    api.get<SuccessResponse<UserItem>>(`/users/${id}`),

  create: (payload: CreateUserPayload) =>
    api.post<SuccessResponse<UserItem>>("/users/create", payload),

  update: (id: string, payload: UpdateUserPayload) =>
    api.put<SuccessResponse<UserItem>>(`/users/update/${id}`, payload),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/users/delete/${id}`),

  exportData: async (params: Record<string, string | number | undefined>) => {
    const { blob, filename } = await api.download("/users/export", params);
    triggerDownload(blob, filename);
  },
};

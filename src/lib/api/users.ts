import { api } from "../api-http";
import type { ApiResponse, ApiResponsePaginated } from "../types/api";
import type { UserItem, CreateUserPayload, UpdateUserPayload, UserListParams } from "../types/user";

export const usersApi = {
  getList: (params?: UserListParams) =>
    api.get<ApiResponsePaginated<UserItem>>("/users", params as Record<string, string | number | undefined>),

  getById: (id: string) =>
    api.get<ApiResponse<UserItem>>(`/users/${id}`),

  create: (payload: CreateUserPayload) =>
    api.post<ApiResponse<UserItem>>("/users", payload),

  update: (id: string, payload: UpdateUserPayload) =>
    api.patch<ApiResponse<UserItem>>(`/users/${id}`, payload),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/users/${id}`),
};

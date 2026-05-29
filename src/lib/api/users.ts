import { api } from "../api-http";
import type { ApiResponse, ApiResponsePaginated } from "../types/api";
import type {
  UserItem,
  CreateUserPayload,
  UpdateUserPayload,
  UserListParams,
} from "../types/user";

export const usersApi = {
  getList: (params?: UserListParams) =>
    api.get<ApiResponsePaginated<UserItem>>(
      "/users",
      params as Record<string, string | number | undefined>,
    ),

  getById: (id: string) => api.get<UserItem>(`/users/${id}`),

  create: (payload: CreateUserPayload) =>
    api.post<ApiResponse<UserItem>>("/users/create", payload),

  update: (id: string, payload: UpdateUserPayload) =>
    api.put<ApiResponse<UserItem>>(`/users/update/${id}`, payload),

  delete: (id: string) => api.delete<ApiResponse<void>>(`/users/delete/${id}`),
};

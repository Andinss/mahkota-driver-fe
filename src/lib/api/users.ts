import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type {
  UserItem,
  UserSummary,
  CreateUserPayload,
  UpdateUserPayload,
  UserListParams,
} from "../types/user";

export const usersApi = {
  getList: (params?: UserListParams) =>
    api.get<SuccessResponse<UserItem[]>>(
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
};

import { api } from "../api-http";
import type { ApiResponse, ApiResponsePaginated } from "../types/api";
import type { DriverItem, DriverListParams } from "../types/driver";

export const driverApi = {
  getList: (params?: DriverListParams) =>
    api.get<ApiResponsePaginated<DriverItem>>("/drivers", params as Record<string, string | number | undefined>),

  getById: (id: string) =>
    api.get<ApiResponse<DriverItem>>(`/drivers/${id}`),

  create: (payload: FormData) =>
    api.upload<ApiResponse<DriverItem>>("/drivers", payload),

  update: (id: string, payload: FormData) =>
    api.upload<ApiResponse<DriverItem>>(`/drivers/${id}`, payload),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/drivers/${id}`),
};

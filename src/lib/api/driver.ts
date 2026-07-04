import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type { DriverItem, DriverListParams, DriverSummary } from "../types/driver";

export const driverApi = {
  getList: (params?: DriverListParams) =>
    api.get<SuccessResponsePaginated<DriverItem>>(
      "/drivers",
      params as Record<string, string | number | undefined>,
    ),

  getSummary: () =>
    api.get<SuccessResponse<DriverSummary>>("/drivers/summary"),

  getById: (id: string) =>
    api.get<SuccessResponse<DriverItem>>(`/drivers/${id}`),

  getDetail: (id: string) =>
    api.get<SuccessResponse<DriverItem>>(`/drivers/detail/${id}`),

  create: (formData: FormData) =>
    api.upload<SuccessResponse<DriverItem>>("/drivers/create", formData),

  update: (id: string, payload: FormData) =>
    api.uploadPut<SuccessResponse<DriverItem>>(`/drivers/update/${id}`, payload),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/drivers/delete/${id}`),
};

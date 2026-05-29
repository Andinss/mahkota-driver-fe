import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { DriverItem, DriverListParams } from "../types/driver";

export const driverApi = {
  getList: (params?: DriverListParams) =>
    api.get<SuccessResponse<DriverItem[]>>("/driver", params as Record<string, string | number | undefined>),

  create: (formData: FormData) =>
    api.upload<SuccessResponse<DriverItem>>("/driver/create", formData),

  update: (id: string, payload: FormData) =>
    api.uploadPut<SuccessResponse<DriverItem>>(`/driver/update/${id}`, payload),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/driver/delete/${id}`),
};

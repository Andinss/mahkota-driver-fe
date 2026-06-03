import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { VehicleItem, VehicleListParams } from "../types/vehicle";

export const vehicleApi = {
  getList: (params?: VehicleListParams) =>
    api.get<SuccessResponse<VehicleItem[]>>("/vehicles", params as Record<string, string | number | undefined>),

  create: (formData: FormData) =>
    api.upload<SuccessResponse<VehicleItem>>("/vehicles/create", formData),

  update: (id: string, payload: FormData) =>
    api.uploadPut<SuccessResponse<VehicleItem>>(`/vehicles/update/${id}`, payload),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/vehicles/delete/${id}`),
};

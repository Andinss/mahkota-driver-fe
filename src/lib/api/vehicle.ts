import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type { VehicleItem, VehicleListParams, VehicleSummary } from "../types/vehicle";

export const vehicleApi = {
  getList: (params?: VehicleListParams) =>
    api.get<SuccessResponsePaginated<VehicleItem>>(
      "/vehicles",
      params as Record<string, string | number | undefined>,
    ),

  getSummary: () =>
    api.get<SuccessResponse<VehicleSummary>>("/vehicles/summary"),

  getById: (id: string) =>
    api.get<SuccessResponse<VehicleItem>>(`/vehicles/${id}`),

  getDetail: (id: string) =>
    api.get<SuccessResponse<VehicleItem>>(`/vehicles/detail/${id}`),

  create: (formData: FormData) =>
    api.upload<SuccessResponse<VehicleItem>>("/vehicles/create", formData),

  update: (id: string, payload: FormData) =>
    api.uploadPut<SuccessResponse<VehicleItem>>(`/vehicles/update/${id}`, payload),

  updateStatus: (id: string, is_active: boolean) =>
    api.put<SuccessResponse<VehicleItem>>(`/vehicles/status/${id}`,{ is_active },),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/vehicles/delete/${id}`),

  exportData: async (params: Record<string, string | number | undefined>) => {
    const { blob, filename } = await api.download("/vehicles/export", params);
    triggerDownload(blob, filename);
  },
};

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

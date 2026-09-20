import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type { DriverItem, DriverListParams, DriverSummary } from "../types/driver";

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

export const driverApi = {
  getMe: () =>
    api.get<SuccessResponse<DriverItem>>("/drivers/me"),

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

  exportData: async (params: Record<string, string | number | undefined>) => {
    const { blob, filename } = await api.download("/drivers/export", params);
    triggerDownload(blob, filename);
  },
};

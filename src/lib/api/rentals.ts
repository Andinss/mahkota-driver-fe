import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type { RentalTransaction, RentalListParams, RentalSummary } from "../types/rentals.ts";

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

export const rentalApi = {
  getList: (params?: RentalListParams) =>
    api.get<SuccessResponsePaginated<RentalTransaction>>(
      "/rentals",
      params as Record<string, string | number | undefined>,
    ),

  getSummary: () =>
    api.get<SuccessResponse<RentalSummary>>("/rentals/summary"),

  getById: (id: string) =>
    api.get<SuccessResponse<RentalTransaction>>(`/rentals/${id}`),

  getDetail: (id: string) =>
    api.get<SuccessResponse<RentalTransaction>>(`/rentals/detail/${id}`),

  create: (formData: FormData) =>
    api.upload<SuccessResponse<RentalTransaction>>("/rentals/create", formData),

  update: (id: string, payload: FormData) =>
    api.uploadPut<SuccessResponse<RentalTransaction>>(
      `/rentals/update/${id}`,
      payload,
    ),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/rentals/delete/${id}`),

  exportData: async (params: Record<string, string | number | undefined>) => {
    const { blob, filename } = await api.download("/rentals/export", params);
    triggerDownload(blob, filename);
  },
};

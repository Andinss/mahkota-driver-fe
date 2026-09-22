import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type {
  VendorVehicle,
  VendorVehicleListParams,
  VendorVehicleSummary,
} from "../types/vendor-vehicle";

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

export const vendorApi = {
  getList: (params?: VendorVehicleListParams) =>
    api.get<SuccessResponsePaginated<VendorVehicle>>(
      "/vendor-vehicles",
      params as Record<string, string | number | undefined>,
    ),

  getSummary: () =>
    api.get<SuccessResponse<VendorVehicleSummary>>("/vendor-vehicles/summary"),

  getById: (id: string) =>
    api.get<SuccessResponse<VendorVehicle>>(`/vendor-vehicles/${id}`),

  getDetail: (id: string) =>
    api.get<SuccessResponse<VendorVehicle>>(`/vendor-vehicles/detail/${id}`),

  create: (formData: FormData) =>
    api.upload<SuccessResponse<VendorVehicle>>(
      "/vendor-vehicles/create",
      formData,
    ),

  update: (id: string, payload: FormData) =>
    api.uploadPut<SuccessResponse<VendorVehicle>>(
      `/vendor-vehicles/update/${id}`,
      payload,
    ),

  updateStatus: (id: string, status: "active" | "inactive") =>
    api.put<SuccessResponse<VendorVehicle>>(
      `/vendor-vehicles/status/${id}`,
      { status },
    ),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/vendor-vehicles/delete/${id}`),

  exportData: async (params: Record<string, string | number | undefined>) => {
    const { blob, filename } = await api.download(
      "/vendor-vehicles/export",
      params,
    );
    triggerDownload(blob, filename);
  },
};
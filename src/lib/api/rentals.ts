import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type { RentalTransaction, RentalListParams, RentalSummary } from "../types/rentals.ts";

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

  updatePaymentStatus: (id: string, paymentStatus: string) =>
    api.patch<SuccessResponse<RentalTransaction>>(`/rentals/${id}/status`, { payment_status: paymentStatus }),
};

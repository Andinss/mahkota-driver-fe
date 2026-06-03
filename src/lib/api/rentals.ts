import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { RentalTransaction, RentalListParams } from "../types/rentals.ts";

export const rentalApi = {
  getList: (params?: RentalListParams) =>
    api.get<SuccessResponse<RentalTransaction[]>>(
      "/rentals",
      params as Record<string, string | number | undefined>,
    ),

  create: (formData: FormData) =>
    api.upload<SuccessResponse<RentalTransaction>>("/rentals/create", formData),

  update: (id: string, payload: FormData) =>
    api.uploadPut<SuccessResponse<RentalTransaction>>(
      `/rentals/update/${id}`,
      payload,
    ),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/rentals/delete/${id}`),
};

import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type { FinanceItem, FinanceListParams, CreateFinancePayload, UpdateFinancePayload } from "../types/finances.ts";

export const financeApi = {
  getList: (params?: FinanceListParams) =>
    api.get<SuccessResponsePaginated<FinanceItem>>(
      "/finances",
      params as Record<string, string | number | undefined>,
    ),

  getById: (id: string) =>
    api.get<SuccessResponse<FinanceItem>>(`/finances/${id}`),

  create: (payload: CreateFinancePayload) =>
    api.post<SuccessResponse<FinanceItem>>("/finances/create", payload),

  update: (id: string, payload: UpdateFinancePayload) =>
    api.put<SuccessResponse<FinanceItem>>(`/finances/update/${id}`, payload),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/finances/delete/${id}`),
};

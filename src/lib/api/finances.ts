import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type { FinanceItem, FinanceListParams, FinanceSummary, CreateFinancePayload, UpdateFinancePayload, LatePaymentItem, LatePaymentStats } from "../types/finances.ts";

export const financeApi = {
  getList: (params?: FinanceListParams) =>
    api.get<SuccessResponsePaginated<FinanceItem>>(
      "/finances",
      params as Record<string, string | number | undefined>,
    ),

  getSummary: () =>
    api.get<SuccessResponse<FinanceSummary>>("/finances/summary"),

  getById: (id: string) =>
    api.get<SuccessResponse<FinanceItem>>(`/finances/${id}`),

  getDetail: (id: string) =>
    api.get<SuccessResponse<FinanceItem>>(`/finances/detail/${id}`),

  create: (payload: CreateFinancePayload) =>
    api.post<SuccessResponse<FinanceItem>>("/finances/create", payload),

  update: (id: string, payload: UpdateFinancePayload) =>
    api.put<SuccessResponse<FinanceItem>>(`/finances/update/${id}`, payload),

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/finances/delete/${id}`),

  // Late payments
  lateList: () =>
    api.get<SuccessResponse<LatePaymentItem[]>>("/late-payments"),

  lateStats: () =>
    api.get<SuccessResponse<LatePaymentStats>>("/late-payments/stats"),

  lateApprove: (id: string, adminNote?: string) =>
    api.post<SuccessResponse<LatePaymentItem>>(`/late-payments/${id}/approve`, { admin_note: adminNote }),

  lateReject: (id: string, adminNote?: string) =>
    api.post<SuccessResponse<LatePaymentItem>>(`/late-payments/${id}/reject`, { admin_note: adminNote }),

  exportData: async (params: Record<string, string | number | undefined>) => {
    const { blob, filename } = await api.download("/finances/export", params);
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

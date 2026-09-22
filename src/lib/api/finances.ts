import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type {
  FinanceItem,
  FinanceListParams,
  FinanceSummary,
  CreateFinancePayload,
  UpdateFinancePayload,
  LatePaymentItem,
  LatePaymentStats,
  FinanceMonthlySummary,
  DriverFinanceSummary,
  FinancePaymentItem,
  CreateFinancePaymentPayload,
  UpdateFinancePaymentPayload,
  DailyPaymentItem,
  PayDailyPaymentPayload,
} from "../types/finances.ts";

export const financeApi = {
  getList: (params?: FinanceListParams) =>
    api.get<SuccessResponsePaginated<FinanceItem>>(
      "/finances",
      params as Record<string, string | number | undefined>,
    ),

  getMyFinances: (params?: Record<string, string | number | undefined>) =>
    api.get<SuccessResponsePaginated<FinanceItem>>(
      "/finances/my-finances",
      params,
    ),

  createMyPayment: (financeId: string, payload: CreateFinancePaymentPayload) =>
    api.post<SuccessResponse<FinanceItem>>(
      `/finances/my-finances/${financeId}/payments`,
      payload,
    ),

  getSummary: () =>
    api.get<SuccessResponse<FinanceSummary>>("/finances/summary"),

  getAdminFees: (params?: Record<string, string | number | undefined>) =>
    api.get<SuccessResponsePaginated<FinanceItem>>(
      "/finances/admin-fees",
      params,
    ),

  getDailyPayments: (params?: Record<string, string | number | undefined>) =>
    api.get<SuccessResponsePaginated<DailyPaymentItem>>(
      "/daily-payments",
      params,
    ),

  getMyDailyPayments: (params?: Record<string, string | number | undefined>) =>
    api.get<SuccessResponsePaginated<DailyPaymentItem>>(
      "/daily-payments/my-daily-payments",
      params,
    ),

  getMyDailyPaymentById: (id: string) =>
    api.get<SuccessResponse<DailyPaymentItem>>(`/daily-payments/${id}`),

  payMyDailyPayment: (id: string, payload: PayDailyPaymentPayload) =>
    api.post<SuccessResponse<DailyPaymentItem>>(
      `/daily-payments/${id}/pay`,
      payload,
    ),

  getMyAdminFee: () =>
    api.get<SuccessResponse<FinanceItem>>("/finances/my-admin-fee"),

  updateDailyPaymentStatus: (id: string, status: string) =>
    api.patch<SuccessResponse<DailyPaymentItem>>(
      `/daily-payments/${id}/status?status=${status}`,
    ),

  getMonthlySummary: (year?: number) =>
    api.get<SuccessResponse<FinanceMonthlySummary>>(
      "/finances/monthly-summary",
      year ? { year } : undefined,
    ),

  getById: (id: string) =>
    api.get<SuccessResponse<FinanceItem>>(`/finances/${id}`),

  getDetail: (id: string) =>
    api.get<SuccessResponse<FinanceItem>>(`/finances/detail/${id}`),

  getDriverSummary: (driverId: string) =>
    api.get<SuccessResponse<DriverFinanceSummary>>(
      `/finances/driver/${driverId}/summary`,
    ),

  getPayments: (financeId: string) =>
    api.get<SuccessResponse<FinancePaymentItem[]>>(
      `/finances/${financeId}/payments`,
    ),

  createPayment: (financeId: string, payload: CreateFinancePaymentPayload) =>
    api.post<SuccessResponse<FinanceItem>>(
      `/finances/${financeId}/payments`,
      payload,
    ),

  updatePaymentStatus: (
    financeId: string,
    paymentId: string,
    payload: UpdateFinancePaymentPayload,
  ) =>
    api.patch<SuccessResponse<FinanceItem>>(
      `/finances/${financeId}/payments/${paymentId}`,
      payload,
    ),

  cancel: (id: string) =>
    api.patch<SuccessResponse<FinanceItem>>(`/finances/${id}/cancel`),

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
    api.post<SuccessResponse<LatePaymentItem>>(`/late-payments/${id}/approve`, {
      admin_note: adminNote,
    }),

  lateReject: (id: string, adminNote?: string) =>
    api.post<SuccessResponse<LatePaymentItem>>(`/late-payments/${id}/reject`, {
      admin_note: adminNote,
    }),

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
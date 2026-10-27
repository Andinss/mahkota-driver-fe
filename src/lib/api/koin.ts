import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type {
  DriverKoin,
  KoinTransaction,
  KoinSummary,
  TopUpKoinPayload,
  RefundKoinPayload,
  KoinTransactionParams,
} from "../types/koin";

export const koinApi = {
  getSummary: () => api.get<SuccessResponse<KoinSummary>>("/koin/summary"),

  getBalance: (driverId: string) =>
    api.get<SuccessResponse<DriverKoin>>(`/koin/driver/${driverId}`),

  topUp: (payload: TopUpKoinPayload) =>
    api.post<
      SuccessResponse<{
        driver_id: string;
        amount: number;
        balance_before: number;
        balance_after: number;
        transaction_id: string;
        reference_number: string;
      }>
    >("/koin/top-up", payload),

  deduct: (payload: any) =>
    api.post<
      SuccessResponse<{
        driver_id: string;
        amount: number;
        balance_before: number;
        balance_after: number;
        transaction_id: string;
      }>
    >("/koin/deduct", payload),

  refund: (payload: RefundKoinPayload) =>
    api.patch<
      SuccessResponse<{
        driver_id: string;
        amount: number;
        balance_before: number;
        balance_after: number;
        transaction_id: string;
      }>
    >("/koin/refund", payload),

  getTransactions: (driverId: string, params?: KoinTransactionParams) =>
    api.get<SuccessResponsePaginated<KoinTransaction>>(
      `/koin/transactions/${driverId}`,
      params as Record<string, string | number | undefined>,
    ),

  /**
   * Riwayat koin milik sendiri (portal driver) — driverId diambil dari
   * JWT di server, jadi tidak bisa melihat transaksi driver lain.
   */
  getMyTransactions: (params?: KoinTransactionParams) =>
    api.get<SuccessResponsePaginated<KoinTransaction>>(
      "/koin/my-transactions",
      params as Record<string, string | number | undefined>,
    ),

  getAllTransactions: (params?: KoinTransactionParams) =>
    api.get<SuccessResponsePaginated<KoinTransaction>>(
      `/koin/transactions`,
      params as Record<string, string | number | undefined>,
    ),

  exportTransactions: async (
    params: Record<string, string | number | undefined>,
  ) => {
    const { blob, filename } = await api.download("/koin/export", params);
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

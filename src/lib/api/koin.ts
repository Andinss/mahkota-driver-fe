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
  getSummary: () =>
    api.get<SuccessResponse<KoinSummary>>("/koin/summary"),

  getBalance: (driverId: string) =>
    api.get<SuccessResponse<DriverKoin>>(`/koin/driver/${driverId}`),

  topUp: (payload: TopUpKoinPayload) =>
    api.post<SuccessResponse<{ driver_id: string; amount: number; balance_before: number; balance_after: number; transaction_id: string; reference_number: string }>>(
      "/koin/top-up",
      payload,
    ),

  deduct: (payload: any) =>
    api.post<SuccessResponse<{ driver_id: string; amount: number; balance_before: number; balance_after: number; transaction_id: string }>>(
      "/koin/deduct",
      payload,
    ),

  refund: (payload: RefundKoinPayload) =>
    api.patch<SuccessResponse<{ driver_id: string; amount: number; balance_before: number; balance_after: number; transaction_id: string }>>(
      "/koin/refund",
      payload,
    ),

  getTransactions: (driverId: string, params?: KoinTransactionParams) =>
    api.get<SuccessResponsePaginated<KoinTransaction>>(
      `/koin/transactions/${driverId}`,
      params as Record<string, string | number | undefined>,
    ),

  getAllTransactions: (params?: KoinTransactionParams) =>
    api.get<SuccessResponsePaginated<KoinTransaction>>(
      `/koin/transactions`,
      params as Record<string, string | number | undefined>,
    ),
};
import { api } from "../api-http";
import type { SuccessResponse, SuccessResponsePaginated } from "../types/api";
import type {
  DriverSaldo,
  SaldoTransaction,
  SaldoSummary,
  TopUpSaldoPayload,
  DeductSaldoPayload,
  RefundSaldoPayload,
  SaldoTransactionParams,
} from "../types/saldo";

export const saldoApi = {
  getSummary: () =>
    api.get<SuccessResponse<SaldoSummary>>("/saldo/summary"),

  getBalance: (driverId: string) =>
    api.get<SuccessResponse<DriverSaldo>>(`/saldo/driver/${driverId}`),

  topUp: (payload: TopUpSaldoPayload) =>
    api.post<SuccessResponse<{ driver_id: string; amount: number; balance_before: number; balance_after: number; transaction_id: string }>>(
      "/saldo/top-up",
      payload,
    ),

  deduct: (payload: DeductSaldoPayload) =>
    api.post<SuccessResponse<{ driver_id: string; amount: number; balance_before: number; balance_after: number; transaction_id: string }>>(
      "/saldo/deduct",
      payload,
    ),

  refund: (payload: RefundSaldoPayload) =>
    api.patch<SuccessResponse<{ driver_id: string; amount: number; balance_before: number; balance_after: number; transaction_id: string }>>(
      "/saldo/refund",
      payload,
    ),

  getTransactions: (driverId: string, params?: SaldoTransactionParams) =>
    api.get<SuccessResponsePaginated<SaldoTransaction>>(
      `/saldo/transactions/${driverId}`,
      params as Record<string, string | number | undefined>,
    ),
};

import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type {
  CreateOutOfTownPayload,
  OutOfTownItem,
  OutOfTownStats,
} from "../types/out-of-town";

export const outOfTownApi = {
  /** Pengajuan izin keluar kota oleh driver. */
  createMy: (payload: CreateOutOfTownPayload) =>
    api.post<SuccessResponse<OutOfTownItem>>("/out-of-town/my", payload),

  /** Daftar pengajuan milik driver yang login. */
  listMine: () =>
    api.get<SuccessResponse<OutOfTownItem[]>>("/out-of-town/my"),

  /** Daftar semua pengajuan (halaman monitoring). */
  list: (status?: string) =>
    api.get<SuccessResponse<OutOfTownItem[]>>(
      "/out-of-town",
      status ? { status } : undefined,
    ),

  stats: () =>
    api.get<SuccessResponse<OutOfTownStats>>("/out-of-town/stats"),

  /** Statistik pengajuan milik driver yang login. */
  myStats: () =>
    api.get<SuccessResponse<OutOfTownStats>>("/out-of-town/my/stats"),

  getById: (id: string) =>
    api.get<SuccessResponse<OutOfTownItem>>(`/out-of-town/${id}`),

  approve: (id: string, adminNote?: string, feeAmount?: number) =>
    api.post<SuccessResponse<OutOfTownItem>>(`/out-of-town/${id}/approve`, {
      admin_note: adminNote,
      fee_amount: feeAmount,
    }),

  reject: (id: string, adminNote?: string) =>
    api.post<SuccessResponse<OutOfTownItem>>(`/out-of-town/${id}/reject`, {
      admin_note: adminNote,
    }),
};

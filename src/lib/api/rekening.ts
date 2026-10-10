import { api } from "../api-http";
import type { SuccessResponse } from "@/lib/types/api";
import type { Rekening, RekeningMethod } from "@/lib/types/rekening";

/**
 * API metode pembayaran -> endpoint backend `/api/method-payments`.
 * Create/update dikirim sebagai FormData (pola vendor-vehicle) karena
 * membawa file gambar QRIS.
 */

const normalize = (rekening: Rekening): Rekening => {
  const method: RekeningMethod =
    rekening.method === "qris" || rekening.method === "e_wallet"
      ? rekening.method
      : "bank";

  const isQris = method === "qris";

  return {
    ...rekening,
    method,
    provider: isQris ? null : rekening.provider ?? null,
    account_number: isQris ? null : rekening.account_number ?? null,
    account_holder: isQris ? null : rekening.account_holder ?? null,
    image_url: isQris ? rekening.image_url ?? null : null,
    description: rekening.description ?? "",
    is_active: rekening.is_active !== false,
  };
};

const normalizeList = (data: unknown): Rekening[] =>
  Array.isArray(data) ? data.map((item) => normalize(item as Rekening)) : [];

export const rekeningApi = {
  getList: async () => {
    const res = await api.get<SuccessResponse<Rekening[]>>("/method-payments");
    return { ...res, data: normalizeList(res.data) };
  },

  getById: async (id: string) => {
    const res = await api.get<SuccessResponse<Rekening>>(
      `/method-payments/${id}`,
    );
    return { ...res, data: normalize(res.data) };
  },

  create: async (payload: FormData) => {
    const res = await api.upload<SuccessResponse<Rekening>>(
      "/method-payments",
      payload,
    );
    return { ...res, data: normalize(res.data) };
  },

  update: async (id: string, payload: FormData) => {
    const res = await api.uploadPatch<SuccessResponse<Rekening>>(
      `/method-payments/${id}`,
      payload,
    );
    return { ...res, data: normalize(res.data) };
  },

  updateStatus: async (id: string, is_active: boolean) => {
    const res = await api.patch<SuccessResponse<Rekening>>(
      `/method-payments/${id}/status`,
      { is_active },
    );
    return { ...res, data: normalize(res.data) };
  },

  delete: (id: string) =>
    api.delete<SuccessResponse<void>>(`/method-payments/${id}`),
};

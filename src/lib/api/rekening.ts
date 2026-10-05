import { dummyRekening } from "@/lib/data/rekening";
import type { SuccessResponse } from "@/lib/types/api";
import type { Rekening, RekeningInput, RekeningType } from "@/lib/types/rekening";

/**
 * TODO(single): ganti store in-memory ini dengan pemanggilan HTTP
 * (`api.get("/rekening")`, dst.) saat endpoint rekening sudah tersedia di backend.
 */

let store: Rekening[] = dummyRekening.map((item) => ({ ...item }));

const ok = <T,>(data: T, message: string): SuccessResponse<T> => ({
  success: true,
  message,
  data,
});

const wait = () => new Promise((resolve) => setTimeout(resolve, 250));

const normalize = (rekening: Rekening): Rekening => ({
  ...rekening,
  type: (rekening.type === "utama" ? "utama" : "reguler") as RekeningType,
  balance: Number(rekening.balance),
  description: rekening.description ?? "",
});

const nextCode = (): string => {
  const max = store.reduce((acc, item) => {
    const parsed = Number(item.code.replace(/\D/g, ""));
    return Number.isNaN(parsed) ? acc : Math.max(acc, parsed);
  }, 0);
  return `RKN-${String(max + 1).padStart(3, "0")}`;
};

const requireRekening = (id: string): Rekening => {
  const found = store.find((item) => item.id === id);
  if (!found) throw new Error("Data rekening tidak ditemukan");
  return found;
};

export const rekeningApi = {
  getList: async () => {
    await wait();
    return ok(
      store.map(normalize),
      "Daftar rekening berhasil dimuat",
    );
  },

  getById: async (id: string) => {
    await wait();
    return ok(normalize(requireRekening(id)), "Detail rekening berhasil dimuat");
  },

  create: async (payload: RekeningInput) => {
    await wait();
    const now = new Date().toISOString();
    const created: Rekening = {
      ...payload,
      id: `rkn-${Date.now()}`,
      code: nextCode(),
      balance: Number(payload.balance ?? 0),
      created_at: now,
      updated_at: now,
    };
    store = [...store, created];
    return ok(normalize(created), "Rekening berhasil ditambahkan");
  },

  update: async (id: string, payload: Partial<RekeningInput>) => {
    await wait();
    const current = requireRekening(id);
    const updated: Rekening = {
      ...current,
      ...payload,
      balance: Number(payload.balance ?? current.balance),
      updated_at: new Date().toISOString(),
    };
    store = store.map((item) => (item.id === id ? updated : item));
    return ok(normalize(updated), "Rekening berhasil diperbarui");
  },

  updateStatus: async (id: string, is_active: boolean) => {
    await wait();
    requireRekening(id);
    const updated: Rekening = {
      ...requireRekening(id),
      is_active,
      updated_at: new Date().toISOString(),
    };
    store = store.map((item) => (item.id === id ? updated : item));
    return ok(
      normalize(updated),
      `Status rekening berhasil diubah menjadi ${is_active ? "aktif" : "nonaktif"}.`,
    );
  },

  delete: async (id: string) => {
    await wait();
    const current = requireRekening(id);
    store = store.filter((item) => item.id !== id);
    return ok<void>(undefined, `Rekening ${current.name} berhasil dihapus`);
  },
};
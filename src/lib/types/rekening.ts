export type RekeningMethod = "qris" | "bank" | "e_wallet";

export const METHOD_LABELS: Record<RekeningMethod, string> = {
  qris: "QRIS",
  bank: "Rekening Bank",
  e_wallet: "E-Wallet",
};

export interface Rekening {
  id: string;
  code: string;
  method: RekeningMethod;
  name: string;
  /** Nama bank / nama e-wallet. Kosong untuk QRIS. */
  provider?: string | null;
  /** Nomor rekening / nomor e-wallet. Kosong untuk QRIS. */
  account_number?: string | null;
  /** Atas nama pemilik. Kosong untuk QRIS. */
  account_holder?: string | null;
  /** Gambar QRIS. Hanya untuk `method === "qris"`. */
  image_url?: string | null;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type RekeningInput = Omit<
  Rekening,
  "id" | "code" | "created_at" | "updated_at"
>;
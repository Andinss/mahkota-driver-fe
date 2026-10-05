export type RekeningType = "utama" | "reguler";

export interface Rekening {
  id: string;
  code: string;
  name: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  type: RekeningType;
  balance: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type RekeningInput = Omit<
  Rekening,
  "id" | "code" | "created_at" | "updated_at"
>;
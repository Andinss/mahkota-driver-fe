export interface DriverBrief {
  id: string;
  first_name: string;
  last_name: string;
  employee_id?: string;
  profile_photo?: string;
  phone?: string;
  email?: string;
}

export interface VehicleBrief {
  id: string;
  merk: string;
  model: string;
  license_plate: string;
  engine_status?: "on" | "off";
  vendor?: VendorBrief | null;
}

export interface VendorBrief {
  id: string;
  name: string;
  owner_name?: string;
}

export interface RentalBrief {
  id: string;
  rental_number: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  vehicle?: VehicleBrief;
  vendor?: VendorBrief;
}

export type FinanceStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "cancelled";

export type FinancePaymentStatus = "pending" | "paid" | "cancelled";

/** Ringkas rekening tujuan (method_payments) untuk tampilan pembayaran. */
export interface MethodPaymentBrief {
  id: string;
  code?: string;
  name: string;
  provider?: string | null;
  method: string;
  account_number?: string | null;
  account_holder?: string | null;
}

export interface FinancePaymentItem {
  id: string;
  finance_id: string;
  driver_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_number: string | null;
  method_payment_id?: string | null;
  method_payment?: MethodPaymentBrief | null;
  source_account?: string | null;
  proof_image?: string | null;
  notes: string | null;
  status: FinancePaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface FinanceItem {
  id: string;
  payment_date: string;
  paid_at?: string | null;
  reference_number: string;
  payment_method: "cash" | "transfer" | "e-wallet" | "saldo";
  amount_received: number;
  fee_admin_join: number;
  fee_kind?: "admin_join" | "membership_fee";
  paid_amount: number;
  remaining_amount: number;
  payments_count?: number;
  notes: string;
  payer: string;
  driver_id: string;
  driver?: DriverBrief;
  vehicle?: VehicleBrief;
  vendor?: VendorBrief;
  finance_type?: FinanceStatus;
  status: FinanceStatus;
  rentals?: RentalBrief[];
  payments?: FinancePaymentItem[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FinanceListParams {
  page?: number;
  limit?: number;
  search?: string;
  payment_method?: string;
  driver_id?: string;
  rental_id?: string;
  status?: FinanceStatus;
  start_date?: string;
  end_date?: string;
}

export interface LatePaymentItem {
  id: string;
  driver_id: string;
  driver?: DriverBrief;
  driver_name: string;
  vehicle: string;
  plate: string;
  amount: number;
  due_date: string;
  payment_date: string;
  justification: string;
  justification_reason: string;
  message: string;
  proof_image: string;
  driver_image: string;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  rentals?: RentalBrief[];
  created_at: string;
  updated_at: string;
}

export interface LatePaymentStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface FinanceSummary {
  total_amount_received: number;
  total_this_month: number;
  total_today: number;
  total_active: number;
  total_inactive: number;
  total_records: number;
  amount_by_method: Record<string, number>;
  amount_by_type: Record<string, number>;
  count_by_type?: Record<string, number>;
}

export interface DriverFinanceSummary {
  driver_id: string;
  driver_name: string;
  employee_id: string;
  total_tagihan: number;
  total_dibayar: number;
  total_pending_pembayaran: number;
  sisa_tagihan: number;
  count_by_status: Record<string, number>;
  open_finances: Array<{
    id: string;
    reference_number: string;
    payment_date: string;
    fee_admin_join: number;
    fee_kind?: "admin_join" | "membership_fee";
    paid_amount: number;
    pending_amount: number;
    remaining_amount: number;
    status: FinanceStatus;
  }>;
}

export interface CreateFinancePayload {
  payment_date: string;
  reference_number: string;
  payment_method: string;
  amount_received?: number;
  fee_admin_join?: number;
  notes: string;
  payer: string;
  driver_id: string;
  finance_type?: "paid" | "unpaid" | "pending";
  rental_ids?: string[];
  is_active?: boolean;
}

export type UpdateFinancePayload = Partial<CreateFinancePayload>;

export interface CreateFinancePaymentPayload {
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_number?: string;
  /**
   * ID transaksi/kode hasil transfer (daily payments).
   * Fee membership tetap memakai `reference_number` per baris pembayaran.
   */
  transaction_id?: string;
  notes?: string;
  /** Catatan driver saat konfirmasi pembayaran tagihan harian. */
  payment_notes?: string;
  status?: "paid" | "pending";
  /** Rekening tujuan (method_payments) yang dipilih driver. */
  method_payment_id?: string;
  /** Rekening asal milik driver yang dipakai bayar. */
  source_account?: string;
  /** File bukti bayar — wajib untuk transfer / e-wallet. */
  proof_image?: File | null;
}

export type PayDailyPaymentPayload = CreateFinancePaymentPayload;

export interface UpdateFinancePaymentPayload {
  status: "paid" | "cancelled";
}

export interface MonthlyFinanceItem {
  month: number;
  total: number;
  count: number;
}

export interface FinanceMonthlySummary {
  year: number;
  months: MonthlyFinanceItem[];
}

export interface DailyPaymentItem {
  id: string;
  rental_id: string;
  rental_number: string;
  driver_id: string;
  driver_name: string;
  vehicle_id: string;
  vehicle_name: string;
  license_plate: string;
  vendor_name: string;
  payment_date: string;
  amount: number;
  status: string;
  /** Nomor tagihan (PAY-yyyymm/xxx) — tidak diubah saat driver membayar. */
  reference_number: string;
  notes: string;
  /** ID transaksi/kode hasil transfer yang diinput driver. */
  transaction_id?: string | null;
  /** Catatan dari driver saat konfirmasi pembayaran. */
  payment_notes?: string | null;
  /** Alasan penolakan pembayaran oleh admin (status `rejected`). */
  rejection_reason?: string | null;
  /** cash | transfer | e-wallet | saldo — metode yang dipilih driver. */
  payment_method?: string | null;
  method_payment_id?: string | null;
  method_payment?: MethodPaymentBrief | null;
  source_account?: string | null;
  proof_image?: string | null;
  paid_date?: string | null;
  created_at: string;
  updated_at: string;
}
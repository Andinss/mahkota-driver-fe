export interface DriverBrief {
  id: string;
  first_name: string;
  last_name: string;
  employee_id?: string;
  profile_photo?: string;
  phone?: string;
  email?: string;
}

export interface RentalBrief {
  id: string;
  rental_number: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export type FinanceStatus =
  | "unpaid"
  | "pending"
  | "partially_paid"
  | "paid"
  | "cancelled";

export type FinancePaymentStatus = "pending" | "paid" | "cancelled";

export interface FinancePaymentItem {
  id: string;
  finance_id: string;
  driver_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_number: string | null;
  notes: string | null;
  status: FinancePaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface FinanceItem {
  id: string;
  payment_date: string;
  reference_number: string;
  payment_method: "cash" | "transfer" | "e-wallet" | "saldo";
  amount_received: number;
  deposit_amount: number;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  payments_count?: number;
  payment_terms?: number;
  fee_admin_join?: number;
  notes: string;
  payer: string;
  driver_id: string;
  driver?: DriverBrief;
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
    total_amount: number;
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
  deposit_amount?: number;
  total_amount?: number;
  payment_terms?: number;
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
  notes?: string;
  status?: "paid" | "pending";
}

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
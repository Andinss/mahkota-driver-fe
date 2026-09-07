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
}

export interface FinanceItem {
  id: string;
  payment_date: string;
  reference_number: string;
  payment_method: "cash" | "transfer" | "e-wallet" | "saldo";
  amount_received: number;
  deposit_amount: number;
  notes: string;
  payer: string;
  driver_id: string;
  driver?: DriverBrief;
  finance_type: "paid" | "unpaid" | "pending";
  rentals?: RentalBrief[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FinanceListParams {
  page?: number;
  limit?: number;
  search?: string;
  payment_method?: string;
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
}

export interface CreateFinancePayload {
  payment_date: string;
  reference_number: string;
  payment_method: string;
  amount_received: number;
  deposit_amount?: number;
  notes: string;
  payer: string;
  driver_id: string;
  finance_type?: string;
  rental_ids?: string[];
}

export interface UpdateFinancePayload extends Partial<CreateFinancePayload> {
  is_active?: boolean;
}

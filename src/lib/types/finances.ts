export interface FinanceItem {
  id: string;
  payment_date: string;
  reference_number: string;
  payment_method: "cash" | "transfer" | "e-wallet";
  amount_received: string;
  notes: string;
  payer: string;
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

export interface CreateFinancePayload {
  payment_date: string;
  reference_number: string;
  payment_method: string;
  amount_received: string;
  notes: string;
  payer: string;
}

export interface UpdateFinancePayload extends Partial<CreateFinancePayload> {
  is_active?: boolean;
}

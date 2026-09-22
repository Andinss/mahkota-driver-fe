export interface DriverKoin {
  id: string;
  driver_id: string;
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
    employee_id?: string;
  };
  balance: number;
  created_at?: string;
  updated_at?: string;
}

export interface KoinTransaction {
  id: string;
  driver_id?: string;
  driver_name?: string;
  driver_employee_id?: string | null;
  type: 'top_up' | 'rental_payment' | 'refund' | 'withdrawal';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_id?: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
}

export interface KoinSummary {
  total_balance: number;
  total_drivers_with_koin: number;
  total_top_up: number;
  total_deductions: number;
  total_refunds: number;
}

export interface TopUpKoinPayload {
  driver_id: string;
  amount: number;
  notes?: string;
  reference_number?: string;
}

export interface DeductKoinPayload {
  driver_id: string;
  amount: number;
  rental_id?: string;
  notes?: string;
}

export interface RefundKoinPayload {
  driver_id: string;
  amount: number;
  rental_id?: string;
  notes?: string;
}

export interface KoinTransactionParams {
  page?: number;
  limit?: number;
  type?: string;
}
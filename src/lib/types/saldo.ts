export interface DriverSaldo {
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

export interface SaldoTransaction {
  id: string;
  type: 'top_up' | 'rental_payment' | 'refund' | 'withdrawal';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_id?: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
}

export interface SaldoSummary {
  total_balance: number;
  total_drivers_with_saldo: number;
  total_top_up: number;
  total_deductions: number;
  total_refunds: number;
}

export interface TopUpSaldoPayload {
  driver_id: string;
  amount: number;
  notes?: string;
  reference_number?: string;
}

export interface DeductSaldoPayload {
  driver_id: string;
  amount: number;
  rental_id?: string;
  notes?: string;
}

export interface RefundSaldoPayload {
  driver_id: string;
  amount: number;
  rental_id?: string;
  notes?: string;
}

export interface SaldoTransactionParams {
  page?: number;
  limit?: number;
  type?: string;
}

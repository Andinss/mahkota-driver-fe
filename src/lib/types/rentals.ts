export interface RentalTransaction {
  id: string;
  rental_number: string;
  driver_active: string;
  car_model: string;
  start_date: string;
  end_date: string;
  total_duration: number;
  daily_rate: number;
  deposit_amount: number;
  method_payment: 'Bank' | 'Cash' | 'E Wallet';
  document_contract?: string;
  total_daily_rate: number;
  security_deposit: number;
  service_fee: number;
  total_revenue: number;
  created_at?: string;
  updated_at?: string;
}

export interface RentalListParams {
  page?: number;
  limit?: number;
  search?: string;
}

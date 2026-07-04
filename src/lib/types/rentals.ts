export interface DriverBrief {
  id: string;
  first_name: string;
  last_name: string;
  employee_id?: string;
  phone?: string;
  email?: string;
  profile_photo?: string;
}

export interface VehicleBrief {
  id: string;
  merk: string;
  model: string;
  license_plate: string;
}

export interface RentalTransaction {
  id: string;
  rental_number: string;
  driver_id: string;
  driver?: DriverBrief;
  vehicle_id: string;
  vehicle?: VehicleBrief;
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
  payment_status?: string;
  finances?: any[];
  late_payments?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface RentalSummary {
  total_rentals: number;
  total_revenue: number;
  total_deposit: number;
  total_service_fee: number;
  total_deposit_amount: number;
  avg_daily_rate: number;
  amount_by_method: Record<string, number>;
}

export interface RentalListParams {
  page?: number;
  limit?: number;
  search?: string;
}

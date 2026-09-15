export interface DriverBrief {
  id: string;
  first_name: string;
  last_name: string;
  employee_id?: string;
  phone?: string;
  email?: string;
  profile_photo?: string;
}

export interface VendorBrief {
  id: string;
  name: string;
  owner_name?: string;
}

export interface VehicleBrief {
  id: string;
  merk: string;
  model: string;
  license_plate: string;
  engine_status?: 'on' | 'off';
  vendor?: VendorBrief | null;
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
  document_contract?: string;
  rental_duration: 'harian' | 'mingguan' | 'bulanan' | 'tahunan';
  rental_service: 'lepas kunci' | 'pakai supir';
  finances?: any[];
  late_payments?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface RentalSummary {
  total_rentals: number;
  avg_daily_rate: number;
  lepas_kunci: number;
  pakai_supir: number;
}

export interface RentalListParams {
  page?: number;
  limit?: number;
  search?: string;
}
export interface DriverRentalVehicle {
  merk: string;
  model: string;
  license_plate: string;
  pricing_category?: "Reguler" | "Premium";
}

export interface DriverRentalItem {
  id: string;
  rental_number: string;
  start_date?: string;
  end_date?: string;
  daily_rate?: number;
  rental_duration?: string;
  vehicle?: DriverRentalVehicle;
}

export interface DriverItem {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  profile_photo?: string;
  gender: string;
  employee_id: string;
  citizenship: string;
  phone: string;
  email: string;
  emergency_contact: string;
  emergency_email: string;
  house_type: string;
  ready_sign_contract: boolean;
  willing_to_be_survey: boolean;
  national_id_card?: string;
  sim_card?: string;
  garage_photo?: string;
  npwp_photo?: string;
  user_id?: string;
  created_by_id?: string;
  created_by?: { id: string; username: string; email: string };
  saldo?: { id: string; balance: number };
  province?: string;
  province_name?: string;
  city?: string;
  city_name?: string;
  district?: string;
  district_name?: string;
  subdistrict?: string;
  subdistrict_name?: string;
  full_address?: string;
  permanent_address?: string;
  rentals?: DriverRentalItem[];
  created_at?: string;
  updated_at?: string;
}

export interface DriverSummary {
  total_drivers: number;
  gender_breakdown: Record<string, number>;
}

export interface DriverListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  performance?: string;
}

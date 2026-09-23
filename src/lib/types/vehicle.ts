export type VehicleStatus = "Available" | "Maintenance" | "Reserved" | "rented" | "retrieved";
export type PricingCategory = "Reguler" | "Premium";

export interface VehicleItem {
  id: string;
  merk: string;
  model: string;
  launching_year: string;
  license_plate: string;
  color: string;
  vin_number: string;
  engine_number: string;
  engine_status: 'on' | 'off';
  daily_rate: number;
  pricing_category: PricingCategory;
  status: VehicleStatus;
  is_active: boolean;
  vehicle_photo?: string | string[];
  vendor_id?: string;
  imei?: string;
  device_name?: string;
  vendor?: { id: string; name: string; owner_name: string } | null;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleSummary {
  total_vehicles: number;
  rented: number;
  available: number;
  maintenance: number;
  reserved: number;
  retrieved: number;
  status_breakdown: Record<string, number>;
}

export interface VehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

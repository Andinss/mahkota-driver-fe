export type VehicleStatus = "Available" | "Maintenance" | "Service" | "Reserved" | "rented" | "retrieved";

export interface VehicleItem {
  id: string;
  merk: string;
  model: string;
  launching_year: string;
  license_plate: string;
  color: string;
  vin_number: string;
  engine_number: string;
  daily_rate: number;
  status: VehicleStatus;
  vehicle_photo?: string | string[];
  created_at?: string;
  updated_at?: string;
}

export interface VehicleSummary {
  total_vehicles: number;
  rented: number;
  available: number;
  maintenance: number;
  service: number;
  retrieved: number;
  status_breakdown: Record<string, number>;
}

export interface VehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

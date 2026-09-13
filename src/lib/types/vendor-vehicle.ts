export type VendorStatus = "active" | "inactive";

export interface VendorVehicleItem {
  id: string;
  merk: string;
  model: string;
  license_plate: string;
  status: string;
  daily_rate?: number;
}

export interface VendorVehicle {
  id: string;
  name: string;
  owner_name: string;
  logo?: string;
  pendapatan: number;
  total_kendaraan: number;
  status: VendorStatus;
  vehicles?: VendorVehicleItem[];
  created_at?: string;
  updated_at?: string;
}

export interface VendorVehicleSummary {
  total_vendors: number;
  active: number;
  inactive: number;
  total_pendapatan: number;
  average_pendapatan: number;
  status_breakdown: Record<string, number>;
}

export interface VendorVehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
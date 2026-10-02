export type VendorStatus = "active" | "inactive";

export interface VendorVehicleItem {
  id: string;
  merk: string;
  model: string;
  license_plate: string;
  status: string;
  daily_rate?: number;
  cost_price?: number;
}

export interface VendorVehicle {
  id: string;
  name: string;
  owner_name: string;
  logo?: string;
  pendapatan_vendor: number;
  pendapatan_pt: number;
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
  total_pendapatan_vendor: number;
  total_pendapatan_pt: number;
  status_breakdown: Record<string, number>;
}

export interface VendorVehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
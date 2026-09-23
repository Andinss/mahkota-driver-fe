import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { FleetLocation } from "../types/monitoring";
import type { DriverBrief, VendorBrief } from "../types/rentals";

export interface MonitoringRental {
  id: string;
  rental_number?: string;
  start_date?: string;
  end_date?: string;
  driver?: DriverBrief | null;
}

export interface MonitoringVehicle {
  id?: string;
  merk?: string;
  model?: string;
  license_plate?: string;
  status?: string;
  imei?: string | null;
  vendor?: VendorBrief | null;
  rentals?: MonitoringRental[];
}

export interface GpsTrackingRecord {
  id: string;
  VehicleId: string | null;
  VehicleNumber: string;
  DatetimeUTC: string;
  GpsLocation: string;
  Lon: string;
  Lat: string;
  Speed: string;
  Direction: string;
  Engine: string;
  Odometer: string;
  Car_Status: string;
  VehicleType: string;
  Alarm: string;
  vehicle?: MonitoringVehicle | null;
}

export function getDriverName(r: GpsTrackingRecord): string {
  const driver = r.vehicle?.rentals?.[0]?.driver;
  if (!driver) return "-";
  const name = `${driver.first_name || ""} ${driver.last_name || ""}`.trim();
  return name || "-";
}

export function getVendorName(r: GpsTrackingRecord): string {
  return r.vehicle?.vendor?.name || "-";
}

const toNumber = (v: string | null | undefined): number | undefined => {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

function mapTrackingToFleetLocation(rec: GpsTrackingRecord): FleetLocation {
  const status =
    rec.Car_Status === "moving" || rec.Car_Status === "emergency"
      ? rec.Car_Status
      : (rec.Engine === "on" ? "moving" : "idle");

  const driver = rec.vehicle?.rentals?.[0]?.driver;
  const driverName = driver
    ? `${driver.first_name || ""} ${driver.last_name || ""}`.trim()
    : "";
  const vehicleName = [rec.vehicle?.merk, rec.vehicle?.model]
    .filter(Boolean)
    .join(" ");

  return {
    id: rec.id,
    vehicle_id: rec.VehicleId ?? "",
    plate: rec.VehicleNumber,
    vehicle_name: vehicleName || rec.VehicleType,
    driver_name: driverName || undefined,
    driver_phone: driver?.phone || undefined,
    latitude: toNumber(rec.Lat) ?? 0,
    longitude: toNumber(rec.Lon) ?? 0,
    speed: toNumber(rec.Speed) ?? 0,
    status: status as FleetLocation["status"],
    engine_status: rec.Engine === "on" ? "on" : "off",
    last_updated: rec.DatetimeUTC,
  };
}

export const monitoringApi = {
  getList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    VehicleId?: string;
  }) => {
    return api.get<SuccessResponse<GpsTrackingRecord[]>>("/monitoring", params);
  },

  getFleetLocations: async (params?: { status?: string; vehicle_id?: string }) => {
    const res = await api.get<SuccessResponse<GpsTrackingRecord[]>>("/monitoring", params);
    if (!res.success) {
      return { ...res, data: [] as FleetLocation[] };
    }
    return {
      ...res,
      data: (res.data || []).map(mapTrackingToFleetLocation),
    } as SuccessResponse<FleetLocation[]>;
  },

  updateVehicleStatus: (vehicleId: string, status: string) =>
    api.put<SuccessResponse<{ vehicle_id: string; status: string }>>(
      `/monitoring/vehicles/${vehicleId}/status`,
      { status },
    ),

  updateVehicleEngine: (vehicleId: string, engine_status: "on" | "off") =>
    api.put<SuccessResponse<{ vehicle_id: string; engine_status: "on" | "off" }>>(
      `/monitoring/vehicles/${vehicleId}/engine`,
      { engine_status },
    ),
};

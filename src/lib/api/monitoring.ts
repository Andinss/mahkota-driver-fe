import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { FleetLocation, LocationHistory, GpsUpdatePayload } from "../types/monitoring";

export interface MonitoringTask {
  id: string;
  priority: "High" | "Normal";
  vehicle_name: string;
  plate: string;
  location: string;
  time_window: string;
  status: "Pending" | "Scheduled" | "In Progress" | "Completed";
}

export interface MonitoringTaskDetail {
  id: string;
  vehicle: {
    name: string;
    year: string;
    plateNumber: string;
    imageUrl: string;
    odometerOut: number;
    fuelLevel: number;
  };
  location: {
    address: string;
    mapUrl: string;
    reportedIssue: string;
  };
  customer: {
    name: string;
    initials: string;
    contractNumber: string;
    phoneNumber: string;
  };
}

export const monitoringApi = {
  getFleetLocations: (params?: { status?: string; vehicle_id?: string }) =>
    api.get<SuccessResponse<FleetLocation[]>>("/monitoring/locations", params),

  getVehicleLocation: (vehicleId: string) =>
    api.get<SuccessResponse<FleetLocation>>(`/monitoring/locations/${vehicleId}`),

  getLocationHistory: (vehicleId: string, limit?: number) =>
    api.get<SuccessResponse<LocationHistory[]>>(
      `/monitoring/locations/${vehicleId}/history`,
      { limit },
    ),

  updateLocation: (payload: GpsUpdatePayload) =>
    api.post<SuccessResponse<FleetLocation>>("/monitoring/locations", payload),

  getTasks: () =>
    api.get<SuccessResponse<MonitoringTask[]>>("/monitoring/tasks"),

  getTaskById: (id: string) =>
    api.get<SuccessResponse<MonitoringTaskDetail>>(`/monitoring/tasks/${id}`),

  updateVehicleStatus: (vehicleId: string, status: string) =>
    api.put<SuccessResponse<any>>(`/monitoring/vehicles/${vehicleId}/status`, { status }),

  updateVehicleEngine: (vehicleId: string, engine_status: "on" | "off") =>
    api.put<SuccessResponse<{ vehicle_id: string; engine_status: "on" | "off" }>>(
      `/monitoring/vehicles/${vehicleId}/engine`,
      { engine_status },
    ),
};

export interface FleetLocation {
  id: string;
  vehicle_id: string;
  plate: string;
  vehicle_name: string;
  latitude: number;
  longitude: number;
  speed: number;
  fuel_level: number | null;
  status: "emergency" | "moving" | "idle";
  last_updated: string;
}

export interface LocationHistory {
  id: string;
  latitude: number;
  longitude: number;
  speed: number;
  fuel_level: number | null;
  status: string;
  recorded_at: string;
}

export interface GpsUpdatePayload {
  vehicle_id: string;
  latitude: number;
  longitude: number;
  speed?: number;
  fuel_level?: number;
  status?: "emergency" | "moving" | "idle";
}

export interface FleetLocation {
  id: string;
  vehicle_id: string;
  plate: string;
  vehicle_name: string;
  driver_name?: string;
  driver_phone?: string;
  latitude: number;
  longitude: number;
  speed: number;
  fuel_level?: number | null;
  status: "emergency" | "moving" | "idle";
  engine_status: "on" | "off";
  last_updated: string;
}

export interface LocationHistory {
  id: string;
  latitude: number;
  longitude: number;
  speed: number;
  fuel_level: number | null;
  status: string;
  engine_status: "on" | "off";
  recorded_at: string;
}

export interface GpsUpdatePayload {
  vehicle_id: string;
  latitude: number;
  longitude: number;
  speed?: number;
  fuel_level?: number;
  status?: "emergency" | "moving" | "idle";
  engine_status?: "on" | "off";
}

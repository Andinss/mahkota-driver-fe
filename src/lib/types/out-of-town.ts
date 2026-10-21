export type OutOfTownStatus = "pending" | "approved" | "rejected";

/** Bentuk data dari backend (snake_case). */
export interface OutOfTownItem {
  id: string;
  driver_id: string;
  driver_name: string;
  driver_phone?: string | null;
  vehicle_id?: string | null;
  vehicle_name?: string | null;
  vehicle_plate?: string | null;
  destination: string;
  departure_date: string;
  return_date: string;
  reason?: string | null;
  status: OutOfTownStatus;
  admin_note?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OutOfTownStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface CreateOutOfTownPayload {
  destination: string;
  departure_date: string;
  return_date: string;
  reason?: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  vehicle_id: string | null;
  vehicle?: {
    id: string;
    merk: string;
    model: string;
    license_plate: string;
  } | null;
  status: string;
  metadata?: Record<string, any> | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: NotificationItem[];
  unread_count: number;
}

export interface UnreadCountResponse {
  success: boolean;
  data: { count: number };
}

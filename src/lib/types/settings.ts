export interface SettingItem {
  id: string;
  key: string;
  value: string;
  category?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSettingPayload {
  key: string;
  value: string;
  category?: string;
  description?: string;
}

export interface UpdateSettingPayload {
  value?: string;
  category?: string;
  description?: string;
}

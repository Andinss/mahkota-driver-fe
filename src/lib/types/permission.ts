export interface PermissionItem {
  id: string;
  name: string;
  module: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePermissionPayload {
  name: string;
  module: string;
  description?: string;
}

export interface UpdatePermissionPayload {
  name?: string;
  module?: string;
  description?: string;
}

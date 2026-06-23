export interface RoleItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  permissions?: PermissionItem[];
  created_at?: string;
  updated_at?: string;
}

export interface PermissionItem {
  id: string;
  name: string;
  module: string;
  description?: string;
}

export interface CreateRolePayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  code?: string;
  description?: string;
  is_active?: boolean;
}

export interface AddPermissionsToRolePayload {
  permissionIds: string[];
}

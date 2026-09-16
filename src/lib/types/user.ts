export interface UserItem {
  id: string;
  username: string;
  email: string;
  fullname: string;
  is_active: boolean;
  phoneNumber?: string | null;
  role_id?: string;
  role?: {
    id: string;
    name: string;
    code: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface UserSummary {
  total_users: number;
  active_users: number;
}

export interface CreateUserPayload {
  username: string;
  fullname: string;
  email: string;
  role_id?: string;
  is_active?: boolean;
  phoneNumber?: string;
  driver_id?: string;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

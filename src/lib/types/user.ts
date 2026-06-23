export interface UserItem {
  id: string;
  username: string;
  email: string;
  fullname: string;
  is_active: boolean;
  role_id?: string;
  role?: {
    id: string;
    name: string;
    code: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserPayload {
  username: string;
  fullname: string;
  email: string;
  role_id?: string;
  is_active?: boolean;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

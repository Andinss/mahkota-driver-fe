export interface UserItem {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  role?: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  role?: string;
  is_active?: boolean;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

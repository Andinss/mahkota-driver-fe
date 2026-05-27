export interface UserItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: {
    name: string;
    color?: string;
  };
  status: "active" | "inactive";
  lastLogin?: {
    date: string;
    time: string;
  };
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  avatar?: string;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

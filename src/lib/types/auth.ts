export interface LoginRequest {
  email: string;
  password: string;
  turnstile_token?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profile_photo?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

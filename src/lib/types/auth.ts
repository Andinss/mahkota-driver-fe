export interface RoleInfo {
  id: string;
  name: string;
  code: string;
}

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
  driver_id?: string | null;
  role?: RoleInfo | null;
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface SetPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
}

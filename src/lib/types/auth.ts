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

/** Respons login ketika akun mengaktifkan MFA: belum ada access token. */
export interface MfaChallengeResponse {
  mfa_required: true;
  mfa_token: string;
  message?: string;
}

export type LoginResult = LoginResponse | MfaChallengeResponse;

export interface MfaVerifyRequest {
  mfa_token: string;
  code: string;
}

export interface MfaStatusResponse {
  mfa_enabled: boolean;
}

export interface MfaSetupResponse {
  success: boolean;
  secret: string;
  otpauth_url: string;
  issuer: string;
  account: string;
}

export interface MfaEnableResponse {
  success: boolean;
  message: string;
  recovery_codes: string[];
}

export interface MfaRecoveryCodesResponse {
  success: boolean;
  message: string;
  recovery_codes: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  driver_id?: string | null;
  /** Nama lengkap driver dari relasi (dikirim login & /auth/me). */
  driver_name?: string | null;
  /** Status MFA akun. */
  mfa_enabled?: boolean;
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

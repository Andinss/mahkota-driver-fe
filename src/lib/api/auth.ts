import { api } from "../api-http";
import type {
  LoginRequest,
  LoginResponse,
  LoginResult,
  MfaChallengeResponse,
  MfaEnableResponse,
  MfaRecoveryCodesResponse,
  MfaSetupResponse,
  MfaStatusResponse,
  MfaVerifyRequest,
  User,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SetPasswordRequest,
  SetPasswordResponse,
  VerifyTokenResponse,
} from "../types/auth";
import type { SuccessResponse } from "../types/api";
import { setAccessToken, setUser } from "../token";

function unwrap<T>(response: SuccessResponse<T> | T): T {
  return (response as SuccessResponse<T>).data ?? (response as T);
}

function persistSession(data: LoginResponse, remember: boolean): LoginResponse {
  setAccessToken(data.access_token, remember);
  setUser(data.user, remember);
  return data;
}

export const authApi = {
  login: async (
    payload: LoginRequest,
    remember = true,
  ): Promise<LoginResult> => {
    const res = await api.post<SuccessResponse<LoginResult> | LoginResult>(
      "/auth/login",
      payload,
    );
    const data = unwrap(res);

    if ("mfa_required" in data && data.mfa_required) {
      return data as MfaChallengeResponse;
    }

    return persistSession(data as LoginResponse, remember);
  },

  verifyMfa: async (
    payload: MfaVerifyRequest,
    remember = true,
  ): Promise<LoginResponse> => {
    const res = await api.post<SuccessResponse<LoginResponse> | LoginResponse>(
      "/auth/mfa/verify",
      payload,
    );
    return persistSession(unwrap(res), remember);
  },

  getMe: async () => {
    const res = await api.get<SuccessResponse<User> | User>("/auth/me");
    const data = unwrap(res);
    setUser(data);
    return data;
  },

  getMfaStatus: async () => {
    const res = await api.get<
      SuccessResponse<MfaStatusResponse> | MfaStatusResponse
    >("/auth/mfa/status");
    return unwrap(res);
  },

  setupMfa: async () => {
    const res = await api.post<
      SuccessResponse<MfaSetupResponse> | MfaSetupResponse
    >("/auth/mfa/setup");
    return unwrap(res);
  },

  enableMfa: async (code: string) => {
    const res = await api.post<
      SuccessResponse<MfaEnableResponse> | MfaEnableResponse
    >("/auth/mfa/enable", { code });
    return unwrap(res);
  },

  disableMfa: async (password: string, code: string) => {
    const res = await api.post<
      SuccessResponse<{ success: boolean; message: string }> | {
        success: boolean;
        message: string;
      }
    >("/auth/mfa/disable", { password, code });
    return unwrap(res);
  },

  regenerateRecoveryCodes: async (password: string) => {
    const res = await api.post<
      SuccessResponse<MfaRecoveryCodesResponse> | MfaRecoveryCodesResponse
    >("/auth/mfa/recovery-codes", { password });
    return unwrap(res);
  },

  forgotPassword: async (payload: ForgotPasswordRequest) => {
    return api.post<ForgotPasswordResponse>("/auth/forgot-password", payload);
  },

  resetPassword: async (payload: ResetPasswordRequest) => {
    return api.post<ResetPasswordResponse>("/auth/reset-password", payload);
  },

  setPassword: async (payload: SetPasswordRequest) => {
    return api.post<SetPasswordResponse>("/auth/set-password", payload);
  },

  verifyResetToken: async (token: string) => {
    return api.post<VerifyTokenResponse>("/auth/reset-password", { token });
  },

  verifySetToken: async (token: string) => {
    return api.post<VerifyTokenResponse>("/auth/set-password", { token });
  },
};

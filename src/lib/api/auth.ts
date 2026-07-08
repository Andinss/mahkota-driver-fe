import { api } from "../api-http";
import type { LoginRequest, LoginResponse, User, ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse, SetPasswordRequest, SetPasswordResponse, VerifyTokenResponse } from "../types/auth";
import type { SuccessResponse } from "../types/api";
import { setAccessToken, setUser } from "../token";

function unwrap<T>(response: SuccessResponse<T> | T): T {
  return (response as SuccessResponse<T>).data ?? (response as T);
}

export const authApi = {
  login: async (payload: LoginRequest) => {
    const res = await api.post<SuccessResponse<LoginResponse> | LoginResponse>("/auth/login", payload);
    const data = unwrap(res);
    setAccessToken(data.access_token);
    setUser(data.user);
    return data;
  },

  getMe: async () => {
    const res = await api.get<SuccessResponse<User> | User>("/auth/me");
    const data = unwrap(res);
    setUser(data);
    return data;
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

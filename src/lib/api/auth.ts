import { api } from "../api-http";
import type { LoginRequest, LoginResponse, User } from "../types/auth";
import { setAccessToken, setUser } from "../token";

export const authApi = {
  login: async (payload: LoginRequest) => {
    const res = await api.post<LoginResponse>("/auth/login", payload);
    setAccessToken(res.access_token);
    setUser(res.user);
    return res;
  },

  getMe: async () => {
    const res = await api.get<User>("/auth/me");
    setUser(res);
    return res;
  },
};

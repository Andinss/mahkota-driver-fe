import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { SettingItem, CreateSettingPayload, UpdateSettingPayload } from "../types/settings";

export const settingsApi = {
  getList: () =>
    api.get<SuccessResponse<SettingItem[]>>("/settings"),

  getByKey: (key: string) =>
    api.get<SuccessResponse<SettingItem>>(`/settings/${key}`),

  create: (payload: CreateSettingPayload) =>
    api.post<SuccessResponse<SettingItem>>("/settings", payload),

  update: (key: string, payload: UpdateSettingPayload) =>
    api.patch<SuccessResponse<SettingItem>>(`/settings/${key}`, payload),

  delete: (key: string) =>
    api.delete<SuccessResponse<void>>(`/settings/${key}`),
};

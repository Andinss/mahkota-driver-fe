import { api } from "../api-http";
import type { SuccessResponse } from "../types/api";
import type { DriverItem } from "../types/driver";

export const supervisorApi = {
  getList: (params?: Record<string, string | number | undefined>) =>
    api.get<{ success: boolean; message: string; data: DriverItem[] }>("/supervisor/drivers", params),

  getCount: () =>
    api.get<{ success: boolean; message: string; data: { count: number; max: number; remaining: number } }>("/supervisor/drivers/count"),

  getById: (id: string) =>
    api.get<{ success: boolean; message: string; data: DriverItem }>(`/supervisor/drivers/${id}`),

  create: (formData: FormData) =>
    api.upload<{ success: boolean; message: string; data: DriverItem }>("/supervisor/drivers/create", formData),

  update: (id: string, formData: FormData) =>
    api.uploadPut<{ success: boolean; message: string; data: DriverItem }>(`/supervisor/drivers/update/${id}`, formData),

  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/supervisor/drivers/delete/${id}`),
};

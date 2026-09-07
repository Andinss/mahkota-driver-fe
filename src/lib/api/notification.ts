import { api } from "../api-http";
import type { NotificationResponse, UnreadCountResponse, NotificationItem } from "../types/notification";

export const notificationApi = {
  getAll: (params?: { type?: string; is_read?: string; limit?: number }) =>
    api.get<NotificationResponse>("/notifications", params),

  getRecent: (limit?: number) =>
    api.get<NotificationResponse>("/notifications/recent", { limit }),

  getUnreadCount: () =>
    api.get<UnreadCountResponse>("/notifications/unread-count"),

  markAsRead: (id: string) =>
    api.put<{ success: boolean; data: NotificationItem }>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.put<{ success: boolean; message: string }>("/notifications/read-all"),

  create: (payload: {
    type: string;
    title: string;
    message: string;
    vehicle_id?: string;
    metadata?: Record<string, any>;
  }) =>
    api.post<{ success: boolean; data: NotificationItem }>("/notifications", payload),

  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/notifications/${id}`),
};

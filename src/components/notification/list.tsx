"use client";

import React, { useEffect, useState } from "react";
import NotificationCard from "@/components/ui/notification-card";
import { notificationApi } from "@/lib/api/notification";
import type { NotificationItem } from "@/lib/types/notification";

interface ListNotificationProps {
  activeFilter: string;
}

const typeFilterMap: Record<string, string> = {
  emergency: "geofence_violation",
  payment: "payment_overdue",
  security: "security_alert",
  system: "system",
};

const typeToCardType: Record<string, "emergency" | "payment" | "security" | "system" | "received"> = {
  geofence_violation: "emergency",
  emergency: "emergency",
  payment_overdue: "payment",
  late_payment: "payment",
  payment: "payment",
  security_alert: "security",
  security: "security",
  system: "system",
  vehicle_returned: "received",
  received: "received",
};

const formatTimestamp = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const ListNotification = ({ activeFilter }: ListNotificationProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationApi.getAll({ limit: 50 });
        setNotifications(res.data || []);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    const target = typeFilterMap[activeFilter];
    return notification.type === target || notification.type === activeFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <span className="material-symbols-outlined text-5xl text-gray-400">
            notifications
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Loading...</h3>
      </div>
    );
  }

  if (filteredNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-gray-400">
            notifications_off
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No notifications</h3>
        <p className="text-gray-600 mt-2">
          No notifications found for this category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredNotifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          type={typeToCardType[notification.type] || "system"}
          title={notification.title}
          description={notification.message}
          timestamp={formatTimestamp(notification.created_at)}
        />
      ))}
    </div>
  );
};

export default ListNotification;

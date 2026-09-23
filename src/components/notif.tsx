"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { notificationApi } from "@/lib/api/notification";
import type { NotificationItem } from "@/lib/types/notification";

const typeToIcon: Record<string, { icon: string; color: string }> = {
  emergency: { icon: "warning", color: "red" },
  payment_overdue: { icon: "payments", color: "orange" },
  late_payment: { icon: "payments", color: "orange" },
  security_alert: { icon: "shield", color: "blue" },
  system: { icon: "settings", color: "gray" },
  vehicle_returned: { icon: "check_circle", color: "emerald" },
};

const formatTimestamp = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const DropdownNotif = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationApi.getRecent(5);
        setNotifications(res.data || []);
        setUnreadCount(res.unread_count || 0);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, status: "read" })));
      setUnreadCount(0);
    } catch {
      // silent fail
    }
  };

  return (
    <div className="absolute right-0 top-12 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-xs font-bold px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h3>
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Mark all as read
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No notifications</div>
        ) : (
          notifications.map((notif) => {
            const typeInfo = typeToIcon[notif.type] || { icon: "info", color: "gray" };
            return (
              <div
                key={notif.id}
                className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 ${
                  !notif.is_read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                }`}
              >
                <div className={`h-10 w-10 rounded-lg bg-${typeInfo.color}-100 dark:bg-${typeInfo.color}-900/30 flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined text-${typeInfo.color}-600 dark:text-${typeInfo.color}-400`}>
                    {typeInfo.icon}
                  </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">
                    {notif.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {notif.message}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {formatTimestamp(notif.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Link href="/dashboard/notifications">
        <button className="w-full py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary bg-slate-50 dark:bg-slate-800/30 transition-colors">
          View All Notifications
        </button>
      </Link>
    </div>
  );
};

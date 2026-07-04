"use client";

import { useState, useEffect } from "react";
import { auditApi } from "@/lib/api/audit";
import type { UserItem } from "@/lib/types/user";

interface ActivityLogProps {
  user: UserItem;
}

const actionIcons: Record<string, string> = {
  CREATE_USER: "person_add",
  UPDATE_USER: "edit",
  DELETE_USER: "delete",
  CREATE_FINANCE: "payments",
  UPDATE_FINANCE: "edit_note",
  DELETE_FINANCE: "delete",
  DEFAULT: "circle",
};

const ActivityLog = ({ user }: ActivityLogProps) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    auditApi.getList({ limit: 10, search: user.username })
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : [];
        setLogs(items);
      })
      .catch(() => setLogs([]))
      .finally(() => setIsLoading(false));
  }, [user.id]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1a2632] p-6 lg:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h4 className="text-[0.7rem] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
          <span className="w-4 h-px bg-gray-300 dark:bg-slate-600"></span> Recent Activity Log
        </h4>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a2632] p-6 lg:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h4 className="text-[0.7rem] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
        <span className="w-4 h-px bg-gray-300 dark:bg-slate-600"></span> Recent Activity Log
      </h4>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No activity logs found.</p>
      ) : (
        <div className="relative">
          <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
          {logs.map((log: any, idx: number) => {
            const icon = actionIcons[log.action] || actionIcons.DEFAULT;
            const time = log.created_at
              ? new Date(log.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-";

            return (
              <div key={log.id || idx} className="relative flex gap-4 pb-8 last:pb-0">
                <div className="flex-shrink-0 z-10">
                  <div className="w-9 h-9 rounded-full bg-blue-600 shadow-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-white">{icon}</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {log.action?.replace(/_/g, " ") || "Activity"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {log.details || log.target || "-"}
                    </p>
                  </div>
                  <span className="text-[0.6rem] font-semibold text-gray-400 dark:text-gray-500 uppercase bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md whitespace-nowrap">
                    {time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;

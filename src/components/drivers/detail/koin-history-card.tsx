"use client";

import type { ReactNode } from "react";
import type { KoinTransaction } from "@/lib/types/koin";

interface KoinHistoryCardProps {
  item: KoinTransaction;
}

const typeConfig: Record<
  string,
  { label: string; icon: string; color: string; bg: string; border: string; isPositive: boolean }
> = {
  top_up: {
    label: "Top Up",
    icon: "add_circle",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-l-emerald-500",
    isPositive: true,
  },
  rental_payment: {
    label: "Pembayaran Rental",
    icon: "directions_car",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-l-blue-500",
    isPositive: false,
  },
  refund: {
    label: "Refund",
    icon: "replay",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-l-orange-500",
    isPositive: true,
  },
  withdrawal: {
    label: "Penarikan",
    icon: "payments",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-l-slate-400",
    isPositive: false,
  },
};

export function KoinHistoryCard({ item }: KoinHistoryCardProps) {
  const cfg = typeConfig[item.type] || typeConfig.withdrawal;
  const date = new Date(item.created_at);
  const dateStr = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 ${cfg.border} shadow-sm overflow-hidden flex flex-col`}
    >
      {/* Header: Type */}
      <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`material-symbols-outlined text-lg ${cfg.color}`}>
            {cfg.icon}
          </span>
          <h3 className={`text-xs font-bold uppercase tracking-wide truncate ${cfg.color}`}>
            {cfg.label}
          </h3>
        </div>
      </div>

      {/* Hero: Amount */}
      <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mb-1">
          Jumlah
        </p>
        <p className={`text-2xl font-bold leading-none ${cfg.color}`}>
          {cfg.isPositive ? "+" : "-"} Rp{" "}
          {Number(item.amount).toLocaleString("id-ID")}
        </p>
      </div>

      {/* Details */}
      <div className="px-5 py-4 space-y-3 flex-1">
        <InfoField icon="receipt_long" label="Referensi">
          <span className="font-mono">{item.reference_number || "-"}</span>
        </InfoField>

        <InfoField icon="calendar_today" label="Tanggal">
          <span className="block">{dateStr}</span>
          <span className="block text-xs font-normal text-slate-400">
            {timeStr}
          </span>
        </InfoField>

        {item.notes && (
          <InfoField icon="notes" label="Catatan">
            <span className="text-slate-500 dark:text-slate-400 italic font-normal">
              {item.notes}
            </span>
          </InfoField>
        )}
      </div>
    </div>
  );
}

interface InfoFieldProps {
  icon: string;
  label: string;
  children: ReactNode;
}

function InfoField({ icon, label, children }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-base">
          {icon}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide leading-tight">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
          {children}
        </p>
      </div>
    </div>
  );
}
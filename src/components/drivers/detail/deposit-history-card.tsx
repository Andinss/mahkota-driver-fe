"use client";

import type { ReactNode } from "react";
import type { HistorySetoran } from "@/lib/types/history";

interface DepositHistoryCardProps {
  item: HistorySetoran;
}

const methodConfig: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  cash: { label: "Cash", icon: "payments", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  transfer: { label: "Transfer", icon: "account_balance", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  "e-wallet": { label: "E-Wallet", icon: "smartphone", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  koin: { label: "Koin", icon: "wallet", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  paid: { label: "Paid", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "check_circle" },
  unpaid: { label: "Unpaid", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", icon: "cancel" },
  pending: { label: "Pending", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", icon: "schedule" },
  cancelled: { label: "Cancelled", color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", icon: "block" },
};

export function DepositHistoryCard({ item }: DepositHistoryCardProps) {
  const date = new Date(item.payment_date);
  const timeStr = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const dateFull = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const dayName = date.toLocaleDateString("id-ID", { weekday: "long" });
  const method = methodConfig[item.payment_method] || methodConfig.cash;
  const status = statusConfig[item.finance_type] || statusConfig.pending;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header: Method + Status */}
      <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-lg ${method.color}`}>
            {method.icon}
          </span>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
            {method.label}
          </h3>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
          <span className="material-symbols-outlined text-xs">{status.icon}</span>
          {status.label}
        </span>
      </div>

      {/* Amount Section */}
      <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mb-1">
          Amount
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
          Rp {item.amount_received.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Details */}
      <div className="px-5 py-4 space-y-3">
        <InfoField icon="calendar_today" label="Date">
          {dayName}, {dateFull}
        </InfoField>
        <InfoField icon="schedule" label="Time">
          {timeStr}
        </InfoField>
        <InfoField icon="receipt_long" label="Reference" mono>
          {item.reference_number}
        </InfoField>
        {item.rental_number && (
          <InfoField icon="directions_car" label="Rental" mono>
            {item.rental_number}
          </InfoField>
        )}
      </div>

      {/* Notes */}
      {item.notes && (
        <div className="px-5 pb-4">
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="material-symbols-outlined text-slate-400 text-sm shrink-0 mt-0.5">
              notes
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
              {item.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface InfoFieldProps {
  icon: string;
  label: string;
  children: ReactNode;
  mono?: boolean;
}

function InfoField({ icon, label, children, mono }: InfoFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-base">
          {icon}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide leading-tight">
          {label}
        </p>
        <p className={`text-sm font-semibold text-slate-900 dark:text-white leading-tight truncate ${mono ? "font-mono" : ""}`}>
          {children}
        </p>
      </div>
    </div>
  );
}
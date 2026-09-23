"use client";

import type { HistorySetoran } from "@/lib/types/history";

interface DepositHistoryRowProps {
  item: HistorySetoran;
}

const methodConfig: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  cash: { label: "Cash", icon: "payments", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  transfer: { label: "Transfer", icon: "account_balance", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  "e-wallet": { label: "E-Wallet", icon: "smartphone", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  koin: { label: "Koin", icon: "wallet", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  saldo: { label: "Koin", icon: "wallet", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  paid: { label: "Paid", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", dot: "bg-emerald-500" },
  unpaid: { label: "Unpaid", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", dot: "bg-red-500" },
  pending: { label: "Pending", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", dot: "bg-amber-500" },
  cancelled: { label: "Cancelled", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", dot: "bg-slate-400" },
};

export function DepositHistoryRow({ item }: DepositHistoryRowProps) {
  const date = new Date(item.payment_date);
  const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const method = methodConfig[item.payment_method] || methodConfig.cash;
  const status = statusConfig[item.finance_type] || statusConfig.pending;

  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors group">
      <td className="px-6 py-4">
        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
          {item.reference_number}
        </span>
      </td>
      <td className="px-6 py-4">
        <p className="text-slate-900 dark:text-white">{dateStr}</p>
        <p className="text-xs text-slate-400">{timeStr}</p>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${method.bg} ${method.color}`}>
          <span className="material-symbols-outlined text-sm">{method.icon}</span>
          {method.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          Rp {item.amount_received.toLocaleString("id-ID")}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${status.bg} ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4">
        {item.rental_number ? (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
            {item.rental_number}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
    </tr>
  );
}
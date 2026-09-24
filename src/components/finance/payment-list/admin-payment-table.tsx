"use client";

import type { FinanceItem } from "@/lib/types/finances";
import { formatDateOnly, formatDateTime } from "@/lib/utils/format";

interface AdminPaymentTableProps {
  payments: FinanceItem[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const statusColor: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabel: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
};

export const AdminPaymentTable = ({ payments }: AdminPaymentTableProps) => {
  if (payments.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        <span className="material-symbols-outlined text-4xl mb-2 block">admin_panel_settings</span>
        <p>Belum ada admin fee</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-6 py-4">No. Referensi</th>
            <th className="px-6 py-4">Driver</th>
            <th className="px-6 py-4">Kendaraan</th>
            <th className="px-6 py-4">Admin Fee</th>
            <th className="px-6 py-4">Tanggal Dibuat</th>
            <th className="px-6 py-4">Tanggal Bayar</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {payments.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-6 py-4 font-mono text-xs text-slate-400">
                {item.reference_number}
              </td>
              <td className="px-6 py-4">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {item.payer || "-"}
                </p>
              </td>
              <td className="px-6 py-4">
                <p className="font-medium text-slate-900 dark:text-white">
                  {item.vehicle ? `${item.vehicle.merk} ${item.vehicle.model}` : "-"}
                </p>
                {item.vehicle?.license_plate && (
                  <p className="text-xs text-slate-400 font-mono">{item.vehicle.license_plate}</p>
                )}
              </td>
              <td className="px-6 py-4 font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(item.fee_admin_join || 0)}
              </td>
              <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                {formatDateTime(item.created_at || "")}
              </td>
              <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                {item.status === "paid" && item.payment_date
                  ? item.paid_at
                    ? formatDateTime(item.paid_at)
                    : formatDateOnly(item.payment_date)
                  : "-"}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[item.status] || "bg-slate-100 text-slate-700"}`}>
                  {statusLabel[item.status] || item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

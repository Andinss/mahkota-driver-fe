"use client";

import type { FinanceItem } from "@/lib/types/finances";
import { formatDateOnly, formatDateTime } from "@/lib/utils/format";

interface AdminPaymentTableProps {
  payments: FinanceItem[];
  onSelect?: (item: FinanceItem) => void;
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
  paid: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  unpaid: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

const statusLabel: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
};

export const AdminPaymentTable = ({ payments, onSelect }: AdminPaymentTableProps) => {
  return (
    <>
      {/* Header Card */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">
              admin_panel_settings
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Admin Payment
            </h2>
            <p className="text-xs text-slate-400">
              {payments.length} fee membership tercatat
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      {payments.length === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            admin_panel_settings
          </span>
          <p>Belum ada fee membership</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Sisa</th>
                <th className="px-4 py-3">Dibuat</th>
                <th className="px-4 py-3">Dibayar</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {payments.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelect?.(item)}
                  className={`hover:bg-white dark:hover:bg-slate-800/30 transition-colors ${
                    onSelect ? "cursor-pointer" : ""
                  }`}
                >
                  {/* Reference */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px] block">
                      {item.reference_number}
                    </span>
                  </td>

                  {/* Driver */}
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                      {item.payer || "-"}
                    </p>
                  </td>

                  {/* Kendaraan */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 dark:text-white truncate max-w-[140px]">
                      {item.vehicle
                        ? `${item.vehicle.merk} ${item.vehicle.model}`
                        : "-"}
                    </p>
                    {item.vehicle?.license_plate && (
                      <p className="text-xs text-slate-400 font-mono truncate max-w-[140px]">
                        {item.vehicle.license_plate}
                      </p>
                    )}
                  </td>

                  {/* Fee Membership */}
                  <td className="px-4 py-3 font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    {formatCurrency(item.fee_admin_join || 0)}
                  </td>

                  {/* Sisa Tagihan */}
                  <td
                    className={`px-4 py-3 font-semibold whitespace-nowrap ${
                      Number(item.remaining_amount) > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {formatCurrency(Number(item.remaining_amount) || 0)}
                  </td>

                  {/* Tanggal Dibuat */}
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDateTime(item.created_at || "")}
                  </td>

                  {/* Tanggal Bayar */}
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {item.status === "paid" && item.payment_date
                      ? item.paid_at
                        ? formatDateTime(item.paid_at)
                        : formatDateOnly(item.payment_date)
                      : "-"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                        statusColor[item.status] ||
                        "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {statusLabel[item.status] || item.status}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(item);
                      }}
                      title="Detail Pembayaran"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        visibility
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
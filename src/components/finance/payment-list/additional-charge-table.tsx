"use client";

import { useState } from "react";
import type { FinanceItem, FinancePaymentItem } from "@/lib/types/finances";
import { financeApi } from "@/lib/api/finances";
import {
  confirmToast,
  toastError,
  toastSuccess,
} from "@/components/ui/toast-provider";
import { formatDateOnly, formatDateTime } from "@/lib/utils/format";

interface AdditionalChargeTableProps {
  payments: FinanceItem[];
  onSelect?: (item: FinanceItem) => void;
  /** Dipanggil setelah membatalkan tagihan supaya daftar di-refresh. */
  onChanged?: () => void;
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
  pending:
    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  rejected:
    "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  cancelled:
    "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const statusLabel: Record<string, string> = {
  paid: "Lunas",
  unpaid: "Belum Bayar",
  pending: "Menunggu Verifikasi",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
};

const getPendingPayment = (item: FinanceItem): FinancePaymentItem | undefined =>
  (item.payments || []).find((p) => p.status === "pending");

export const AdditionalChargeTable = ({
  payments,
  onSelect,
  onChanged,
}: AdditionalChargeTableProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async (item: FinanceItem) => {
    const confirmed = await confirmToast({
      title: "Batalkan Tagihan",
      message: `Batalkan tagihan tambahan ${item.charge_name || item.reference_number} (${formatCurrency(Number(item.fee_admin_join) || 0)}) untuk ${item.payer || "-"}?`,
      confirmText: "Ya, Batalkan",
      cancelText: "Kembali",
      variant: "danger",
    });
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await financeApi.cancel(item.id);
      toastSuccess("Tagihan tambahan dibatalkan");
      onChanged?.();
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Gagal membatalkan tagihan",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Header Card */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-orange-500 text-xl">
              receipt_long
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Additional Charges
            </h2>
            <p className="text-xs text-slate-400">
              {payments.length} tagihan tambahan tercatat
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      {payments.length === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            receipt_long
          </span>
          <p>Belum ada tagihan tambahan</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Nama Tagihan</th>
                <th className="px-4 py-3">Alasan</th>
                <th className="px-4 py-3">Nominal</th>
                <th className="px-4 py-3">Dibayar</th>
                <th className="px-4 py-3">Sisa</th>
                <th className="px-4 py-3">Pembayaran Pending</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {payments.map((item) => {
                const pendingPayment = getPendingPayment(item);
                const pendingCount = (item.payments || []).filter(
                  (p) => p.status === "pending",
                ).length;
                const canCancel =
                  item.status !== "cancelled" && item.status !== "paid";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Reference */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onSelect?.(item)}
                        className="font-mono text-xs text-primary hover:underline text-left truncate max-w-[120px] block"
                        title="Lihat detail"
                      >
                        {item.reference_number}
                      </button>
                    </td>

                    {/* Driver */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                        {item.payer || "-"}
                      </p>
                      {item.driver?.employee_id && (
                        <p className="text-xs text-slate-400 font-mono">
                          {item.driver.employee_id}
                        </p>
                      )}
                    </td>

                    {/* Nama Tagihan */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                        {item.charge_name || item.notes || "-"}
                      </p>
                    </td>

                    {/* Alasan */}
                    <td className="px-4 py-3">
                      <p
                        className="text-slate-500 dark:text-slate-400 text-xs truncate max-w-[220px]"
                        title={item.reason || undefined}
                      >
                        {item.reason || "-"}
                      </p>
                    </td>

                    {/* Nominal */}
                    <td className="px-4 py-3 font-semibold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                      {formatCurrency(Number(item.fee_admin_join) || 0)}
                    </td>

                    {/* Sudah Dibayar */}
                    <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {formatCurrency(Number(item.paid_amount) || 0)}
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

                    {/* Pembayaran Pending */}
                    <td className="px-4 py-3">
                      {pendingPayment ? (
                        <div className="min-w-0">
                          <p className="font-bold text-amber-600 dark:text-amber-400">
                            {formatCurrency(Number(pendingPayment.amount) || 0)}
                            {pendingCount > 1 && (
                              <span className="ml-1 text-xs font-medium text-slate-400">
                                (+{pendingCount - 1})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {pendingPayment.payment_method}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          -
                        </span>
                      )}
                    </td>

                    {/* Tanggal */}
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDateTime(item.created_at || "")}
                      <p className="text-slate-400">
                        {formatDateOnly(item.payment_date)}
                      </p>
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
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect?.(item);
                          }}
                          disabled={isSubmitting}
                          title="Detail Pembayaran"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            visibility
                          </span>
                        </button>
                        {canCancel && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(item);
                            }}
                            disabled={isSubmitting}
                            title="Batalkan tagihan"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isSubmitting ? "hourglass_empty" : "cancel"}
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

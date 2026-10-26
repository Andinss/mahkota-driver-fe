"use client";

import { useState } from "react";
import type { FinanceItem, FinancePaymentItem } from "@/lib/types/finances";
import { financeApi } from "@/lib/api/finances";
import {
  confirmToast,
  toastError,
  toastSuccess,
} from "@/components/ui/toast-provider";
import { resolveImageUrl } from "@/lib/utils/image";
import { formatDateOnly, formatDateTime } from "@/lib/utils/format";
import { getErrorMessage } from "@/lib/utils/error-message";

interface AdminPaymentTableProps {
  payments: FinanceItem[];
  onSelect?: (item: FinanceItem) => void;
  /** Dipanggil setelah verifikasi / penolakan supaya daftar di-refresh. */
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
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  rejected: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  cancelled: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const statusLabel: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  pending: "Pending",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
};

const methodLabel: Record<string, string> = {
  cash: "Tunai",
  transfer: "Transfer",
  "e-wallet": "E-Wallet",
  saldo: "Koin Driver",
};

export const AdminPaymentTable = ({
  payments,
  onSelect,
  onChanged,
}: AdminPaymentTableProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Dialog penolakan — berisi alasan opsional yang dikirim ke driver.
  const [rejectTarget, setRejectTarget] = useState<{
    finance: FinanceItem;
    payment: FinancePaymentItem;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  /** Ambil pembayaran pending terakhir (paling baru) dari sebuah tagihan. */
  const getPendingPayment = (
    item: FinanceItem,
  ): FinancePaymentItem | null => {
    const pending = (item.payments || []).filter((p) => p.status === "pending");
    if (pending.length === 0) return null;
    return pending[pending.length - 1];
  };

  const handleVerify = async (
    finance: FinanceItem,
    payment: FinancePaymentItem,
  ) => {
    const confirmed = await confirmToast({
      title: "Verifikasi Pembayaran",
      message: `Konfirmasi pembayaran ${formatCurrency(Number(payment.amount) || 0)} dari ${finance.payer || finance.reference_number} sebagai pembayaran valid?`,
      confirmText: "Ya, Verifikasi",
      cancelText: "Batal",
      variant: "info",
    });
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await financeApi.updatePaymentStatus(finance.id, payment.id, {
        status: "paid",
      });
      toastSuccess("Pembayaran diverifikasi");
      onChanged?.();
    } catch (err) {
      console.error("Gagal mengubah status pembayaran:", err);
      toastError(getErrorMessage(err, "Gagal mengubah status pembayaran."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    const { finance, payment } = rejectTarget;
    const reason = rejectReason.trim();
    setRejectTarget(null);
    setRejectReason("");
    setIsSubmitting(true);
    try {
      await financeApi.updatePaymentStatus(finance.id, payment.id, {
        status: "cancelled",
        reason: reason || undefined,
      });
      toastSuccess(
        "Pembayaran ditolak — driver dapat mengajukan ulang pembayaran",
      );
      onChanged?.();
    } catch (err) {
      console.error("Gagal mengubah status pembayaran:", err);
      toastError(getErrorMessage(err, "Gagal mengubah status pembayaran."));
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <th className="px-4 py-3">Pembayaran Pending</th>
                <th className="px-4 py-3">Dibuat</th>
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
                // Alasan penolakan hanya relevan selama tagihan berstatus
                // "Ditolak" (belum ada pembayaran yang disetujui). Begitu
                // admin memverifikasi, catatan ini ikut hilang.
                const rejectionNote =
                  item.status === "rejected"
                    ? [...(item.payments || [])]
                        .reverse()
                        .find(
                          (p) =>
                            p.status === "cancelled" && p.rejection_reason,
                        )?.rejection_reason
                    : undefined;
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

                    {/* Pembayaran Pending */}
                    <td className="px-4 py-3">
                      {pendingPayment ? (
                        <div className="flex items-start gap-3">
                          {pendingPayment.proof_image && (
                            <a
                              href={
                                resolveImageUrl(pendingPayment.proof_image) ??
                                undefined
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Lihat bukti pembayaran"
                              className="shrink-0"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  resolveImageUrl(pendingPayment.proof_image) ??
                                  undefined
                                }
                                alt="Bukti pembayaran"
                                className="w-10 h-10 object-cover rounded-md border border-slate-200 dark:border-slate-700"
                              />
                            </a>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-amber-600 dark:text-amber-400">
                              {formatCurrency(
                                Number(pendingPayment.amount) || 0,
                              )}
                              {pendingCount > 1 && (
                                <span className="ml-1 text-xs font-medium text-slate-400">
                                  (+{pendingCount - 1})
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {methodLabel[pendingPayment.payment_method] ||
                                pendingPayment.payment_method}
                              {pendingPayment.method_payment
                                ? ` → ${pendingPayment.method_payment.name}`
                                : ""}
                            </p>
                            {pendingPayment.reference_number && (
                              <p className="font-mono text-xs text-slate-400 truncate max-w-[160px]">
                                {pendingPayment.reference_number}
                              </p>
                            )}
                            {pendingPayment.source_account && (
                              <p className="text-xs text-slate-400 truncate max-w-[160px]">
                                Dari: {pendingPayment.source_account}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          -
                        </span>
                      )}
                    </td>

                    {/* Tanggal Dibuat */}
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDateTime(item.created_at || "")}
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
                      {item.status === "paid" && item.paid_at && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatDateOnly(item.paid_at)}
                        </p>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {pendingPayment ? (
                          <>
                            <button
                              onClick={() => handleVerify(item, pendingPayment)}
                              disabled={isSubmitting}
                              title="Verifikasi pembayaran"
                              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                              Verifikasi
                            </button>
                            <button
                              onClick={() => {
                                setRejectTarget({
                                  finance: item,
                                  payment: pendingPayment,
                                });
                                setRejectReason("");
                              }}
                              disabled={isSubmitting}
                              title="Tolak bukti pembayaran"
                              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 disabled:opacity-50 transition-colors"
                            >
                              Tolak
                            </button>
                          </>
                        ) : (
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
                        )}
                      </div>
                      {rejectionNote && (
                        <p
                          className="text-xs text-rose-500 dark:text-rose-400 mt-1 max-w-[180px] truncate"
                          title={rejectionNote}
                        >
                          Ditolak: {rejectionNote}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog penolakan — alasan opsional, dikirim ke driver */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isSubmitting && setRejectTarget(null)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-xl">
                  cancel
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Tolak Pembayaran
                </h3>
                <p className="text-xs text-slate-400">
                  {rejectTarget.finance.payer || "-"} —{" "}
                  {rejectTarget.finance.reference_number}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm">
              <p className="text-slate-500 dark:text-slate-400">
                Pembayaran{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(Number(rejectTarget.payment.amount) || 0)}
                </span>{" "}
                akan ditolak. Tagihan berstatus{" "}
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  Ditolak
                </span>{" "}
                dan driver dapat mengajukan ulang.
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                Alasan Penolakan (opsional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: bukti transfer tidak terbaca / nominal tidak sesuai"
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setRejectTarget(null)}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-lg">
                  {isSubmitting ? "hourglass_empty" : "cancel"}
                </span>
                {isSubmitting ? "Menyimpan..." : "Ya, Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

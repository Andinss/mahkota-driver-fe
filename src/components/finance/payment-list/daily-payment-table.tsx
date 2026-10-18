"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/components/ui/pagination";
import { financeApi } from "@/lib/api/finances";
import {
  confirmToast,
  toastError,
  toastSuccess,
} from "@/components/ui/toast-provider";
import { resolveImageUrl } from "@/lib/utils/image";
import type { DailyPaymentItem } from "@/lib/types/finances";

interface DailyPaymentTableProps {
  payments: DailyPaymentItem[];
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

const formatDateOnly = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatTimeOnly = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const statusColor: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  unpaid: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  rejected: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
};

const statusLabel: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  pending: "Pending",
  rejected: "Rejected",
};

const methodLabel: Record<string, string> = {
  cash: "Tunai",
  transfer: "Transfer",
  "e-wallet": "E-Wallet",
  saldo: "Koin Driver",
};

export const DailyPaymentTable = ({
  payments,
  onChanged,
}: DailyPaymentTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Dialog penolakan — berisi alasan opsional yang dikirim ke driver.
  const [rejectTarget, setRejectTarget] = useState<DailyPaymentItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const totalResults = payments.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const startEntry = totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalResults);

  const paginatedPayments = payments.slice(startEntry - 1, endEntry);

  useEffect(() => {
    setCurrentPage(1);
  }, [payments]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  /**
   * Verifikasi pembayaran pending dari driver: `paid` = bukti diterima.
   */
  const handleVerify = async (item: DailyPaymentItem) => {
    const confirmed = await confirmToast({
      title: "Verifikasi Pembayaran",
      message: `Konfirmasi pembayaran Rp ${formatCurrency(item.amount)} dari ${item.driver_name} sebagai pembayaran valid?`,
      confirmText: "Ya, Verifikasi",
      cancelText: "Batal",
      variant: "info",
    });
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await financeApi.updateDailyPaymentStatus(item.id, "paid");
      toastSuccess("Pembayaran diverifikasi");
      onChanged?.();
    } catch (err) {
      toastError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah status pembayaran",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Eksekusi penolakan dari dialog — status jadi `rejected`, driver bisa submit ulang. */
  const handleReject = async () => {
    if (!rejectTarget) return;
    const item = rejectTarget;
    const reason = rejectReason.trim();
    setRejectTarget(null);
    setRejectReason("");
    setIsSubmitting(true);
    try {
      await financeApi.updateDailyPaymentStatus(item.id, "rejected", reason || undefined);
      toastSuccess(
        "Pembayaran ditolak — driver dapat mengajukan ulang pembayaran",
      );
      onChanged?.();
    } catch (err) {
      toastError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah status pembayaran",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (totalResults === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        <span className="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
        <p>Belum ada tagihan hari ini</p>
      </div>
    );
  }

  return (
    <>
      {/* Header Card */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">
              receipt_long
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Daily Payment
            </h2>
            <p className="text-xs text-slate-400">
              {totalResults} tagihan tercatat
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      {totalResults === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            receipt_long
          </span>
          <p>Belum ada tagihan hari ini</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Driver / Plat</th>
                  <th className="px-4 py-3">Kendaraan / Vendor</th>
                  <th className="px-4 py-3">Status / Ref</th>
                  <th className="px-4 py-3">Rental</th>
                  <th className="px-4 py-3">Jumlah</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                  <th className="px-4 py-3">Dibuat</th>
                  <th className="px-4 py-3">Dibayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {paginatedPayments.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Driver + Plat */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                        {item.driver_name}
                      </p>
                      <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[180px]">
                        {item.license_plate}
                      </p>
                    </td>

                    {/* Kendaraan + Vendor */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]">
                        {item.vehicle_name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[180px]">
                        {item.vendor_name || "-"}
                      </p>
                    </td>

                    {/* Status + Reference */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          statusColor[item.status] ||
                          "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {statusLabel[item.status] || item.status}
                      </span>
                      <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[140px]">
                        {item.reference_number}
                      </p>
                      {item.transaction_id && (
                        <p
                          className="font-mono text-xs font-semibold text-primary mt-0.5 truncate max-w-[140px]"
                          title={`ID Transaksi: ${item.transaction_id}`}
                        >
                          ID trx: {item.transaction_id}
                        </p>
                      )}
                      {item.payment_notes && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[180px]" title={item.payment_notes}>
                          Catatan: {item.payment_notes}
                        </p>
                      )}
                      {item.status === "rejected" && (
                        <p
                          className="text-xs text-rose-500 dark:text-rose-400 mt-0.5 max-w-[180px]"
                          title={item.rejection_reason || undefined}
                        >
                          Ditolak{item.rejection_reason ? `: ${item.rejection_reason}` : ""}
                        </p>
                      )}
                      {item.payment_method && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[180px]">
                          {methodLabel[item.payment_method] || item.payment_method}
                          {item.method_payment
                            ? ` → ${item.method_payment.name}`
                            : ""}
                        </p>
                      )}
                      {item.source_account && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[180px]">
                          Dari: {item.source_account}
                        </p>
                      )}
                      {item.proof_image && (
                        <a
                          href={resolveImageUrl(item.proof_image) ?? undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Lihat bukti pembayaran"
                          className="inline-block mt-1"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveImageUrl(item.proof_image) ?? undefined}
                            alt="Bukti pembayaran"
                            className="w-9 h-9 object-cover rounded-md border border-slate-200 dark:border-slate-700"
                          />
                        </a>
                      )}
                    </td>

                    {/* Rental */}
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                      {item.rental_number}
                    </td>

                    {/* Jumlah */}
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </td>

                    {/* Aksi verifikasi */}
                    <td className="px-4 py-3 text-center">
                      {item.status === "pending" ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleVerify(item)}
                            disabled={isSubmitting}
                            title="Verifikasi pembayaran"
                            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                          >
                            Verifikasi
                          </button>
                          <button
                            onClick={() => {
                              setRejectTarget(item);
                              setRejectReason("");
                            }}
                            disabled={isSubmitting}
                            title="Tolak bukti pembayaran"
                            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 disabled:opacity-50 transition-colors"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 material-symbols-outlined text-xl">
                          {item.status === "paid"
                            ? "check_circle"
                            : item.status === "rejected"
                              ? "cancel"
                              : "remove"}
                        </span>
                      )}
                    </td>

                    {/* Tanggal Dibuat — 2 baris */}
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {formatDateOnly(item.created_at)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatTimeOnly(item.created_at)}
                      </p>
                    </td>

                    {/* Tanggal Bayar — 2 baris */}
                    <td className="px-4 py-3">
                      {item.status === "paid" ? (
                        <>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {formatDateOnly(item.updated_at)}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {formatTimeOnly(item.updated_at)}
                          </p>
                        </>
                      ) : item.paid_date ? (
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {formatDateOnly(item.paid_date)}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">-</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              resultsPerPage={itemsPerPage}
              onPageChange={goToPage}
              onPageSizeChange={handleItemsPerPageChange}
            />
          </div>
        </>
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
                  {rejectTarget.driver_name} — {rejectTarget.reference_number}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm">
              <p className="text-slate-500 dark:text-slate-400">
                Pembayaran{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(rejectTarget.amount)}
                </span>{" "}
                akan ditolak. Tagihan berstatus{" "}
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  Ditolak
                </span>{" "}
                dan driver dapat mengajukan ulang (data &amp; bukti lama akan
                ditimpa).
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
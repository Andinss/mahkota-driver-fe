"use client";

import { useState } from "react";
import type { FinanceItem, FinancePaymentItem } from "@/lib/types/finances";
import { financeApi } from "@/lib/api/finances";
import {
  toastError,
  toastSuccess,
  confirmToast,
} from "@/components/ui/toast-provider";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { resolveImageUrl } from "@/lib/utils/image";
import { getTodayLocal } from "@/lib/utils/format";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const methodLabel: Record<string, string> = {
  cash: "Cash",
  transfer: "Transfer",
  "e-wallet": "E-Wallet",
  saldo: "Koin",
};

const statusLabel: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  cancelled: "Cancelled",
};

const statusStyle: Record<string, string> = {
  pending:
    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  paid: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

interface PaymentHistoryProps {
  finance: FinanceItem;
  onChanged?: () => void;
}

const PaymentHistory = ({ finance, onChanged }: PaymentHistoryProps) => {
  const payments: FinancePaymentItem[] = finance.payments || [];
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [paymentDate, setPaymentDate] = useState(() => getTodayLocal());
  const [notes, setNotes] = useState("");

  const canPay = finance.status !== "paid" && finance.status !== "cancelled";
  const remaining = finance.remaining_amount ?? 0;
  const totalFinance = finance.fee_admin_join ?? finance.amount_received ?? 0;

  const refresh = () => onChanged?.();

  const handleVerify = async (
    payment: FinancePaymentItem,
    nextStatus: "paid" | "cancelled",
  ) => {
    const confirmed = await confirmToast({
      title: nextStatus === "paid" ? "Verify Payment" : "Cancel Payment",
      message:
        nextStatus === "paid"
          ? `Konfirmasi pembayaran Rp ${formatCurrency(payment.amount)} sebagai pembayaran valid dan uang masuk?`
          : "Batalkan pembayaran ini?",
      confirmText: nextStatus === "paid" ? "Ya, Verifikasi" : "Ya, Batalkan",
      cancelText: "Batal",
      variant: nextStatus === "paid" ? "info" : "warning",
    });
    if (!confirmed) return;
    setIsSubmitting(true);
    try {
      await financeApi.updatePaymentStatus(finance.id, payment.id, {
        status: nextStatus,
      });
      toastSuccess(
        nextStatus === "paid"
          ? "Pembayaran diverifikasi"
          : "Pembayaran dibatalkan",
      );
      refresh();
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Gagal mengubah status pembayaran",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPayment = async () => {
    const parsed = parseFloat(amount.replace(/[^\d.]/g, "")) || 0;
    if (parsed <= 0) {
      toastError("Nominal pembayaran harus lebih dari 0");
      return;
    }
    if (parsed > remaining) {
      toastError(
        `Nominal melebihi sisa tagihan (${formatCurrency(remaining)})`,
      );
      return;
    }
    if (!paymentDate) {
      toastError("Tanggal pembayaran wajib diisi");
      return;
    }
    setIsSubmitting(true);
    try {
      await financeApi.createPayment(finance.id, {
        amount: parsed,
        payment_method: paymentMethod,
        payment_date: paymentDate,
        notes: notes || undefined,
      });
      toastSuccess("Pembayaran dicatat dan agregat ke tagihan");
      setIsAdding(false);
      setAmount("");
      setNotes("");
      refresh();
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Gagal mencatat pembayaran",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-500 text-xl">
              receipt_long
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Riwayat Pembayaran
            </h3>
            <p className="text-xs text-slate-400">
              {payments.length} pembayaran tercatat · Sisa{" "}
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>
        {canPay && (
          <button
            onClick={() => setIsAdding((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            <span className="material-symbols-outlined text-base">
              add_card
            </span>
            Catat Cicilan
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-6 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Nominal
              </label>
              <CurrencyInput
                placeholder="0"
                value={amount}
                onChange={setAmount}
              />
              <div className="flex flex-wrap gap-2">
                {remaining > 0 && (
                  <button
                    type="button"
                    onClick={() => setAmount(String(remaining))}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    Lunas {formatCurrency(remaining)}
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Tanggal
              </label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Metode
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200"
              >
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
                <option value="e-wallet">E-Wallet</option>
                <option value="saldo">Koin</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Catatan
              </label>
              <Input
                type="text"
                placeholder="Opsional"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 mr-auto">
              Sisa tagihan:{" "}
              <b className="text-orange-500">{formatCurrency(remaining)}</b>
            </p>
            <button
              onClick={() => {
                setIsAdding(false);
                setAmount("");
                setNotes("");
              }}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Batal
            </button>
            <button
              onClick={handleAddPayment}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="py-10 text-center text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined text-4xl mb-2">
            receipt_long
          </span>
          <p className="text-sm font-medium">
            Belum ada pembayaran untuk tagihan ini
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Nominal</th>
                <th className="px-4 py-3">Metode</th>
                <th className="px-4 py-3">Referensi</th>
                <th className="px-4 py-3">Bukti</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-white dark:hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(p.payment_date)}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    <span className="capitalize font-medium">
                      {methodLabel[p.payment_method] || p.payment_method}
                    </span>
                    {p.method_payment && (
                      <span className="block text-xs text-slate-400 dark:text-slate-500">
                        Ke: {p.method_payment.name}
                        {p.method_payment.account_number
                          ? ` (${p.method_payment.account_number})`
                          : ""}
                      </span>
                    )}
                    {p.source_account && (
                      <span className="block text-xs text-slate-400 dark:text-slate-500">
                        Dari: {p.source_account}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {p.reference_number || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {p.proof_image ? (
                      <a
                        href={resolveImageUrl(p.proof_image) ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Lihat bukti pembayaran"
                        className="inline-block"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveImageUrl(p.proof_image) ?? undefined}
                          alt="Bukti pembayaran"
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        -
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle[p.status] || ""}`}
                    >
                      {statusLabel[p.status] || p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.status === "pending" && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleVerify(p, "paid")}
                          disabled={isSubmitting}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Verifikasi
                        </button>
                        <button
                          onClick={() => handleVerify(p, "cancelled")}
                          disabled={isSubmitting}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50"
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;

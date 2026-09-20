"use client";

import { useState } from "react";
import { financeApi } from "@/lib/api/finances";
import { HttpClientError } from "@/lib/api-http";
import { toastError } from "@/components/ui/toast-provider";
import type { FinanceItem } from "@/lib/types/finances";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

interface DriverPaymentModalProps {
  finance: FinanceItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function DriverPaymentModal({ finance, onClose, onSuccess }: DriverPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("transfer");
  const [amount, setAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>("");

  const remaining = finance.remaining_amount || 0;
  const parsedAmount = parseFloat(amount.replace(/[^\d]/g, "")) || 0;
  const isValid = parsedAmount > 0 && parsedAmount <= remaining && paymentDate && paymentMethod;

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await financeApi.createMyPayment(finance.id, {
        amount: parsedAmount,
        payment_method: paymentMethod,
        payment_date: paymentDate,
        reference_number: referenceNumber || undefined,
        notes: notes || undefined,
        status: "paid",
      });
      onSuccess();
    } catch (err) {
      if (err instanceof HttpClientError) {
        setServerError(err.message || "Gagal menyimpan pembayaran");
      } else {
        setServerError("Gagal menyimpan pembayaran. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">payment</span>
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-lg">Bayar Tagihan</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{finance.reference_number}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">close</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {serverError && (
            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{serverError}</p>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Tagihan</p>
                <p className="font-bold text-slate-900 dark:text-white">{formatIDR(finance.total_amount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sudah Dibayar</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">{formatIDR(finance.paid_amount)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Sisa Tagihan</p>
                <p className="font-bold text-xl text-orange-600 dark:text-orange-400">{formatIDR(remaining)}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
              Metode Pembayaran <span className="text-red-500">*</span>
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="transfer">Transfer Bank</option>
              <option value="cash">Tunai</option>
              <option value="e-wallet">E-Wallet</option>
              <option value="saldo">Saldo Driver</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
              Nominal Pembayaran <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^\d]/g, "");
                  setAmount(raw ? Number(raw).toLocaleString("id-ID") : "");
                }}
                placeholder="0"
                className="w-full pl-12 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {parsedAmount > remaining && (
              <p className="text-xs text-red-500 mt-1">Nominal melebihi sisa tagihan</p>
            )}
            <button
              type="button"
              onClick={() => setAmount(remaining.toLocaleString("id-ID"))}
              className="mt-2 text-xs text-primary hover:text-primary/80 font-medium"
            >
              Bayar Sisa Penuh ({formatIDR(remaining)})
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
              Tanggal Pembayaran <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
              No. Referensi
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Opsional"
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
              Catatan
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opsional"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-xl">
              {isSubmitting ? "hourglass_empty" : "check_circle"}
            </span>
            {isSubmitting ? "Menyimpan..." : "Konfirmasi Pembayaran"}
          </button>
        </div>
      </div>
    </div>
  );
}

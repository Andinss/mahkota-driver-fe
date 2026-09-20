"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { financeApi } from "@/lib/api/finances";
import { useAuth } from "@/lib/auth-context";
import { HttpClientError } from "@/lib/api-http";
import { toastSuccess, toastError } from "@/components/ui/toast-provider";
import type { FinanceItem } from "@/lib/types/finances";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default function DriverPaymentFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const financeId = searchParams.get("id");
  const { user } = useAuth();

  const [finance, setFinance] = useState<FinanceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentDetail, setPaymentDetail] = useState("");

  const fetchFinance = useCallback(async () => {
    if (!financeId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await financeApi.getById(financeId);
      const data = (response as any)?.data ?? response;
      setFinance(data);
    } catch (err) {
      console.error("Failed to fetch finance:", err);
      toastError("Gagal memuat data tagihan");
    } finally {
      setIsLoading(false);
    }
  }, [financeId]);

  useEffect(() => {
    fetchFinance();
  }, [fetchFinance]);

  const remaining = finance?.remaining_amount || 0;
  const parsedAmount = parseFloat(amount.replace(/[^\d]/g, "")) || 0;
  const isValid = parsedAmount > 0 && parsedAmount <= remaining && paymentDate && paymentMethod;

  const handlePaymentDetailChange = (detail: string) => {
    setPaymentDetail(detail);
    const prefix = paymentMethod === "transfer" ? "Bank: " : "E-Wallet: ";
    const cleanNotes = notes
      .replace(/^(Bank:|E-Wallet:).*$/gm, "")
      .replace(/\n{2,}/g, "\n")
      .trim();
    if (detail) {
      setNotes(cleanNotes ? `${cleanNotes}\n${prefix}${detail}` : `${prefix}${detail}`);
    } else {
      setNotes(cleanNotes);
    }
  };

  const handleSubmit = async () => {
    if (!isValid || !financeId) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await financeApi.createMyPayment(financeId, {
        amount: parsedAmount,
        payment_method: paymentMethod,
        payment_date: paymentDate,
        reference_number: referenceNumber || undefined,
        notes: notes || undefined,
        status: "paid",
      });
      toastSuccess("Pembayaran berhasil dicatat!");
      router.push("/dashboard/driver/payment");
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

  const handleCancel = () => {
    router.push("/dashboard/driver/payment");
  };

  if (isLoading) {
    return (
      <div className="m-8 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 dark:text-slate-400">Memuat data tagihan...</p>
      </div>
    );
  }

  if (!finance) {
    return (
      <div className="m-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-5xl text-slate-300">error</span>
        <p className="text-slate-500 dark:text-slate-400">Tagihan tidak ditemukan</p>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold"
        >
          Kembali
        </button>
      </div>
    );
  }

  const vehicle = finance.vehicle || finance.rentals?.[0]?.vehicle;
  const vehicleName = vehicle ? `${vehicle.merk} ${vehicle.model}` : "-";
  const plate = vehicle?.license_plate || "";

  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 pb-10">
          <div className="mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Bayar Tagihan
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Lengkapi form di bawah untuk melakukan pembayaran
                </p>
              </div>
            </div>
          </div>

          {serverError && (
            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{serverError}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Info Tagihan */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500 text-xl">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">Info Tagihan</h3>
                  <p className="text-xs text-slate-400">{finance.reference_number}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Kendaraan</p>
                  <p className="font-bold text-slate-900 dark:text-white">{vehicleName}</p>
                  {plate && <p className="text-xs font-mono text-slate-500 mt-0.5">{plate}</p>}
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tanggal Tagihan</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {finance.payment_date ? new Date(finance.payment_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Tagihan</p>
                  <p className="font-bold text-lg text-slate-900 dark:text-white">{formatIDR(finance.total_amount)}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Sudah Dibayar</p>
                  <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{formatIDR(finance.paid_amount)}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4">
                  <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Sisa Tagihan</p>
                  <p className="font-bold text-lg text-orange-600 dark:text-orange-400">{formatIDR(remaining)}</p>
                </div>
              </div>
            </div>

            {/* Form Pembayaran */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">payment</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">Form Pembayaran</h3>
                  <p className="text-xs text-slate-400">Isi detail pembayaran di bawah ini</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Metode Pembayaran */}
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

                {/* Detail Bank/E-Wallet */}
                {paymentMethod === "transfer" && (
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                      Nama Bank
                    </label>
                    <input
                      type="text"
                      value={paymentDetail}
                      onChange={(e) => handlePaymentDetailChange(e.target.value)}
                      placeholder="Contoh: BCA, Mandiri, BRI"
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                )}
                {paymentMethod === "e-wallet" && (
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                      Nama E-Wallet
                    </label>
                    <input
                      type="text"
                      value={paymentDetail}
                      onChange={(e) => handlePaymentDetailChange(e.target.value)}
                      placeholder="Contoh: GoPay, OVO, Dana"
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                )}

                {/* Nominal Pembayaran */}
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

                {/* Tanggal Pembayaran */}
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

                {/* No. Referensi */}
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                    No. Referensi / Bukti Transfer
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Masukkan nomor referensi atau bukti transfer"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Catatan */}
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                    Catatan
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Opsional - tambahkan catatan jika diperlukan"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleCancel}
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
      </div>
    </div>
  );
}

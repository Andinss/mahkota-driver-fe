"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { financeApi } from "@/lib/api/finances";
import { koinApi } from "@/lib/api/koin";
import { rekeningApi } from "@/lib/api/rekening";
import { useAuth } from "@/lib/auth-context";
import { HttpClientError } from "@/lib/api-http";
import { toastSuccess, toastError } from "@/components/ui/toast-provider";
import { ProofUpload } from "@/components/driver/payment/proof-upload";
import { resolveImageUrl } from "@/lib/utils/image";
import { getTodayLocal } from "@/lib/utils/format";
import type { FinanceItem, DailyPaymentItem } from "@/lib/types/finances";
import type { Rekening, RekeningMethod } from "@/lib/types/rekening";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

/** Kategori `payment_method` untuk tiap jenis rekening. */
const methodCategory = (method: RekeningMethod): "transfer" | "e-wallet" =>
  method === "bank" ? "transfer" : "e-wallet";

const rekeningLabel = (r: Rekening) => {
  if (r.method === "qris") return `QRIS ${r.name}`;
  const account = r.account_number ? ` - ${r.account_number}` : "";
  const holder = r.account_holder ? ` a.n. ${r.account_holder}` : "";
  return `${r.provider || r.name}${account}${holder}`;
};

/** Bungkus respons API: dukung `{ data }` maupun objek telanjang. */
const unwrap = <T,>(res: unknown): T => {
  const obj = res as { data?: T } | null | undefined;
  return (obj && typeof obj === "object" && "data" in obj && obj.data
    ? obj.data
    : res) as T;
};

export default function DriverPaymentFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billId = searchParams.get("id");
  const isDaily = searchParams.get("type") === "daily";
  const { user } = useAuth();

  const [finance, setFinance] = useState<FinanceItem | null>(null);
  const [daily, setDaily] = useState<DailyPaymentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Pilihan metode: `mp:<id>` (rekening tujuan) | `cash` | `saldo`
  const [selectedMethod, setSelectedMethod] = useState("mp-pending");
  const [rekenings, setRekenings] = useState<Rekening[]>([]);
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(getTodayLocal());
  const [referenceNumber, setReferenceNumber] = useState("");
  const [sourceAccount, setSourceAccount] = useState("");
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [koinBalance, setKoinBalance] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchBill = useCallback(async () => {
    if (!billId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      if (isDaily) {
        const response = await financeApi.getMyDailyPaymentById(billId);
        setDaily(unwrap<DailyPaymentItem>(response));
        setFinance(null);
      } else {
        const response = await financeApi.getById(billId);
        setFinance(unwrap<FinanceItem>(response));
        setDaily(null);
      }
    } catch (err) {
      console.error("Failed to fetch bill:", err);
      toastError("Gagal memuat data tagihan");
    } finally {
      setIsLoading(false);
    }
  }, [billId, isDaily]);

  useEffect(() => {
    fetchBill();
  }, [fetchBill]);

  // Daftar rekening tujuan (QRIS / bank / e-wallet) dari master method-payment.
  useEffect(() => {
    let active = true;
    rekeningApi
      .getList()
      .then((res) => {
        if (!active) return;
        const list = (res.data ?? []).filter((r) => r.is_active);
        setRekenings(list);
        setSelectedMethod((prev) => {
          if (prev !== "mp-pending") return prev;
          return list.length > 0 ? `mp:${list[0].id}` : "cash";
        });
      })
      .catch(() => {
        if (!active) return;
        setSelectedMethod((prev) => (prev === "mp-pending" ? "cash" : prev));
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedRekening =
    selectedMethod.startsWith("mp:")
      ? rekenings.find((r) => `mp:${r.id}` === selectedMethod) ?? null
      : null;
  const paymentMethod = selectedRekening
    ? methodCategory(selectedRekening.method)
    : selectedMethod;
  const isTransferLike = !!selectedRekening;

  useEffect(() => {
    if (paymentMethod === "saldo" && user?.driver_id && koinBalance === null) {
      koinApi
        .getBalance(user.driver_id)
        .then((res) => setKoinBalance(res?.data?.balance ?? 0))
        .catch(() => setKoinBalance(0));
    }
  }, [paymentMethod, user?.driver_id, koinBalance]);

  const isAdminFee = !isDaily
    ? finance
      ? (finance.fee_admin_join ?? 0) > 0 && finance.status !== "paid"
      : false
    : false;
  const displayTotal = isDaily
    ? daily?.amount || 0
    : isAdminFee
      ? finance!.fee_admin_join || 0
      : finance?.fee_admin_join || 0;
  const remaining = isDaily
    ? daily?.amount || 0
    : isAdminFee
      ? Math.max(
          0,
          (finance!.fee_admin_join || 0) - (finance!.paid_amount || 0),
        )
      : finance?.remaining_amount || 0;

  const parsedAmount = parseFloat(amount.replace(/[^\d]/g, "")) || 0;
  const koinInsufficient =
    paymentMethod === "saldo" &&
    koinBalance !== null &&
    koinBalance < parsedAmount;

  /** Tagihan sudah dikonfirmasi driver dan sedang menunggu verifikasi admin. */
  const isPending =
    (isDaily && daily?.status === "pending") ||
    (!isDaily && finance?.status === "pending");

  /** Pembayaran ditolak admin — form terbuka lagi untuk pengajuan ulang. */
  const isRejected = isDaily && daily?.status === "rejected";

  const proofMissing = isTransferLike && !proofFile;
  const sourceMissing = isTransferLike && !sourceAccount.trim();
  const transactionMissing = isTransferLike && !referenceNumber.trim();
  const isValid =
    parsedAmount > 0 &&
    parsedAmount <= remaining &&
    !!paymentDate &&
    !!paymentMethod &&
    !koinInsufficient &&
    !proofMissing &&
    !sourceMissing &&
    !transactionMissing &&
    !isPending;

  useEffect(() => {
    if (finance || daily) {
      setAmount(remaining.toLocaleString("id-ID"));
    }
    // Submit ulang setelah ditolak: isi lagi data sebelumnya (akan ditimpa
    // dengan data baru saat driver submit).
    if (daily?.status === "rejected") {
      if (daily.transaction_id) setReferenceNumber(daily.transaction_id);
      if (daily.source_account) setSourceAccount(daily.source_account);
      if (daily.payment_notes) setNotes(daily.payment_notes);
      if (daily.paid_date) {
        setPaymentDate(String(daily.paid_date).slice(0, 10));
      }
      if (daily.method_payment_id) {
        setSelectedMethod(`mp:${daily.method_payment_id}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finance, daily]);

  const handleAmountChange = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    setAmount(digits ? Number(digits).toLocaleString("id-ID") : "");
  };

  /** Submit: minta konfirmasi dulu, baru eksekusi. */
  const handleSubmit = () => {
    if (!isValid || !billId) return;
    setServerError("");
    setShowConfirm(true);
  };

  const executeSubmit = async () => {
    if (!isValid || !billId) return;
    setShowConfirm(false);
    setIsSubmitting(true);
    setServerError("");

    try {
      if (isDaily) {
        await financeApi.payMyDailyPayment(billId, {
          amount: parsedAmount,
          payment_method: paymentMethod,
          payment_date: paymentDate,
          transaction_id: referenceNumber.trim() || undefined,
          payment_notes: notes.trim() || undefined,
          method_payment_id: selectedRekening?.id,
          source_account: sourceAccount.trim() || undefined,
          proof_image: proofFile,
        });
        toastSuccess(
          isTransferLike
            ? "Konfirmasi pembayaran terkirim — menunggu verifikasi admin"
            : "Tagihan harian berhasil dibayar!",
        );
      } else {
        await financeApi.createMyPayment(billId, {
          amount: parsedAmount,
          payment_method: paymentMethod,
          payment_date: paymentDate,
          reference_number: referenceNumber || undefined,
          notes: notes || undefined,
          method_payment_id: selectedRekening?.id,
          source_account: sourceAccount.trim() || undefined,
          proof_image: proofFile,
        });
        toastSuccess(
          isTransferLike
            ? "Konfirmasi pembayaran terkirim — menunggu verifikasi admin"
            : "Pembayaran berhasil dicatat!",
        );
      }
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
        <p className="text-slate-500 dark:text-slate-400">
          Memuat data tagihan...
        </p>
      </div>
    );
  }

  if (!finance && !daily) {
    return (
      <div className="m-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-5xl text-slate-300">
          error
        </span>
        <p className="text-slate-500 dark:text-slate-400">
          Tagihan tidak ditemukan
        </p>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold"
        >
          Kembali
        </button>
      </div>
    );
  }

  const vehicle = finance?.vehicle || finance?.rentals?.[0]?.vehicle;
  const vehicleName = daily
    ? daily.vehicle_name
    : vehicle
      ? `${vehicle.merk} ${vehicle.model}`
      : "-";
  const plate = daily ? daily.license_plate : vehicle?.license_plate || "";

  const methodSelectLabel = selectedRekening
    ? rekeningLabel(selectedRekening)
    : paymentMethod === "cash"
      ? "Tunai"
      : paymentMethod === "saldo"
        ? "Koin Driver"
        : "-";

  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full flex flex-col gap-8 pb-10">
          <div className="mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">
                  arrow_back
                </span>
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
              <span className="material-symbols-outlined text-red-500">
                error
              </span>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                {serverError}
              </p>
            </div>
          )}

          {isPending && (
            <div className="px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500">
                pending_actions
              </span>
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                Pembayaran sedang menunggu verifikasi admin. Anda tidak dapat
                mengirim pembayaran lagi sampai diverifikasi.
              </p>
            </div>
          )}

          {isRejected && (
            <div className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
              <span className="material-symbols-outlined text-rose-500">
                cancel
              </span>
              <div className="text-sm text-rose-700 dark:text-rose-400 font-medium">
                <p>
                  Pembayaran sebelumnya{" "}
                  <span className="font-bold">ditolak oleh admin</span>. Silakan
                  perbaiki data lalu ajukan ulang — data dan bukti sebelumnya
                  akan ditimpa.
                </p>
                {daily?.rejection_reason && (
                  <p className="text-xs font-normal mt-1">
                    Alasan: {daily.rejection_reason}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Info Tagihan */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500 text-xl">
                    {isDaily ? "receipt_long" : isAdminFee ? "admin_panel_settings" : "receipt_long"}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    {isDaily
                      ? "Info Tagihan Harian"
                      : isAdminFee
                        ? "Fee Membership"
                        : "Info Tagihan"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isDaily ? daily?.reference_number : finance?.reference_number}
                  </p>
                </div>
              </div>
              {isDaily && daily?.vendor_name && daily.vendor_name !== "-" && (
                <div className="flex items-center gap-2 mb-3 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[14px]">
                    storefront
                  </span>
                  {daily.vendor_name}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Kendaraan
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {vehicleName}
                  </p>
                  {plate && (
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      {plate}
                    </p>
                  )}
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Tanggal Tagihan
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {(isDaily ? daily?.payment_date : finance?.payment_date)
                      ? new Date(
                          (isDaily ? daily!.payment_date : finance!.payment_date) as string,
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {isDaily && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Total Tagihan Harian
                    </p>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">
                      {formatIDR(displayTotal)}
                    </p>
                  </div>
                )}
                {isAdminFee && (
                  <>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Fee Membership
                      </p>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">
                        {formatIDR(displayTotal)}
                      </p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                        Sudah Dibayar
                      </p>
                      <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                        {formatIDR(finance?.paid_amount || 0)}
                      </p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4">
                      <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">
                        Sisa Tagihan
                      </p>
                      <p className="font-bold text-lg text-amber-600 dark:text-amber-400">
                        {formatIDR(remaining)}
                      </p>
                    </div>
                  </>
                )}
                {!isDaily && !isAdminFee && (
                  <>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Total Tagihan
                      </p>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">
                        {formatIDR(displayTotal)}
                      </p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                        Sudah Dibayar
                      </p>
                      <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                        {formatIDR(finance?.paid_amount || 0)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Form Pembayaran */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    payment
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    Form Pembayaran
                  </h3>
                  <p className="text-xs text-slate-400">
                    Isi detail pembayaran di bawah ini
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Metode Pembayaran */}
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                    Metode Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedMethod}
                    onChange={(e) => {
                      setSelectedMethod(e.target.value);
                      setProofFile(null);
                      setProofPreview(null);
                    }}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {rekenings.length > 0 && (
                      <optgroup label="Rekening / QRIS / E-Wallet">
                        {rekenings.map((r) => (
                          <option key={r.id} value={`mp:${r.id}`}>
                            {rekeningLabel(r)}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Lainnya">
                      <option value="cash">Tunai</option>
                      <option value="saldo">Koin Driver</option>
                    </optgroup>
                  </select>
                  {rekenings.length === 0 && (
                    <p className="text-xs text-slate-400 mt-1.5">
                      Daftar rekening tujuan belum tersedia — pilih Tunai atau
                      Koin Driver.
                    </p>
                  )}
                </div>

                {/* Kartu rekening tujuan (transfer / e-wallet / QRIS) */}
                {selectedRekening && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                    <div className="flex items-start gap-4">
                      {selectedRekening.method === "qris" &&
                        selectedRekening.image_url && (
                          <div className="w-24 h-24 rounded-lg bg-white border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                resolveImageUrl(
                                  selectedRekening.image_url,
                                ) ?? undefined
                              }
                              alt={`QRIS ${selectedRekening.name}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-lg">
                            {selectedRekening.method === "qris"
                              ? "qr_code_scanner"
                              : selectedRekening.method === "bank"
                                ? "account_balance"
                                : "account_balance_wallet"}
                          </span>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">
                            {selectedRekening.name}
                          </p>
                        </div>
                        {selectedRekening.account_number && (
                          <p className="font-mono font-bold text-lg text-slate-900 dark:text-white mt-1 break-all">
                            {selectedRekening.account_number}
                          </p>
                        )}
                        {selectedRekening.account_holder && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            a.n. {selectedRekening.account_holder}
                          </p>
                        )}
                        {selectedRekening.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            {selectedRekening.description}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-primary mt-2">
                          Transfer ke rekening tujuan di atas, lalu unggah bukti
                          pembayarannya.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "saldo" && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      koinBalance !== null && koinBalance >= remaining
                        ? "bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800"
                        : "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${
                        koinBalance !== null && koinBalance >= remaining
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {koinBalance !== null && koinBalance >= remaining
                        ? "check_circle"
                        : "error"}
                    </span>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Koin Tersedia
                      </p>
                      <p
                        className={`font-bold ${
                          koinBalance !== null && koinBalance >= remaining
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {koinBalance !== null
                          ? formatIDR(koinBalance)
                          : "Memuat..."}
                      </p>
                      {koinBalance !== null && koinBalance < remaining && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                          Koin tidak mencukupi untuk membayar tagihan ini
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Rekening sumber driver */}
                {isTransferLike && (
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                      Rekening / E-Wallet Saya{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={sourceAccount}
                      onChange={(e) => setSourceAccount(e.target.value)}
                      placeholder="Contoh: BCA 1234567890 a.n. Joko"
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-slate-400 mt-1.5">
                      Rekening/e-wallet yang Anda pakai untuk mengirim dana.
                    </p>
                    {sourceMissing && !sourceAccount.trim() && (
                      <p className="text-xs text-red-500 mt-1">
                        Rekening sumber wajib diisi.
                      </p>
                    )}
                  </div>
                )}

                {/* Bukti pembayaran */}
                {isTransferLike && (
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                      Bukti Pembayaran <span className="text-red-500">*</span>
                    </label>
                    <ProofUpload
                      value={proofPreview}
                      file={proofFile}
                      onChange={(next) => {
                        setProofFile(next.file);
                        setProofPreview(next.value);
                      }}
                      error={
                        proofMissing && !proofFile
                          ? "Bukti pembayaran wajib diunggah."
                          : undefined
                      }
                    />
                  </div>
                )}

                {/* Nominal Pembayaran */}
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                    Nominal Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={amount}
                      readOnly={isDaily}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className={`w-full pl-12 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        isDaily
                          ? "bg-slate-50 dark:bg-slate-800 cursor-not-allowed opacity-70"
                          : "bg-white dark:bg-slate-900"
                      }`}
                    />
                  </div>
                  {!isDaily && (
                    <p className="text-xs text-slate-400 mt-1.5">
                      Pembayaran dapat dicicil — nominal boleh diubah, maksimal
                      sisa tagihan {formatIDR(remaining)}.
                    </p>
                  )}
                  {!isDaily && parsedAmount > remaining && (
                    <p className="text-xs text-red-500 mt-1">
                      Nominal melebihi sisa tagihan.
                    </p>
                  )}
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

                {/* ID Transaksi Transfer */}
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                    ID Transaksi Transfer
                    {isTransferLike && <span className="text-red-500"> *</span>}
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Contoh: TRX123456789"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-xs text-slate-400 mt-1.5">
                    Kode/nomor transaksi yang muncul setelah Anda transfer —
                    dipakai admin untuk mencocokkan mutasi.
                  </p>
                  {transactionMissing && (
                    <p className="text-xs text-red-500 mt-1">
                      ID transaksi wajib diisi.
                    </p>
                  )}
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

      {/* Dialog konfirmasi sebelum eksekusi */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isSubmitting && setShowConfirm(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  help
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Konfirmasi Pembayaran
                </h3>
                <p className="text-xs text-slate-400">
                  Pastikan data di bawah sudah benar
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <div className="flex items-start justify-between gap-4 px-4 py-2.5">
                <span className="text-slate-500 dark:text-slate-400">
                  Tagihan
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-right">
                  {vehicleName}
                  {plate ? ` (${plate})` : ""}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 px-4 py-2.5">
                <span className="text-slate-500 dark:text-slate-400">
                  Nominal
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatIDR(parsedAmount)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 px-4 py-2.5">
                <span className="text-slate-500 dark:text-slate-400">
                  Metode
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-right">
                  {methodSelectLabel}
                </span>
              </div>
              {isTransferLike && sourceAccount.trim() && (
                <div className="flex items-start justify-between gap-4 px-4 py-2.5">
                  <span className="text-slate-500 dark:text-slate-400">
                    Dari Rekening
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-right break-all">
                    {sourceAccount.trim()}
                  </span>
                </div>
              )}
              {isTransferLike && referenceNumber.trim() && (
                <div className="flex items-start justify-between gap-4 px-4 py-2.5">
                  <span className="text-slate-500 dark:text-slate-400">
                    ID Transaksi
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-right break-all">
                    {referenceNumber.trim()}
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between gap-4 px-4 py-2.5">
                <span className="text-slate-500 dark:text-slate-400">
                  Tanggal
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {new Date(paymentDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isTransferLike
                ? "Pembayaran akan dikirim dan menunggu verifikasi admin sebelum dinyatakan lunas."
                : "Pembayaran akan langsung dicatat sebagai lunas."}
            </p>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
              >
                Batal
              </button>
              <button
                onClick={executeSubmit}
                disabled={isSubmitting || !isValid}
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-lg">
                  {isSubmitting ? "hourglass_empty" : "check_circle"}
                </span>
                {isSubmitting ? "Mengirim..." : "Ya, Bayar Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

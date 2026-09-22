"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import PayerInfo, { DriverRentalOption } from "@/components/finance/manual/payer-info";
import TransactionDetail, { RentalSelectOption } from "@/components/finance/manual/transaction-detail";
import { financeApi } from "@/lib/api/finances";
import { koinApi } from "@/lib/api/koin";
import { HttpClientError } from "@/lib/api-http";
import type { FinanceItem } from "@/lib/types/finances";
import { confirmToast, toastError, toastWarning } from "@/components/ui/toast-provider";

interface ManualPaymentPageProps {
  id: string | null;
}

const ManualPaymentPage = ({ id }: ManualPaymentPageProps) => {
  const router = useRouter();
  const paymentIdParam = id;

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [initialStatus, setInitialStatus] = useState<"paid" | "unpaid" | "pending">("paid");
  const [notes, setNotes] = useState("");
  const [paymentDetail, setPaymentDetail] = useState("");
  const [selectedPayer, setSelectedPayer] = useState<{name: string; id: string; employeeId?: string} | null>(null);
  const [payerRentals, setPayerRentals] = useState<RentalSelectOption[]>([]);
  const [selectedRentalId, setSelectedRentalId] = useState("");
  const [rentalFinanceCount, setRentalFinanceCount] = useState<number | null>(null);
  const [feeAdminJoin, setFeeAdminJoin] = useState(0);
  const [currentPaid, setCurrentPaid] = useState(0);
  const [currentRemaining, setCurrentRemaining] = useState(0);

  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [driverKoinBalance, setDriverKoinBalance] = useState<number>(0);

  useEffect(() => {
    if (paymentIdParam) {
      setMode("edit");
      setIsLoading(true);
      const fetchFinance = async () => {
        try {
          const response = await financeApi.getById(paymentIdParam);
          const item = ((response as any)?.data ?? (response as any)) as FinanceItem;
          if (!item?.payer) {
            throw new Error("Invalid response format");
          }
          setSelectedPayer({ name: item.payer, id: item.driver_id });
          setSearchValue(item.payer);
          setPaymentDate(item.payment_date);
          setReferenceNumber(item.reference_number);
          setPaymentMethod(item.payment_method);
          const fee = Number(item.fee_admin_join) || 0;
          setFeeAdminJoin(fee);
          setSelectedRentalId(item.rentals?.[0]?.id || "");
          setPayerRentals(
            (item.rentals || []).map((r) => ({
              id: r.id,
              label: r.vehicle
                ? `${r.vehicle.merk} ${r.vehicle.model}${r.vehicle.license_plate ? ` - ${r.vehicle.license_plate}` : ""}`
                : r.rental_number || r.id,
              category: undefined,
            })),
          );
          setAmount("");
          setNotes(item.notes || "");
          setCurrentPaid(item.paid_amount ?? item.amount_received ?? 0);
          setCurrentRemaining(item.remaining_amount ?? 0);
        } catch (err) {
          console.error("Failed to fetch finance:", err);
          setMode("add");
          toastError("Failed to load finance data for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchFinance();
    } else {
      setMode("add");
      setSearchValue("");
      setSelectedPayer(null);
      setPaymentDate("");
      setReferenceNumber("");
      setPaymentMethod("");
      setPaymentDetail("");
      setAmount("");
      setInitialStatus("paid");
      setNotes("");
      setPayerRentals([]);
      setSelectedRentalId("");
      setRentalFinanceCount(null);
      setFeeAdminJoin(0);
    }
  }, [paymentIdParam]);


  const selectedRental = payerRentals.find((r) => r.id === selectedRentalId) || null;
  const isThisRentalFirstFinanced = rentalFinanceCount === 0;
  const rentalCategory = (selectedRental?.category || "").toLowerCase();

  let adminFeePreview = 0;
  if (mode === "edit") {
    adminFeePreview = feeAdminJoin;
  } else if (
    selectedRental &&
    rentalCategory &&
    rentalFinanceCount !== null &&
    isThisRentalFirstFinanced
  ) {
    if (rentalCategory === "premium") adminFeePreview = 700000;
    else if (rentalCategory === "reguler" || rentalCategory === "regular") adminFeePreview = 500000;
  }

  const formattedCategory =
    rentalCategory === "premium"
      ? "Premium"
      : rentalCategory === "reguler" || rentalCategory === "regular"
        ? "Reguler"
        : selectedRental?.category || "";

  let adminFeeNote = "";
  if (mode === "edit") {
    adminFeeNote =
      feeAdminJoin > 0
        ? `Admin Fee (Join) Rp ${feeAdminJoin.toLocaleString("id-ID")} sudah termasuk dalam total tagihan.`
        : "Finance ini tidak memiliki admin fee.";
  } else if (!selectedPayer?.id) {
    adminFeeNote = "Pilih driver/payer terlebih dahulu untuk menghitung admin fee.";
  } else if (payerRentals.length === 0) {
    adminFeeNote = "Driver ini tidak memiliki rental/mobil. Admin fee tidak dapat dihitung.";
  } else if (!selectedRental) {
    adminFeeNote = "Pilih mobil untuk menghitung admin fee otomatis.";
  } else if (rentalFinanceCount === null) {
    adminFeeNote = "Menghitung admin fee...";
  } else if (!isThisRentalFirstFinanced) {
    adminFeeNote = `Mobil ini sudah pernah masuk ${rentalFinanceCount} finance sebelumnya. Admin fee tidak dikenakan lagi untuk mobil yang sama.`;
  } else if (adminFeePreview > 0) {
    adminFeeNote = `Mobil baru pertama kali dibiayai — Admin Fee (Join) ${formattedCategory}: Rp ${adminFeePreview.toLocaleString("id-ID")} akan ditambahkan ke total tagihan.`;
  } else {
    adminFeeNote = "Admin fee tidak dikenakan untuk mobil ini.";
  }

  const formatIDR = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

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
    setHasSubmitted(true);
    setServerErrors({});
    setGeneralError("");

    if (!selectedPayer?.id) {
      setIsSubmitting(false);
      toastWarning("Please select a valid payer/driver before submitting.");
      return;
    }

    setIsSubmitting(true);

    const parsedInitial = parseFloat(amount.replace(/[^\d.]/g, "")) || 0;

    try {
      const payload = {
        payment_date: paymentDate,
        reference_number: referenceNumber,
        payment_method: paymentMethod as FinanceItem["payment_method"],
        rental_ids: selectedRentalId ? [selectedRentalId] : undefined,
        amount_received: parsedInitial > 0 ? parsedInitial : undefined,
        notes,
        payer: selectedPayer?.name || "",
        driver_id: selectedPayer.id,
        finance_type: initialStatus,
      };

      if (mode === "edit" && paymentIdParam) {
        await financeApi.update(paymentIdParam, {
          payment_date: paymentDate,
          reference_number: referenceNumber,
          payment_method: paymentMethod as FinanceItem["payment_method"],
          rental_ids: selectedRentalId ? [selectedRentalId] : [],
          notes,
          payer: selectedPayer?.name || "",
          driver_id: selectedPayer.id,
        });

        if (parsedInitial > 0) {
          await financeApi.createPayment(paymentIdParam, {
            amount: parsedInitial,
            payment_method: paymentMethod as FinanceItem["payment_method"],
            payment_date: paymentDate,
            reference_number: referenceNumber,
            notes: notes || undefined,
          });
        }
      } else {
        await financeApi.create(payload);
      }

      const action = mode === "edit" ? "updated" : "registered";
      const ref = referenceNumber || "New Payment";

      router.push(`/dashboard/finances?success=${action}&ref=${encodeURIComponent(ref)}`);
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof HttpClientError) {
        if (err.errors && Object.keys(err.errors).length > 0) {
          setServerErrors(err.errors);
        }
        setGeneralError(err.message || "Failed to save payment. Please check your input and try again.");
      } else {
        setGeneralError("Failed to save payment. Please check your input and try again.");
      }
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/finances");
  };

  const handleClear = () => {
    setSearchValue("");
    setSelectedPayer(null);
    setPayerRentals([]);
    setSelectedRentalId("");
    setRentalFinanceCount(null);
    setFeeAdminJoin(0);
    setPaymentDate("");
    setReferenceNumber("");
    setPaymentMethod("");
    setPaymentDetail("");
    setAmount("");
    setInitialStatus("paid");
    setNotes("");
    setHasSubmitted(false);
    setServerErrors({});
    setGeneralError("");
  };

  const handlePayerSelect = (
    name: string,
    id: string,
    employeeId?: string,
    rentals?: DriverRentalOption[],
  ) => {
    setSelectedPayer({ name, id, employeeId });
    setSelectedRentalId("");
    if (mode === "add") {
      setPayerRentals(
        (rentals || []).map((r) => {
          const cat = (r.pricingCategory || "").toLowerCase();
          const category =
            cat === "premium"
              ? "Premium"
              : cat === "reguler" || cat === "regular"
                ? "Reguler"
                : undefined;
          return {
            id: r.id,
            label: `${r.carName}${r.plate ? ` - ${r.plate}` : ""}`,
            category,
            dailyRate: r.dailyRate,
            totalDuration: r.totalDuration,
          };
        }),
      );
      setRentalFinanceCount(null);
    }
  };

  useEffect(() => {
    if (mode === "add" && selectedRentalId) {
      financeApi
        .getList({ rental_id: selectedRentalId, limit: 1 })
        .then((res) => setRentalFinanceCount(res.meta?.total ?? 0))
        .catch(() => setRentalFinanceCount(null));
    } else {
      setRentalFinanceCount(null);
    }
  }, [mode, selectedRentalId]);


  useEffect(() => {
    if (selectedPayer?.id) {
      koinApi.getBalance(selectedPayer.id)
        .then((res: any) => {
          setDriverKoinBalance(res?.data?.balance ?? 0);
        })
        .catch(() => {
          setDriverKoinBalance(0);
        });
    } else {
      setDriverKoinBalance(0);
    }
  }, [selectedPayer?.id]);

  const validateAll = (): boolean => {
    if (!selectedPayer) return false;
    if (!paymentDate) return false;
    if (!referenceNumber?.trim() || !/^[a-zA-Z0-9\/\-_]+$/.test(referenceNumber) || referenceNumber.length < 3) return false;
    if (!paymentMethod) return false;
    if (!amount || parseFloat(amount) <= 0) return false;
    return true;
  };


  if (isLoading) {
    return (
      <div className="m-8 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <PermissionGuard permission="finance.create">
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {mode === "add" ? "Tambah Pembayaran Baru" : "Edit Pembayaran"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mode === "add" ? "Lengkapi form di bawah untuk membuat pembayaran" : "Perbarui informasi pembayaran"}
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {generalError && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{generalError}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          <PayerInfo
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onPayerSelect={handlePayerSelect}
            selectedPayerId={selectedPayer?.id}
            hasSubmitted={hasSubmitted}
            serverError={serverErrors["driver_id"]?.[0]}
          />
          <TransactionDetail
            paymentDate={paymentDate}
            referenceNumber={referenceNumber}
            paymentMethod={paymentMethod}
            amount={amount}
            initialStatus={initialStatus}
            notes={notes}
            rentals={payerRentals}
            selectedRentalId={selectedRentalId}
            onRentalSelectChange={setSelectedRentalId}
            adminFeePreview={adminFeePreview}
            adminFeeNote={adminFeeNote}
            mode={mode}
            onPaymentDateChange={setPaymentDate}
            onReferenceNumberChange={setReferenceNumber}
            onPaymentMethodChange={setPaymentMethod}
            onPaymentDetailChange={handlePaymentDetailChange}
            onAmountChange={setAmount}
            onInitialStatusChange={setInitialStatus}
            onNotesChange={setNotes}
            hasSubmitted={hasSubmitted}
            serverErrors={serverErrors}
          />

{/* Info Koin */}
          {selectedPayer?.id && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-500 text-xl">account_balance_wallet</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    Informasi Koin Driver
                  </h3>
                  <p className="text-xs text-slate-400">Koin driver saat ini</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex gap-3 items-start">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg mt-0.5">
                  info
                </span>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-normal">
                  Koin driver saat ini:{" "}
                  <span
                    className={`font-bold ${
                      driverKoinBalance < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(driverKoinBalance)}
                  </span>
                  . Pembayaran tunai/transfer/e-wallet hanya mengurangi tagihan dan tidak mempengaruhi koin driver. Metode Koin Driver akan mengurangi koin driver.
                </p>
              </div>
            </div>
          )}

          {/* Ringkasan Tagihan (edit mode) */}
          {mode === "edit" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500 text-xl">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    Ringkasan Tagihan
                  </h3>
                  <p className="text-xs text-slate-400">Status tagihan saat ini</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Tagihan</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {formatIDR(currentPaid + currentRemaining)}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Sudah Dibayar</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(currentPaid)}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4">
                  <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Sisa Tagihan</p>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(currentRemaining)}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Admin Fee (Join):</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatIDR(adminFeePreview)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={handleClear}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Reset Form
            </button>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                {isSubmitting ? "hourglass_empty" : "check_circle"}
              </span>
              {isSubmitting ? "Menyimpan..." : mode === "add" ? "Simpan Pembayaran" : "Update Pembayaran"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </PermissionGuard>
  );
};

export default ManualPaymentPage;

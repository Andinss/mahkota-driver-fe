"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import PayerInfo from "@/components/finance/manual/payer-info";
import Summary from "@/components/finance/manual/summary";
import TransactionDetail from "@/components/finance/manual/transaction-detail";
import { financeApi } from "@/lib/api/finances";
import { saldoApi } from "@/lib/api/saldo";
import { HttpClientError } from "@/lib/api-http";
import type { FinanceItem } from "@/lib/types/finances";

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
  const [depositAmount, setDepositAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentDetail, setPaymentDetail] = useState("");
  const [selectedPayer, setSelectedPayer] = useState<{name: string; id: string; employeeId?: string} | null>(null);

  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [driverSaldoBalance, setDriverSaldoBalance] = useState<number>(0);

  useEffect(() => {
    if (paymentIdParam) {
      setMode("edit");
      setIsLoading(true);
      const fetchFinance = async () => {
        try {
          const response = await financeApi.getById(paymentIdParam);
          const item = (response as any)?.data ?? (response as any);
          if (!item?.payer) {
            throw new Error("Invalid response format");
          }
          setSelectedPayer({ name: item.payer, id: item.driver_id });
          setSearchValue(item.payer);
          setPaymentDate(item.payment_date);
          setReferenceNumber(item.reference_number);
          setPaymentMethod(item.payment_method);
          setAmount(String(item.amount_received));
          setDepositAmount(item.deposit_amount ? String(item.deposit_amount) : "");
          setNotes(item.notes || "");
        } catch (err) {
          console.error("Failed to fetch finance:", err);
          setMode("add");
          alert("Failed to load finance data for editing.");
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
      setDepositAmount("");
      setNotes("");
    }
  }, [paymentIdParam]);

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
      alert("Please select a valid payer/driver before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        payment_date: paymentDate,
        reference_number: referenceNumber,
        payment_method: paymentMethod as FinanceItem["payment_method"],
        amount_received: parseFloat(amount.replace(/[^\d.]/g, "")) || 0,
        deposit_amount: parseFloat(depositAmount.replace(/[^\d.]/g, "")) || 0,
        notes,
        payer: selectedPayer?.name || "",
        driver_id: selectedPayer.id,
      };

      if (mode === "edit" && paymentIdParam) {
        await financeApi.update(paymentIdParam, payload);
      } else {
        await financeApi.create(payload);
      }

      const action = mode === "edit" ? "updated" : "registered";
      const ref = referenceNumber || "New Payment";

      router.push(`/dashboard/finance?success=${action}&ref=${encodeURIComponent(ref)}`);
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
    router.push("/dashboard/finance");
  };

  const handleClear = () => {
    setSearchValue("");
    setSelectedPayer(null);
    setPaymentDate("");
    setReferenceNumber("");
    setPaymentMethod("");
    setPaymentDetail("");
    setAmount("");
    setDepositAmount("");
    setNotes("");
    setHasSubmitted(false);
    setServerErrors({});
    setGeneralError("");
  };

  const handlePayerSelect = (name: string, id: string, employeeId?: string) => {
    setSelectedPayer({ name, id, employeeId });
  };

  useEffect(() => {
    if (selectedPayer?.id) {
      saldoApi.getBalance(selectedPayer.id)
        .then((res: any) => {
          setDriverSaldoBalance(res?.data?.balance ?? 0);
        })
        .catch(() => {
          setDriverSaldoBalance(0);
        });
    } else {
      setDriverSaldoBalance(0);
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
    <div className="m-8">
      {generalError && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2.5">
          <div className="size-6 rounded-full bg-red-100 dark:bg-red-800/40 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-500 text-sm">error</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{generalError}</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
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
            depositAmount={depositAmount}
            notes={notes}
            onPaymentDateChange={setPaymentDate}
            onReferenceNumberChange={setReferenceNumber}
            onPaymentMethodChange={setPaymentMethod}
            onPaymentDetailChange={handlePaymentDetailChange}
            onAmountChange={setAmount}
            onDepositAmountChange={setDepositAmount}
            onNotesChange={setNotes}
            hasSubmitted={hasSubmitted}
            serverErrors={serverErrors}
          />
        </div>
        <Summary
          payerName={selectedPayer?.name || ""}
          payerId={selectedPayer?.employeeId || selectedPayer?.id || ""}
          paymentDate={paymentDate}
          paymentMethod={paymentMethod}
          amount={amount}
          currentBalance={driverSaldoBalance}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onClear={handleClear}
          isSubmitting={isSubmitting}
          mode={mode}
          onValidate={validateAll}
          setHasSubmitted={setHasSubmitted}
        />
      </div>
    </div>
    </PermissionGuard>
  );
};

export default ManualPaymentPage;

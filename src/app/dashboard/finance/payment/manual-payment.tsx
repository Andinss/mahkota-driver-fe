"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PayerInfo from "@/components/finance/manual/payer-info";
import Summary from "@/components/finance/manual/summary";
import TransactionDetail from "@/components/finance/manual/transaction-detail";
import { financeApi } from "@/lib/api/finances";
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
  const [notes, setNotes] = useState("");
  const [paymentDetail, setPaymentDetail] = useState("");
  const [selectedPayer, setSelectedPayer] = useState<{name: string; id: string} | null>(null);

  useEffect(() => {
    if (paymentIdParam) {
      setMode("edit");
      setIsLoading(true);
      const fetchFinance = async () => {
        try {
          const response = await financeApi.getById(paymentIdParam);
          const item = (response?.data ?? response) as unknown as FinanceItem;
          if (!item?.payer) {
            throw new Error("Invalid response format");
          }
          setSelectedPayer({ name: item.payer, id: item.id });
          setSearchValue(item.payer);
          setPaymentDate(item.payment_date);
          setReferenceNumber(item.reference_number);
          setPaymentMethod(item.payment_method);
          setAmount(item.amount_received);
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
    setIsSubmitting(true);

    try {
      const payload = {
        payment_date: paymentDate,
        reference_number: referenceNumber,
        payment_method: paymentMethod as FinanceItem["payment_method"],
        amount_received: amount,
        notes,
        payer: selectedPayer?.name || "",
      };

      if (mode === "edit" && paymentIdParam) {
        await financeApi.update(paymentIdParam, payload);
      } else {
        await financeApi.create(payload);
      }

      const action = mode === "edit" ? "updated" : "registered";
      const ref = referenceNumber || "New Payment";

      router.push(`/dashboard/finance?success=${action}&ref=${encodeURIComponent(ref)}`);
    } catch {
      setIsSubmitting(false);
      alert("Failed to save payment. Please check your input and try again.");
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
    setNotes("");
    setHasSubmitted(false);
  };

  const handlePayerSelect = (name: string, id: string) => {
    setSelectedPayer({ name, id });
  };

  const validateAll = (): boolean => {
    if (!selectedPayer) return false;
    if (!paymentDate) return false;
    if (!referenceNumber?.trim() || referenceNumber.length < 3) return false;
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
    <div className="m-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PayerInfo
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onPayerSelect={handlePayerSelect}
            selectedPayerId={selectedPayer?.id}
            hasSubmitted={hasSubmitted}
          />
          <TransactionDetail
            paymentDate={paymentDate}
            referenceNumber={referenceNumber}
            paymentMethod={paymentMethod}
            amount={amount}
            notes={notes}
            onPaymentDateChange={setPaymentDate}
            onReferenceNumberChange={setReferenceNumber}
            onPaymentMethodChange={setPaymentMethod}
            onPaymentDetailChange={handlePaymentDetailChange}
            onAmountChange={setAmount}
            onNotesChange={setNotes}
            hasSubmitted={hasSubmitted}
          />
        </div>
        <Summary
          payerName={selectedPayer?.name || ""}
          payerId={selectedPayer?.id || ""}
          paymentDate={paymentDate}
          paymentMethod={paymentMethod}
          amount={amount}
          currentBalance={-3500000}
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
  );
};

export default ManualPaymentPage;

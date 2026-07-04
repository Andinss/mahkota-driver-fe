"use client";
import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface SummaryProps {
  payerName?: string;
  payerId?: string;
  paymentDate?: string;
  paymentMethod?: string;
  amount?: string;
  currentBalance?: number;
  onSubmit?: () => void;
  onCancel?: () => void;
  onClear?: () => void;
  isSubmitting?: boolean;
  mode?: "add" | "edit";
  onValidate?: () => boolean;
  setHasSubmitted?: (value: boolean) => void;
}

const methodIcon: Record<string, string> = {
  cash: "payments",
  transfer: "account_balance",
  "e-wallet": "account_balance_wallet",
};

const formatCurrency = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value.replace(/[^\d.]/g, "")) : value;
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Summary = ({
  payerName = "John Doe",
  payerId = "DRV-8821",
  paymentDate = "",
  paymentMethod = "",
  amount = "",
  currentBalance = -200,
  onSubmit,
  onCancel,
  onClear,
  isSubmitting = false,
  mode = "add",
  onValidate,
  setHasSubmitted,
}: SummaryProps) => {

   const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const parsedAmount = typeof amount === "string" ? (parseFloat(amount.replace(/[^\d.]/g, "")) || 0) : (amount || 0);
  const newBalance = currentBalance + parsedAmount;

  const buttonText = isSubmitting
    ? "Processing..."
    : mode === "add"
    ? "Confirm & Post Payment"
    : "Update Payment";

    const handleConfirmSubmit = () => {
    setIsConfirmOpen(false);
    onSubmit?.();
  };

  return (
    <div className="lg:col-span-1 flex flex-col gap-6">
      <div className="bg-white dark:bg-[#1e2732] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden sticky top-6">
        <div className="p-6 bg-[#f8fafc] dark:bg-[#17202a] border-b border-[#e5e7eb] dark:border-gray-800">
          <h3 className="text-base font-semibold text-[#111418] dark:text-white">
            Review Summary
          </h3>
          <p className="text-sm text-[#617589] dark:text-gray-400 mt-1">
            Please verify details before posting.
          </p>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-sm text-[#617589] dark:text-gray-400">
              Payer
            </span>
            <span className="text-sm font-medium text-[#111418] dark:text-white text-right">
              {payerName}
              <br />
              <span className="text-xs text-gray-500 font-normal">{payerId}</span>
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-sm text-[#617589] dark:text-gray-400">Date</span>
            <span className="text-sm font-medium text-[#111418] dark:text-white">
              {formatDate(paymentDate)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-sm text-[#617589] dark:text-gray-400">Method</span>
            <div className="flex items-center gap-1.5">
              {paymentMethod && (
                <Icon
                  name={methodIcon[paymentMethod] || "payments"}
                  size="sm"
                  className="text-[#617589]"
                />
              )}
              <span className="text-sm font-medium text-[#111418] dark:text-white capitalize">
                {paymentMethod || "-"}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-[#617589] dark:text-gray-400">
              Total Amount
            </span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(amount)}
            </span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex gap-3 items-start mt-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg mt-0.5">
              info
            </span>
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-normal">
              This payment will reduce the driver&apos;s outstanding balance to{" "}
              <span
                className={`font-bold ${
                  newBalance < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {formatCurrency(newBalance.toString())}
              </span>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
             <button 
              onClick={() => {
                if (onValidate && !onValidate()) {
                  setHasSubmitted?.(true);
                  return;
                }
                setIsConfirmOpen(true);
              }}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-blue-600 text-white rounded-lg h-12 font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">
                {mode === "add" ? "check" : "save"}
              </span>
              {buttonText}
            </button>
            <button 
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex items-center justify-center w-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-[#617589] dark:text-gray-300 rounded-lg h-10 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={onClear}
              disabled={isSubmitting}
              className="flex items-center justify-center w-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-[#617589] dark:text-gray-300 rounded-lg h-10 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e2732] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 p-6 hidden lg:block">
        <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-4 uppercase tracking-wider">
          Recent Transactions
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="mt-1 flex-shrink-0 size-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-[#111418] dark:text-white">
                  Payment Received
                </p>
                <span className="text-xs text-[#617589] dark:text-gray-400">Oct 10</span>
              </div>
              <p className="text-xs text-[#617589] dark:text-gray-400 mt-0.5">
                Cash • Ref: 9921
              </p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                    +Rp 50.000
                  </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-1 flex-shrink-0 size-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-[#111418] dark:text-white">
                  Weekly Rental Fee
                </p>
                <span className="text-xs text-[#617589] dark:text-gray-400">Oct 08</span>
              </div>
              <p className="text-xs text-[#617589] dark:text-gray-400 mt-0.5">
                System Auto-debit
              </p>
                <p className="text-sm font-bold text-[#111418] dark:text-white mt-1">
                  -Rp 250.000
                </p>
            </div>
          </div>
        </div>
      </div>

       {/* CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        title={mode === "add" ? "Confirm Payment" : "Confirm Update"}
        message={
    mode === "add"
      ? `Are you sure you want to post this payment for ${payerName} (${payerId})? Total amount: ${formatCurrency(amount)}. This action cannot be undone.`
      : `Are you sure you want to update this payment for ${payerName} (${payerId})? Total amount: ${formatCurrency(amount)}?`
  }
  confirmText={mode === "add" ? "Yes, Post Payment" : "Yes, Update Payment"}
  cancelText="Review Again"
  variant="info"
      />
    </div>
  );
};

export default Summary;

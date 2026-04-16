import { Input } from "@/components/ui/input";
import { RadioCard } from "@/components/ui/radio-card";
import { Textarea } from "@/components/ui/textarea";

interface TransactionDetailProps {
  paymentDate?: string;
  referenceNumber?: string;
  paymentMethod?: string;
  amount?: string;
  notes?: string;
  onPaymentDateChange?: (value: string) => void;
  onReferenceNumberChange?: (value: string) => void;
  onPaymentMethodChange?: (value: string) => void;
  onAmountChange?: (value: string) => void;
  onNotesChange?: (value: string) => void;
}

const TransactionDetail = ({
  paymentDate = "",
  referenceNumber = "",
  paymentMethod = "",
  amount = "",
  notes = "",
  onPaymentDateChange,
  onReferenceNumberChange,
  onPaymentMethodChange,
  onAmountChange,
  onNotesChange,
}: TransactionDetailProps) => {
  return (
    <div className="bg-white dark:bg-[#1e2732] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 p-6">
      <h3 className="text-base font-semibold text-[#111418] dark:text-white mb-6">
        Transaction Details
      </h3>
      <form className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#111418] dark:text-gray-200">
              Payment Date
            </label>
            <div className="relative">
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => onPaymentDateChange?.(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#111418] dark:text-gray-200">
              Reference Number
            </label>
            <Input
              type="text"
              value={referenceNumber}
              onChange={(e) => onReferenceNumberChange?.(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-[#111418] dark:text-gray-200">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            <RadioCard
              icon="payments"
              label="Cash"
              name="payment_method"
              value="Cash"
              checked={paymentMethod === "Cash"}
              onChange={() => onPaymentMethodChange?.("Cash")}
            />
            <RadioCard
              icon="account_balance"
              label="Transfer"
              name="payment_method"
              value="Transfer"
              checked={paymentMethod === "Transfer"}
              onChange={() => onPaymentMethodChange?.("Transfer")}
            />
            <RadioCard
              icon="account_balance_wallet"
              label="E-Wallet"
              name="payment_method"
              value="E-Wallet"
              checked={paymentMethod === "E-Wallet"}
              onChange={() => onPaymentMethodChange?.("E-Wallet")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#111418] dark:text-gray-200">
            Amount Received
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Rp
              </span>
            </div>
            <Input
              className="w-full h-10 pl-10 pr-4 rounded-lg border-[#d1d5db] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-3xl font-bold tracking-tight focus:ring-primary focus:border-primary placeholder:text-gray-300 dark:placeholder:text-gray-600"
              placeholder="0.00"
              type="text"
              value={amount}
              onChange={(e) => onAmountChange?.(e.target.value)}
            />
          </div>
          <p className="text-xs text-[#617589] dark:text-gray-400">
            Enter amount in IDR. Ensure currency is correct before submitting.
          </p>
        </div>

        <Textarea
          label="Notes (Optional)"
          placeholder="Add any remarks about this payment..."
          value={notes}
          onChange={(e) => onNotesChange?.(e.target.value)}
          rows={2}
        />
      </form>
    </div>
  );
};

export default TransactionDetail;

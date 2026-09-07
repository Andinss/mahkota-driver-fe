import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { RadioCard } from "@/components/ui/radio-card";
import { Icon } from "@/components/ui/icon";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { CurrencyInput } from "@/components/ui/currency-input";

interface FormErrors {
  paymentDate?: string;
  referenceNumber?: string;
  paymentMethod?: string;
  amount?: string;
  depositAmount?: string;
}

interface TransactionDetailProps {
  paymentDate?: string;
  referenceNumber?: string;
  paymentMethod?: string;
  amount?: string;
  depositAmount?: string;
  notes?: string;
  onPaymentDateChange?: (value: string) => void;
  onReferenceNumberChange?: (value: string) => void;
  onPaymentMethodChange?: (value: string) => void;
  onPaymentDetailChange?: (detail: string) => void;
  onAmountChange?: (value: string) => void;
  onDepositAmountChange?: (value: string) => void;
  onNotesChange?: (value: string) => void;
  hasSubmitted?: boolean;
  serverErrors?: Record<string, string[]>;
}

const TransactionDetail = ({
  paymentDate = "",
  referenceNumber = "",
  paymentMethod = "",
  amount = "",
  depositAmount = "",
  notes = "",
  onPaymentDateChange,
  onReferenceNumberChange,
  onPaymentMethodChange,
  onPaymentDetailChange,
  onAmountChange,
  onDepositAmountChange,
  onNotesChange,
  hasSubmitted = false,
  serverErrors = {},
}: TransactionDetailProps) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEwalletModal, setShowEwalletModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (hasSubmitted) {
      const newErrors: FormErrors = {};

      if (!paymentDate) {
        newErrors.paymentDate = "Payment date is required";
      }

      if (!referenceNumber?.trim()) {
        newErrors.referenceNumber = "Reference number is required";
      } else if (!/^[a-zA-Z0-9\/\-_]+$/.test(referenceNumber)) {
        newErrors.referenceNumber =
          "Reference number can only contain letters, numbers, hyphens, slashes, and underscores";
      } else if (referenceNumber.length < 3) {
        newErrors.referenceNumber =
          "Reference number must be at least 3 characters";
      }

      if (!paymentMethod) {
        newErrors.paymentMethod = "Please select a payment method";
      }

      if (!amount) {
        newErrors.amount = "Amount is required";
      } else if (parseFloat(amount) <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      }

      if (serverErrors["payment_date"]?.[0]) {
        newErrors.paymentDate = serverErrors["payment_date"][0];
      }
      if (serverErrors["reference_number"]?.[0]) {
        newErrors.referenceNumber = serverErrors["reference_number"][0];
      }
      if (serverErrors["payment_method"]?.[0]) {
        newErrors.paymentMethod = serverErrors["payment_method"][0];
      }
      if (serverErrors["amount_received"]?.[0]) {
        newErrors.amount = serverErrors["amount_received"][0];
      }
      if (serverErrors["deposit_amount"]?.[0]) {
        newErrors.depositAmount = serverErrors["deposit_amount"][0];
      }

      setErrors(newErrors);
    }
  }, [hasSubmitted, paymentDate, referenceNumber, paymentMethod, amount, depositAmount, serverErrors]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    }

    if (!referenceNumber?.trim()) {
      newErrors.referenceNumber = "Reference number is required";
    } else if (!/^[a-zA-Z0-9\/\-_]+$/.test(referenceNumber)) {
      newErrors.referenceNumber =
        "Reference number can only contain letters, numbers, hyphens, slashes, and underscores";
    } else if (referenceNumber.length < 3) {
      newErrors.referenceNumber =
        "Reference number must be at least 3 characters";
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmountChange = (value: string) => {
    onAmountChange?.(value);
    if (errors.amount && value) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleDepositAmountChange = (value: string) => {
    onDepositAmountChange?.(value);
    if (errors.depositAmount && value) {
      setErrors((prev) => ({ ...prev, depositAmount: undefined }));
    }
  };

  const handlePaymentDateChange = (value: string) => {
    onPaymentDateChange?.(value);
    if (errors.paymentDate && value) {
      setErrors((prev) => ({ ...prev, paymentDate: undefined }));
    }
  };

  const handleReferenceNumberChange = (value: string) => {
    const sanitized = value.replace(/[^a-zA-Z0-9\/\-_]/g, "");
    onReferenceNumberChange?.(sanitized);
    if (errors.referenceNumber && sanitized) {
      setErrors((prev) => ({ ...prev, referenceNumber: undefined }));
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    onPaymentMethodChange?.(value);
    if (errors.paymentMethod && value) {
      setErrors((prev) => ({ ...prev, paymentMethod: undefined }));
    }
  };

  const banks = [
    {
      name: "BCA",
      logo: "https://www.bca.co.id/-/media/Feature/Card/List-Card/Tentang-BCA/Brand-Assets/Logo-BCA/Logo-BCA_Biru.png",
    },
    {
      name: "Mandiri",
      logo: "https://wp.logos-download.com/wp-content/uploads/2016/06/Mandiri_logo-700x220.png",
    },
    {
      name: "BNI",
      logo: "https://iconlogovector.com/uploads/images/2023/04/lg-19ba1de69f8fd8354b05a023cd71ff8572.jpg",
    },
    {
      name: "BRI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/BANK_BRI_logo_%28vertical%29.svg/960px-BANK_BRI_logo_%28vertical%29.svg.png",
    },
    {
      name: "CIMB Niaga",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/CIMB_Niaga_logo.svg/960px-CIMB_Niaga_logo.svg.png",
    },
    {
      name: "Danamon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Danamon.svg/960px-Danamon.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20200318085308",
    },
    {
      name: "Permata",
      logo: "https://upload.wikimedia.org/wikipedia/id/thumb/4/48/PermataBank_logo.svg/330px-PermataBank_logo.svg.png?_=20161021185145",
    },
    {
      name: "BSI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Syariah_Indonesia.svg/960px-Bank_Syariah_Indonesia.svg.png",
    },
  ];

  const ewallets = [
    {
      name: "GoPay",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Logo_Gopay.svg/960px-Logo_Gopay.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20240815061050",
    },
    {
      name: "OVO",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/960px-Logo_ovo_purple.svg.png",
    },
    {
      name: "DANA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/960px-Logo_dana_blue.svg.png",
    },

    {
      name: "QRIS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/QRIS_Logo.svg/960px-QRIS_Logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20250310160237",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1e2732] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 p-6">
      <h3 className="text-base font-semibold text-[#111418] dark:text-white mb-6">
        Transaction Details
      </h3>
      <form ref={formRef} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#111418] dark:text-gray-200">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => handlePaymentDateChange(e.target.value)}
                error={errors.paymentDate}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#111418] dark:text-gray-200">
              Reference Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={referenceNumber}
              onChange={(e) => handleReferenceNumberChange(e.target.value)}
              error={errors.referenceNumber}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-[#111418] dark:text-gray-200">
            Payment Method <span className="text-red-500">*</span>
          </label>
          {errors.paymentMethod && (
            <p className="text-xs text-red-500">{errors.paymentMethod}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <RadioCard
                icon="payments"
                label="Cash"
                name="payment_method"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => {
                  onPaymentMethodChange?.("cash");
                  onPaymentDetailChange?.("");
                }}
              />
            <button
              type="button"
              onClick={() => setShowTransferModal(true)}
              className="cursor-pointer relative group"
            >
              <div
                className={`flex flex-col items-center justify-center p-3 rounded-lg border h-24 transition-all hover:border-gray-400 dark:hover:border-gray-500 ${
                  paymentMethod === "transfer"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-[#d1d5db] dark:border-gray-600 bg-white dark:bg-gray-800"
                }`}
              >
                <Icon
                  name="account_balance"
                  size="lg"
                  className={`mb-2 ${paymentMethod === "transfer" ? "text-primary" : "text-[#617589] dark:text-gray-400"}`}
                />
                <span
                  className={`text-sm font-medium ${
                    paymentMethod === "transfer"
                      ? "text-primary"
                      : "text-[#111418] dark:text-gray-200"
                  }`}
                >
                  Transfer
                </span>
              </div>
              {paymentMethod === "transfer" && (
                  <div className="absolute top-2 right-2 text-primary">
                    <Icon name="check_circle" size="md" />
                  </div>
                )}
            </button>
            <button
              type="button"
              onClick={() => setShowEwalletModal(true)}
              className="cursor-pointer relative group"
            >
              <div
                className={`flex flex-col items-center justify-center p-3 rounded-lg border h-24 transition-all hover:border-gray-400 dark:hover:border-gray-500 ${
                  paymentMethod === "e-wallet"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-[#d1d5db] dark:border-gray-600 bg-white dark:bg-gray-800"
                }`}
              >
                <Icon
                  name="account_balance_wallet"
                  size="lg"
                  className={`mb-2 ${paymentMethod === "e-wallet" ? "text-primary" : "text-[#617589] dark:text-gray-400"}`}
                />
                <span
                  className={`text-sm font-medium ${
                    paymentMethod === "e-wallet"
                      ? "text-primary"
                      : "text-[#111418] dark:text-gray-200"
                  }`}
                >
                  E-Wallet
                </span>
              </div>
              {paymentMethod === "e-wallet" && (
                <div className="absolute top-2 right-2 text-primary">
                  <Icon name="check_circle" size="md" />
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                onPaymentMethodChange?.("saldo");
                onPaymentDetailChange?.("");
              }}
              className="cursor-pointer relative group"
            >
              <div
                className={`flex flex-col items-center justify-center p-3 rounded-lg border h-24 transition-all hover:border-gray-400 dark:hover:border-gray-500 ${
                  paymentMethod === "saldo"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-[#d1d5db] dark:border-gray-600 bg-white dark:bg-gray-800"
                }`}
              >
                <Icon
                  name="account_balance_wallet"
                  size="lg"
                  className={`mb-2 ${paymentMethod === "saldo" ? "text-primary" : "text-[#617589] dark:text-gray-400"}`}
                />
                <span
                  className={`text-sm font-medium ${
                    paymentMethod === "saldo"
                      ? "text-primary"
                      : "text-[#111418] dark:text-gray-200"
                  }`}
                >
                  Saldo Driver
                </span>
              </div>
              {paymentMethod === "saldo" && (
                <div className="absolute top-2 right-2 text-primary">
                  <Icon name="check_circle" size="md" />
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#111418] dark:text-gray-200">
            Amount Received <span className="text-red-500">*</span>
          </label>
          <CurrencyInput
            placeholder="0"
            value={amount}
            onChange={(value) => handleAmountChange(value)}
            error={errors.amount}
          />
          <p className="text-xs text-[#617589] dark:text-gray-400">
            Enter amount in IDR. Ensure currency is correct before submitting.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#111418] dark:text-gray-200">
            Deposit Amount <span className="text-xs font-normal text-[#617589] dark:text-gray-400">(Optional)</span>
          </label>
          <CurrencyInput
            placeholder="0"
            value={depositAmount}
            onChange={(value) => handleDepositAmountChange(value)}
            error={errors.depositAmount}
          />
          <p className="text-xs text-[#617589] dark:text-gray-400">
            Enter the deposit amount paid (e.g. DP for rental) in IDR.
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

      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Select Bank"
      >
        <div className="p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {banks.map((bank) => (
              <button
                key={bank.name}
                type="button"
                onClick={() => {
                  onPaymentMethodChange?.("transfer");
                  onPaymentDetailChange?.(bank.name);
                  setShowTransferModal(false);
                }}
                className="group flex items-center justify-center p-4 rounded-xl border-2 border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-20 h-20 flex items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-700 group-hover:bg-primary/5 transition-colors">
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEwalletModal}
        onClose={() => setShowEwalletModal(false)}
        title="Select E-Wallet"
      >
        <div className="p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {ewallets.map((wallet) => (
              <button
                key={wallet.name}
                type="button"
                onClick={() => {
                  onPaymentMethodChange?.("e-wallet");
                  onPaymentDetailChange?.(wallet.name);
                  setShowEwalletModal(false);
                }}
                className="group flex items-center justify-center p-4 rounded-xl border-2 border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-20 h-20 flex items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-700 group-hover:bg-primary/5 transition-colors">
                  <img
                    src={wallet.logo}
                    alt={wallet.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionDetail;

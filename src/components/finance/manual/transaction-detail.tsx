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
  totalAmount?: string;
  amount?: string;
  depositAmount?: string;
}

interface TransactionDetailProps {
  paymentDate?: string;
  referenceNumber?: string;
  paymentMethod?: string;
  totalAmount?: string;
  amount?: string;
  depositAmount?: string;
  initialStatus?: "paid" | "unpaid" | "pending";
  notes?: string;
  paymentTerms?: number;
  feeAdminJoin?: string;
  mode?: "add" | "edit";
  onPaymentDateChange?: (value: string) => void;
  onReferenceNumberChange?: (value: string) => void;
  onPaymentMethodChange?: (value: string) => void;
  onPaymentDetailChange?: (detail: string) => void;
  onTotalAmountChange?: (value: string) => void;
  onAmountChange?: (value: string) => void;
  onDepositAmountChange?: (value: string) => void;
  onInitialStatusChange?: (value: "paid" | "unpaid" | "pending") => void;
  onNotesChange?: (value: string) => void;
  onPaymentTermsChange?: (value: number) => void;
  onFeeAdminJoinChange?: (value: string) => void;
  hasSubmitted?: boolean;
  serverErrors?: Record<string, string[]>;
}

const TransactionDetail = ({
  paymentDate = "",
  referenceNumber = "",
  paymentMethod = "",
  totalAmount = "",
  amount = "",
  depositAmount = "",
  initialStatus = "paid",
  notes = "",
  paymentTerms = 1,
  feeAdminJoin = "",
  mode = "add",
  onPaymentDateChange,
  onReferenceNumberChange,
  onPaymentMethodChange,
  onPaymentDetailChange,
  onTotalAmountChange,
  onAmountChange,
  onDepositAmountChange,
  onInitialStatusChange,
  onNotesChange,
  onPaymentTermsChange,
  onFeeAdminJoinChange,
  hasSubmitted = false,
  serverErrors = {},
}: TransactionDetailProps) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEwalletModal, setShowEwalletModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusNote, setStatusNote] = useState<"auto-paid" | "unpaid-warning" | null>(null);
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

      if (!totalAmount) {
        newErrors.totalAmount = "Total tagihan is required";
      } else if (parseFloat(totalAmount) <= 0) {
        newErrors.totalAmount = "Total tagihan must be greater than 0";
      } else if (amount && parseFloat(amount) > parseFloat(totalAmount)) {
        newErrors.amount = "Initial payment cannot exceed total tagihan";
      }

      if (mode === "add") {
        if (!amount) {
          newErrors.amount = "Amount is required";
        } else if (parseFloat(amount) <= 0) {
          newErrors.amount = "Amount must be greater than 0";
        }
      } else if (amount && parseFloat(amount) > parseFloat(totalAmount)) {
        newErrors.amount = "Pembayaran tidak boleh melebihi total tagihan";
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
      if (serverErrors["total_amount"]?.[0]) {
        newErrors.totalAmount = serverErrors["total_amount"][0];
      }
      if (serverErrors["amount_received"]?.[0]) {
        newErrors.amount = serverErrors["amount_received"][0];
      }
      if (serverErrors["deposit_amount"]?.[0]) {
        newErrors.depositAmount = serverErrors["deposit_amount"][0];
      }

      setErrors(newErrors);
    }
  }, [hasSubmitted, paymentDate, referenceNumber, paymentMethod, totalAmount, amount, depositAmount, serverErrors, mode]);

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

    if (!totalAmount) {
      newErrors.totalAmount = "Total tagihan is required";
    } else if (parseFloat(totalAmount) <= 0) {
      newErrors.totalAmount = "Total tagihan must be greater than 0";
    } else if (amount && parseFloat(amount) > parseFloat(totalAmount)) {
      newErrors.amount = "Initial payment cannot exceed total tagihan";
    }

    if (mode === "add") {
      if (!amount) {
        newErrors.amount = "Amount is required";
      } else if (parseFloat(amount) <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      }
    } else if (amount && parseFloat(amount) > parseFloat(totalAmount)) {
      newErrors.amount = "Pembayaran tidak boleh melebihi total tagihan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmountChange = (value: string) => {
    onAmountChange?.(value);
    if (errors.amount && value) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
    const num = parseFloat(value.replace(/[^\d.]/g, "")) || 0;
    if (num > 0 && initialStatus === "unpaid") {
      onInitialStatusChange?.("paid");
      setStatusNote("auto-paid");
    } else if (num === 0 && statusNote === "auto-paid") {
      setStatusNote(null);
    }
  };

  const handleTotalAmountChange = (value: string) => {
    onTotalAmountChange?.(value);
    if (errors.totalAmount && value) {
      setErrors((prev) => ({ ...prev, totalAmount: undefined }));
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-emerald-500 text-xl">receipt_long</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Detail Transaksi
          </h3>
          <p className="text-xs text-slate-400">Isi informasi pembayaran</p>
        </div>
      </div>
      <form ref={formRef} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-slate-400 text-base">calendar_today</span>
              Tanggal Pembayaran <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => handlePaymentDateChange(e.target.value)}
              error={errors.paymentDate}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-slate-400 text-base">tag</span>
              Nomor Referensi <span className="text-red-500">*</span>
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
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-slate-400 text-base">payment</span>
            Metode Pembayaran <span className="text-red-500">*</span>
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
                className={`flex flex-col items-center justify-center p-3 rounded-xl border h-24 transition-all hover:border-slate-400 dark:hover:border-slate-500 ${
                  paymentMethod === "transfer"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                <Icon
                  name="account_balance"
                  size="lg"
                  className={`mb-2 ${paymentMethod === "transfer" ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}
                />
                <span
                  className={`text-sm font-medium ${
                    paymentMethod === "transfer"
                      ? "text-primary"
                      : "text-slate-900 dark:text-slate-200"
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
                className={`flex flex-col items-center justify-center p-3 rounded-xl border h-24 transition-all hover:border-slate-400 dark:hover:border-slate-500 ${
                  paymentMethod === "e-wallet"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                <Icon
                  name="account_balance_wallet"
                  size="lg"
                  className={`mb-2 ${paymentMethod === "e-wallet" ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}
                />
                <span
                  className={`text-sm font-medium ${
                    paymentMethod === "e-wallet"
                      ? "text-primary"
                      : "text-slate-900 dark:text-slate-200"
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
                className={`flex flex-col items-center justify-center p-3 rounded-xl border h-24 transition-all hover:border-slate-400 dark:hover:border-slate-500 ${
                  paymentMethod === "saldo"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                <Icon
                  name="account_balance_wallet"
                  size="lg"
                  className={`mb-2 ${paymentMethod === "saldo" ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}
                />
                <span
                  className={`text-sm font-medium ${
                    paymentMethod === "saldo"
                      ? "text-primary"
                      : "text-slate-900 dark:text-slate-200"
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

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-slate-400 text-base">receipt_long</span>
            Total Tagihan <span className="text-red-500">*</span>
          </label>
          <CurrencyInput
            placeholder="0"
            value={totalAmount}
            onChange={(value) => handleTotalAmountChange(value)}
            error={errors.totalAmount}
          />
          <p className="text-xs text-slate-400 italic">
            Total nominal tagihan/kewajiban driver. Sisa tagihan dihitung dari total dikurangi pembayaran yang valid.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-slate-400 text-base">payments</span>
            Opsi Pembayaran (Cicilan)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 4].map((term) => (
              <RadioCard
                key={term}
                icon={term === 1 ? "payments" : term === 2 ? "repeat" : "calendar_month"}
                label={`${term} Kali`}
                name="payment_terms"
                value={String(term)}
                checked={paymentTerms === term}
                onChange={() => onPaymentTermsChange?.(term)}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 italic">
            Jumlah angsuran atau cicilan tagihan. Cicilan pertama dibayarkan dari nominal pembayaran awal.
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-slate-400 text-base">verified_user</span>
            Admin Fee (Join) <span className="text-xs font-normal text-slate-400">(Opsional)</span>
          </label>
          <CurrencyInput
            placeholder="0"
            value={feeAdminJoin}
            onChange={(value) => onFeeAdminJoinChange?.(value)}
          />
          <p className="text-xs text-slate-400 italic">
            Biaya admin untuk akun yang pertama kali melakukan sewa. Reguler Rp 500.000 / Premium Rp 700.000.
          </p>
        </div>

        {mode === "add" && (
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-slate-400 text-base">flag</span>
              Kondisi Awal
            </label>
            <div className="grid grid-cols-3 gap-3">
              <RadioCard
                icon="payments"
                label="Paid"
                name="initial_status"
                value="paid"
                checked={initialStatus === "paid"}
                onChange={() => {
                  onInitialStatusChange?.("paid");
                  setStatusNote(null);
                }}
              />
              <RadioCard
                icon="schedule"
                label="Pending"
                name="initial_status"
                value="pending"
                checked={initialStatus === "pending"}
                onChange={() => {
                  onInitialStatusChange?.("pending");
                  setStatusNote(null);
                }}
              />
              <RadioCard
                icon="hourglass_top"
                label="Unpaid"
                name="initial_status"
                value="unpaid"
                checked={initialStatus === "unpaid"}
                onChange={() => {
                  onInitialStatusChange?.("unpaid");
                  const num = parseFloat(amount.replace(/[^\d.]/g, "")) || 0;
                  setStatusNote(num > 0 ? "unpaid-warning" : null);
                }}
              />
            </div>
            <p className="text-xs text-slate-400 italic">
              Paid = pembayaran awal diterima langsung. Pending = menunggu verifikasi. Unpaid = belum ada pembayaran.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-slate-400 text-base">attach_money</span>
            {mode === "add" ? "Jumlah Dibayar Awal" : "Nominal Pembayaran Baru"}{" "}
            {mode === "add" && <span className="text-red-500">*</span>}
          </label>
          <CurrencyInput
            placeholder="0"
            value={amount}
            onChange={(value) => handleAmountChange(value)}
            error={errors.amount}
          />
          <p className="text-xs text-slate-400 italic">
            {mode === "add"
              ? "Nominal cicilan pertama yang dibayarkan. Mencatat pembayaran dan mengurangi sisa tagihan (tidak boleh melebihi total tagihan)."
              : "Nominal pembayaran yang dicatat sekarang, akan mengurangi sisa tagihan. Kosongkan jika hanya mengubah detail tagihan."}
          </p>
          {statusNote === "auto-paid" && (
            <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg px-3 py-2">
              Karena Anda mengisi Jumlah Dibayar Awal, Kondisi Awal otomatis diubah menjadi{" "}
              <strong>Paid</strong>.
            </p>
          )}
          {statusNote === "unpaid-warning" && (
            <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 rounded-lg px-3 py-2">
              Kondisi Awal <strong>Unpaid</strong> akan <strong>mengabaikan</strong> Jumlah Dibayar Awal yang
              sudah diisi. Pilih <strong>Paid</strong> jika ingin mencatatnya sebagai pembayaran.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-slate-400 text-base">savings</span>
            Jumlah Deposit <span className="text-xs font-normal text-slate-400">(Opsional)</span>
          </label>
          <CurrencyInput
            placeholder="0"
            value={depositAmount}
            onChange={(value) => handleDepositAmountChange(value)}
            error={errors.depositAmount}
          />
          <p className="text-xs text-slate-400 italic">
            Nominal uang jaminan/DP yang dicatat terpisah dari cicilan. Hanya sebagai catatan,{" "}
            <span className="font-semibold not-italic">tidak mengurangi sisa tagihan</span>.
          </p>
        </div>

        <Textarea
          label="Catatan (Opsional)"
          placeholder="Tambahkan catatan tentang pembayaran ini..."
          value={notes}
          onChange={(e) => onNotesChange?.(e.target.value)}
          rows={2}
        />
      </form>

      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Pilih Bank"
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
                className="group flex items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-20 h-20 flex items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-700 group-hover:bg-primary/5 transition-colors">
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
        title="Pilih E-Wallet"
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
                className="group flex items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-20 h-20 flex items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-700 group-hover:bg-primary/5 transition-colors">
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

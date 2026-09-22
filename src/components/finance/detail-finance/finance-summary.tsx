import type { FinanceItem, FinanceStatus } from "@/lib/types/finances";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
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

const methodLabel: Record<string, string> = {
  cash: "Cash",
  transfer: "Transfer",
  "e-wallet": "E-Wallet",
  saldo: "Koin",
};

const statusLabel: Record<FinanceStatus, string> = {
  unpaid: "Unpaid",
  pending: "Pending",
  paid: "Paid",
  cancelled: "Cancelled",
};

const statusStyle: Record<FinanceStatus, string> = {
  unpaid: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  paid: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

const statusDot: Record<FinanceStatus, string> = {
  unpaid: "bg-slate-400",
  pending: "bg-amber-500",
  paid: "bg-green-500",
  cancelled: "bg-red-500",
};

interface FinanceSummaryProps {
  finance: FinanceItem;
}

const FinanceSummary = ({ finance }: FinanceSummaryProps) => {
  const driverName = finance.driver
    ? `${finance.driver.first_name} ${finance.driver.last_name}`
    : finance.payer;

  const status: FinanceStatus = finance.status || finance.finance_type || "unpaid";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">receipt_long</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Ringkasan Tagihan
          </h3>
          <p className="text-xs text-slate-400">Detail tagihan driver</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
            Nomor Referensi
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl lg:text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              {finance.reference_number}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {formatDate(finance.payment_date)}
          </p>
          <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${statusStyle[status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`}></span>
            {statusLabel[status]}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-t border-slate-100 dark:border-slate-800 mb-8 pt-6">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
            Total Tagihan
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-semibold text-slate-400">Rp</span>
            <span className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              {formatCurrency(finance.fee_admin_join ?? finance.amount_received).replace("Rp", "").trim()}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {driverName}
          </p>
          {finance.driver?.employee_id && (
            <p className="text-xs text-slate-400 mt-0.5">ID: {finance.driver.employee_id}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Sudah Dibayar
          </p>
          <p className="text-sm font-bold text-green-600 dark:text-green-400">
            {formatCurrency(finance.paid_amount ?? finance.amount_received)}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Sisa Tagihan
          </p>
          <p className={`text-sm font-bold ${finance.remaining_amount > 0 ? "text-orange-500" : "text-slate-900 dark:text-white"}`}>
            {formatCurrency(finance.remaining_amount ?? 0)}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Metode Pembayaran
          </p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 text-lg">account_balance_wallet</span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {methodLabel[finance.payment_method] || finance.payment_method}
            </span>
          </div>
        </div>
      </div>

      {finance.notes && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Catatan
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {finance.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default FinanceSummary;
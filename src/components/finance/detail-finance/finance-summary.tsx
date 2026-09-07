import type { FinanceItem } from "@/lib/types/finances";

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
  saldo: "Saldo",
};

interface FinanceSummaryProps {
  finance: FinanceItem;
}

const FinanceSummary = ({ finance }: FinanceSummaryProps) => {
  const driverName = finance.driver
    ? `${finance.driver.first_name} ${finance.driver.last_name}`
    : finance.payer;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">receipt_long</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Ringkasan Pembayaran
          </h3>
          <p className="text-xs text-slate-400">Detail transaksi pembayaran</p>
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
          <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${finance.is_active ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${finance.is_active ? "bg-green-500" : "bg-slate-400"}`}></span>
            {finance.is_active ? "Aktif" : "Tidak Aktif"}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-t border-slate-100 dark:border-slate-800 mb-8 pt-6">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
            Jumlah Diterima
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-semibold text-slate-400">Rp</span>
            <span className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              {formatCurrency(finance.amount_received).replace("Rp", "").trim()}
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
            Metode Pembayaran
          </p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 text-lg">account_balance_wallet</span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {methodLabel[finance.payment_method] || finance.payment_method}
            </span>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Tipe Pembayaran
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
            {finance.finance_type}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Jumlah Deposit
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {formatCurrency(finance.deposit_amount)}
          </p>
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

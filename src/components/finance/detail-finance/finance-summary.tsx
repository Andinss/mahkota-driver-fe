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
    <div className="bg-white dark:bg-[#1a2632] rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
            Reference Number
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl lg:text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
              {finance.reference_number}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end mt-10">
          <p className="text-[10px] text-gray-500 mt-3 font-medium">
            {formatDate(finance.payment_date)}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-t border-gray-200 mb-10">
        <div className="mt-5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
            Amount Received
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-gray-500">Rp</span>
            <span className="text-5xl lg:text-7xl font-black tracking-tighter text-gray-900 dark:text-white">
              {formatCurrency(finance.amount_received).replace("Rp", "").trim()}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end mt-5">
          <span className={`px-4 py-2 border rounded-full text-sm font-bold flex items-center gap-2 ${finance.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${finance.is_active ? "bg-green-500" : "bg-gray-400"}`}></span>
            {finance.is_active ? "Active" : "Inactive"}
          </span>
          <p className="text-[10px] text-gray-500 mt-3 font-medium">
            {driverName}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Payment Method
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
              <span
                className="material-symbols-outlined text-blue-600 text-xl"
                data-icon="account_balance_wallet"
              >
                account_balance_wallet
              </span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              {methodLabel[finance.payment_method] || finance.payment_method}
            </span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Payer
          </p>
          <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
            {driverName}
          </p>
          {finance.driver?.employee_id && (
            <p className="text-xs text-gray-400">ID: {finance.driver.employee_id}</p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Notes
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {finance.notes || "-"}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Status
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
            {finance.finance_type}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Deposit Amount
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(finance.deposit_amount)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Created At
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(finance.created_at || "")}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Updated At
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(finance.updated_at || "")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinanceSummary;

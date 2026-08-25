import type { FinanceItem } from "@/lib/types/finances";

const imageBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");

const photoUrl = (path?: string) =>
  path
    ? path.startsWith("http") ? path : `${imageBase}/${path.replace(/^\//, "")}`
    : "";

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

interface DetailInfoProps {
  finance: FinanceItem;
}

const DetailInfo = ({ finance }: DetailInfoProps) => {
  const driverName = finance.driver
    ? `${finance.driver.first_name} ${finance.driver.last_name}`
    : finance.payer;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-[#1a2632] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
          Payer Information
        </p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
            {finance.driver?.profile_photo ? (
              <img src={photoUrl(finance.driver.profile_photo)} alt={driverName} className="w-full h-full rounded-xl object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-600">
                {driverName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white">{driverName}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              {finance.driver?.employee_id && `ID: ${finance.driver.employee_id} • `}
              Amount: {formatCurrency(finance.amount_received)}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Type:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">{finance.finance_type}</span>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-[#1a2632] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
          Payment Details
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Reference:</span>
            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{finance.reference_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Date:</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(finance.payment_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Method:</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{finance.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Notes:</span>
            <span className="text-sm text-gray-900 dark:text-white">{finance.notes || "-"}</span>
          </div>
          {finance.rentals && finance.rentals.length > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Rentals:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white text-right">
                {finance.rentals.map((r) => r.rental_number).join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DetailInfo;

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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">person</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Informasi Payer
            </h3>
            <p className="text-xs text-slate-400">Data driver sebagai payer</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
            {finance.driver?.profile_photo ? (
              <img src={photoUrl(finance.driver.profile_photo)} alt={driverName} className="w-full h-full rounded-xl object-cover" />
            ) : (
              <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                {driverName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{driverName}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {finance.driver?.employee_id && `ID: ${finance.driver.employee_id}`}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Status:</span>
            <span className="font-medium text-slate-900 dark:text-white capitalize">{finance.finance_type}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-500 text-xl">receipt</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Detail Pembayaran
            </h3>
            <p className="text-xs text-slate-400">Informasi transaksi</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Referensi:</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{finance.reference_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Tanggal:</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(finance.payment_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Jumlah:</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(finance.amount_received)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Deposit:</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(finance.deposit_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Metode:</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{finance.payment_method}</span>
          </div>
          {finance.notes && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Catatan:</span>
              <span className="text-sm text-slate-900 dark:text-white text-right max-w-[60%]">{finance.notes}</span>
            </div>
          )}
          {finance.rentals && finance.rentals.length > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Sewa:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white text-right">
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

interface DurationProps {
  startDate?: string;
  endDate?: string;
  dailyRate?: number;
  duration?: number;
  rentalDuration?: string;
  rentalService?: string;
}

const formatDate = (d?: string) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Duration = ({
  startDate,
  endDate,
  dailyRate = 0,
  duration = 0,
  rentalDuration,
  rentalService,
}: DurationProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 text-lg">schedule</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Periode & Tarif
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 dark:bg-primary/20 rounded-lg text-xs font-bold text-primary">
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          {duration} Hari
        </span>
      </div>

      {/* Date Range */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-6">
        <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-green-500 text-sm">play_circle</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tanggal Mulai
            </p>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {formatDate(startDate)}
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-8 h-[2px] bg-slate-200 dark:bg-slate-700 relative sm:rotate-0 rotate-90">
            <span className="material-symbols-outlined absolute -top-2 -right-1 text-slate-300 dark:text-slate-600 text-sm">
              arrow_forward
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-red-500 text-sm">stop_circle</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tanggal Selesai
            </p>
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {formatDate(endDate)}
          </p>
        </div>
      </div>

      {/* Rental Type Badges */}
      {(rentalDuration || rentalService) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {rentalDuration && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {rentalDuration}
            </span>
          )}
          {rentalService && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span className="material-symbols-outlined text-sm">
                {rentalService === "lepas kunci" ? "no_crash" : "person"}
              </span>
              {rentalService}
            </span>
          )}
        </div>
      )}

      {/* Daily Rate */}
      <div className="pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 dark:border-primary/20">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-lg">payments</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-primary/60 uppercase tracking-wider mb-0.5">
              Tarif Harian
            </p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(dailyRate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Duration;
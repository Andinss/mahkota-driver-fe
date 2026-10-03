interface RentalStatusProps {
  status?: "active" | "stopped";
  stoppedAt?: string | null;
  startDate?: string;
  endDate?: string;
}

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return formatDate(value);
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDerivedStatus = (startDate?: string, endDate?: string) => {
  const today = new Date().toISOString().slice(0, 10);
  if (startDate && today < startDate) return "upcoming";
  if (endDate && today > endDate) return "completed";
  return "active";
};

const derivedStatusLabel: Record<string, string> = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
};

const derivedStatusColor: Record<string, string> = {
  active:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  upcoming:
    "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  completed:
    "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const RentalStatus = ({ status, stoppedAt, startDate, endDate }: RentalStatusProps) => {
  const isStopped = status === "stopped";

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 ${
        isStopped
          ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 text-lg">
            {isStopped ? "pause_circle" : "verified"}
          </span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Status Sewa
          </p>
        </div>

        {isStopped ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <span className="material-symbols-outlined text-sm">stop_circle</span>
            Stopped
          </span>
        ) : (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
              derivedStatusColor[getDerivedStatus(startDate, endDate)]
            }`}
          >
            {derivedStatusLabel[getDerivedStatus(startDate, endDate)]}
          </span>
        )}
      </div>

      {isStopped && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-slate-500 text-lg">
              event_busy
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Tanggal Stop
            </p>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {formatDateTime(stoppedAt)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tagihan harian tidak lagi dibuat untuk sewa ini.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalStatus;
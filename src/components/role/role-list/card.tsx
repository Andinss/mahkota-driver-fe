interface RoleCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  valueColor?: string;
  trend?: {
    value: string;
    color: string;
    icon: string;
  };
  progressBar?: {
    percentage: number;
    label: string;
  };
}

const colorToBg: Record<string, string> = {
  "text-slate-600": "bg-slate-100 dark:bg-slate-800",
  "text-slate-400": "bg-slate-100 dark:bg-slate-800",
  "text-blue-600": "bg-blue-50 dark:bg-blue-900/20",
};

export function RoleCard({
  title,
  value,
  icon,
  iconColor,
  trend,
  progressBar,
}: RoleCardProps) {
  const bgClass = colorToBg[iconColor] || "bg-slate-100 dark:bg-slate-800";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
          <span className={`material-symbols-outlined text-2xl ${iconColor}`}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-xs text-slate-400 font-medium truncate">{title}</p>
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className={`text-xs font-medium flex items-center gap-1 ${trend.color}`}>
            <span className="material-symbols-outlined text-sm">{trend.icon}</span>
            {trend.value}
          </span>
        </div>
      )}

      {progressBar && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${progressBar.percentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mt-1.5">
            {progressBar.label}
          </p>
        </div>
      )}
    </div>
  );
}

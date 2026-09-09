interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBg?: string;
  iconColor?: string;
  trend?: {
    icon: string;
    value: string;
    color: string;
  };
  subtitle?: string;
  progressBar?: {
    percentage: number;
    label: string;
  };
  badge?: {
    value: string;
    color: string;
    bgColor: string;
  };
}

const colorToBg: Record<string, string> = {
  "text-red-500": "bg-red-50 dark:bg-red-900/20",
  "text-red-600": "bg-red-50 dark:bg-red-900/20",
  "text-blue-500": "bg-blue-50 dark:bg-blue-900/20",
  "text-blue-600": "bg-blue-50 dark:bg-blue-900/20",
  "text-green-500": "bg-green-50 dark:bg-green-900/20",
  "text-emerald-500": "bg-emerald-50 dark:bg-emerald-900/20",
  "text-emerald-600": "bg-emerald-50 dark:bg-emerald-900/20",
  "text-amber-500": "bg-amber-50 dark:bg-amber-900/20",
  "text-amber-600": "bg-amber-50 dark:bg-amber-900/20",
  "text-orange-500": "bg-orange-50 dark:bg-orange-900/20",
  "text-orange-700": "bg-orange-50 dark:bg-orange-900/20",
  "text-purple-500": "bg-purple-50 dark:bg-purple-900/20",
  "text-purple-600": "bg-purple-50 dark:bg-purple-900/20",
  "text-indigo-600": "bg-indigo-50 dark:bg-indigo-900/20",
  "text-slate-500": "bg-slate-100 dark:bg-slate-800",
  "text-slate-600": "bg-slate-100 dark:bg-slate-800",
  "text-primary": "bg-primary/10 dark:bg-primary/20",
  "text-gray-600": "bg-gray-100 dark:bg-gray-800",
  "text-gray-400": "bg-gray-100 dark:bg-gray-800",
};

export function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor = "text-slate-500",
  trend,
  subtitle,
  progressBar,
  badge,
}: StatCardProps) {
  const bgClass = iconBg || colorToBg[iconColor] || "bg-slate-100 dark:bg-slate-800";
  const displayValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}
        >
          <span className={`material-symbols-outlined text-2xl ${iconColor}`}>
            {icon}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {displayValue}
          </p>
          <p className="text-xs text-slate-400 font-medium truncate">{title}</p>
        </div>
        {badge && (
          <span
            className={`ml-auto shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${badge.color} ${badge.bgColor}`}
          >
            {badge.value}
          </span>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          {trend && (
            <span
              className={`text-xs font-medium flex items-center gap-1 ${trend.color}`}
            >
              <span className="material-symbols-outlined text-sm">
                {trend.icon}
              </span>
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-slate-400 font-medium">{subtitle}</span>
          )}
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

export interface DriverStatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  valueClassName?: string;
  trend?: {
    icon: string;
    text: string;
    textColor: string;
  };
}

const colorToBg: Record<string, string> = {
  "text-primary": "bg-primary/10 dark:bg-primary/20",
  "text-blue-500": "bg-blue-50 dark:bg-blue-900/20",
  "text-emerald-500": "bg-emerald-50 dark:bg-emerald-900/20",
  "text-red-500": "bg-red-50 dark:bg-red-900/20",
  "text-slate-400": "bg-slate-100 dark:bg-slate-800",
};

export function DriverStatsCard({
  title,
  value,
  icon,
  iconColor,
  valueClassName = "text-2xl",
  trend,
}: DriverStatsCardProps) {
  const bgClass = colorToBg[iconColor] || "bg-slate-100 dark:bg-slate-800";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
          <span className={`material-symbols-outlined text-2xl ${iconColor}`}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p className={`${valueClassName} font-bold text-slate-900 dark:text-white truncate`}>{value}</p>
          <p className="text-xs text-slate-400 font-medium truncate">{title}</p>
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className={`text-xs font-medium flex items-center gap-1 ${trend.textColor}`}>
            <span className="material-symbols-outlined text-sm">{trend.icon}</span>
            {trend.text}
          </span>
        </div>
      )}
    </div>
  );
}

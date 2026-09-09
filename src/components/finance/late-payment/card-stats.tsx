interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor?: string;
  trend: {
    icon: string;
    value: string;
    trendColor: string;
    bgColor: string;
  };
}

const colorToBg: Record<string, string> = {
  "text-red-600": "bg-red-50 dark:bg-red-900/20",
  "text-amber-600": "bg-amber-50 dark:bg-amber-900/20",
  "text-blue-600": "bg-blue-50 dark:bg-blue-900/20",
};

export function StatsCard({
  title,
  value,
  icon,
  iconColor = "text-slate-500",
  trend,
}: StatsCardProps) {
  const bgClass = colorToBg[iconColor || ""] || "bg-slate-100 dark:bg-slate-800";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
          <span className={`material-symbols-outlined text-2xl ${iconColor}`}>{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight break-words">{value}</p>
          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{title}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className={`${trend.trendColor} ${trend.bgColor} px-2 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1`}>
          <span className="material-symbols-outlined text-sm">{trend.icon}</span>
          {trend.value}
        </span>
      </div>
    </div>
  );
}

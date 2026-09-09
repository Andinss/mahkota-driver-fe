interface VehicleStatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  trend: {
    value: string;
    color: string;
    icon: string;
  };
}

const colorToBg: Record<string, string> = {
  "text-primary": "bg-primary/10 dark:bg-primary/20",
  "text-blue-500": "bg-blue-50 dark:bg-blue-900/20",
  "text-green-500": "bg-green-50 dark:bg-green-900/20",
  "text-orange-500": "bg-orange-50 dark:bg-orange-900/20",
  "text-purple-500": "bg-purple-50 dark:bg-purple-900/20",
};

export function VehicleStatsCard({
  title,
  value,
  icon,
  iconColor,
  trend,
}: VehicleStatsCardProps) {
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
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className={`text-xs font-medium flex items-center gap-1 ${trend.color}`}>
          <span className="material-symbols-outlined text-sm">{trend.icon}</span>
          {trend.value}
        </span>
      </div>
    </div>
  );
}

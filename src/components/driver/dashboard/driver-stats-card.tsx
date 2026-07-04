export interface DriverStatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  trend?: {
    icon: string;
    text: string;
    textColor: string;
  };
}

export function DriverStatsCard({
  title,
  value,
  icon,
  iconColor,
  trend,
}: DriverStatsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <span className={`material-icons-round ${iconColor}`}>{icon}</span>
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        {value}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[11px] font-semibold ${trend.textColor}`}>
          <span className="material-icons-round text-xs">{trend.icon}</span>
          <span className="text-xs">{trend.text}</span>
        </div>
      )}
    </div>
  );
}

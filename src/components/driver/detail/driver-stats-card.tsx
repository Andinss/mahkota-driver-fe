export interface DriverStatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
}

export function DriverStatsCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  badge,
  badgeColor = "text-slate-400",
}: DriverStatsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${iconBgColor} rounded-xl`}>
          <span className={`material-symbols-outlined ${iconColor}`}>
            {icon}
          </span>
        </div>
        {badge && (
          <span className={`text-xs font-bold ${badgeColor}`}>{badge}</span>
        )}
      </div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
        {title}
      </p>
      <div className="text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

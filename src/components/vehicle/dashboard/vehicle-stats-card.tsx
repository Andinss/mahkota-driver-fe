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

export function VehicleStatsCard({
  title,
  value,
  icon,
  iconColor,
  trend,
}: VehicleStatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <span className={`material-symbols-outlined ${iconColor}`}>
          {icon}
        </span>
      </div>
      <p className="text-3xl font-bold dark:text-white">{value}</p>
      <p className={`text-xs font-medium ${trend.color} mt-2 flex items-center gap-1`}>
        <span className="material-symbols-outlined text-sm">
          {trend.icon}
        </span>{" "}
        {trend.value}
      </p>
    </div>
  );
}

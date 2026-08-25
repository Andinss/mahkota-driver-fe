interface StatsCardProps  {
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

export function StatsCard({
  title,
  value,
  icon,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-[#dbe0e6] dark:border-gray-700 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="material-symbols-outlined text-4xl text-primary">{icon}</span>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-normal">
        {title}
      </p>
      <div className="flex items-end gap-2">
        <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">
          {value}
        </p>
        <span className={`${trend.trendColor} ${trend.bgColor} px-1.5 py-0.5 rounded text-xs font-semibold`}>
          {trend.value}
        </span>
      </div>
    </div>
  );
}
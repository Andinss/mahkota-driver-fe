interface MembershipCardProps {
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
  "text-purple-600": "bg-purple-50 dark:bg-purple-900/20",
  "text-blue-600": "bg-blue-50 dark:bg-blue-900/20",
  "text-emerald-600": "bg-emerald-50 dark:bg-emerald-900/20",
  "text-amber-600": "bg-amber-50 dark:bg-amber-900/20",
};

export function MembershipCard({
  title,
  value,
  icon,
  iconColor,
  trend,
}: MembershipCardProps) {
  const bgClass = colorToBg[iconColor] || "bg-slate-100 dark:bg-slate-800";

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
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight break-words">
            {value}
          </p>
          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
            {title}
          </p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <span
          className={`text-xs font-medium flex items-center gap-1 ${trend.color}`}
        >
          <span className="material-symbols-outlined text-sm">{trend.icon}</span>
          {trend.value}
        </span>
      </div>
    </div>
  );
}

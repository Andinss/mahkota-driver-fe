interface ActiveBadgeProps {
  isActive: boolean;
  showDot?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export const ActiveBadge = ({
  isActive,
  showDot = true,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: ActiveBadgeProps) => {
  const config = isActive
    ? {
        label: activeLabel,
        className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
        dotColor: "bg-emerald-500",
      }
    : {
        label: inactiveLabel,
        className: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
        dotColor: "bg-slate-400",
      };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${config.className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></span>
      )}
      {config.label}
    </span>
  );
};
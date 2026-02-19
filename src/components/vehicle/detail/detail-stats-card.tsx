interface DetailStatsCardProps {
  title: string;
  value: number;
  percentage: string;
  progress: number;
  color: "blue" | "amber" | "red" | "slate" | "teal";
}

const colorConfig = {
  blue: {
    badgeBg: "bg-blue-50 dark:bg-blue-900/30",
    badgeText: "text-blue-600 dark:text-blue-400",
    progressBg: "bg-primary",
  },
  amber: {
    badgeBg: "bg-amber-50 dark:bg-amber-900/30",
    badgeText: "text-amber-600 dark:text-amber-400",
    progressBg: "bg-amber-500",
  },
  red: {
    badgeBg: "bg-red-50 dark:bg-red-900/30",
    badgeText: "text-red-600 dark:text-red-400",
    progressBg: "bg-red-500",
  },
  slate: {
    badgeBg: "bg-slate-100 dark:bg-slate-700",
    badgeText: "text-slate-600 dark:text-slate-300",
    progressBg: "bg-slate-400",
  },
  teal: {
    badgeBg: "bg-teal-50 dark:bg-teal-900/30",
    badgeText: "text-teal-600 dark:text-teal-400",
    progressBg: "bg-teal-500",
  },
};

export const DetailStatsCard = ({
  title,
  value,
  percentage,
  progress,
  color,
}: DetailStatsCardProps) => {
  const config = colorConfig[color];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-1">
      <div className="flex justify-between items-start">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {title}
        </p>
        <span className={`${config.badgeBg} ${config.badgeText} text-xs px-2 py-0.5 rounded-full font-medium`}>
          {percentage}
        </span>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
        {value}
      </p>
      <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 mt-3 rounded-full overflow-hidden">
        <div
          className={`${config.progressBg} h-full rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  trend?: {
    value: string;
    direction?: "up" | "down" | "neutral";
    color?: string;
  };
}

const colorToBg: Record<string, string> = {
  "text-indigo-500": "bg-indigo-50 dark:bg-indigo-900/20",
  "text-blue-500": "bg-blue-50 dark:bg-blue-900/20",
  "text-amber-500": "bg-amber-50 dark:bg-amber-900/20",
  "text-emerald-500": "bg-emerald-50 dark:bg-emerald-900/20",
  "text-green-500": "bg-green-50 dark:bg-green-900/20",
  "text-red-500": "bg-red-50 dark:bg-red-900/20",
  "text-primary": "bg-primary/10 dark:bg-primary/20",
};

export const StatCard = ({ title, value, subtitle, icon, iconColor, trend }: StatCardProps) => {
  const bgClass = colorToBg[iconColor] || "bg-slate-100 dark:bg-slate-800";

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
          <span className={`${iconColor} text-2xl`}>
            <Icon name={icon} />
          </span>
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            {subtitle && (
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{subtitle}</span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-medium truncate">{title}</p>
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className={`text-xs font-medium flex items-center gap-1 ${trend.color || "text-slate-400"}`}>
            <span className="material-symbols-outlined text-sm">
              {trend.direction === "up" ? "trending_up" : trend.direction === "down" ? "trending_down" : "trending_flat"}
            </span>
            {trend.value}
          </span>
        </div>
      )}
    </Card>
  );
};

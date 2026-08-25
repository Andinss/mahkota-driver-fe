import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { TrendBadge } from "@/components/ui/trend-badge";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  trend?: {
    value: string;
    direction?: "up" | "down" | "neutral";
    color?: string;
  };
}

export const StatCard = ({ title, value, icon, iconColor, trend }: StatCardProps) => {
  return (
    <Card className="flex flex-col gap-2 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {title}
        </p>
        <span className={`${iconColor} ${iconColor.replace("text-", "")}/10 p-1.5 rounded-md text-xl`}>
          <Icon name={icon} />
        </span>
      </div>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">
          {value}
        </p>
        {trend && <TrendBadge value={trend.value} direction={trend.direction} color={trend.color} />}
      </div>
    </Card>
  );
};

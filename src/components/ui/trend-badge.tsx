import { Icon } from "./icon";

type TrendDirection = "up" | "down" | "neutral";

interface TrendBadgeProps {
  value: string;
  direction?: TrendDirection;
  color?: string;
}

const directionStyles: Record<TrendDirection, { icon: string; color: string }> = {
  up: { icon: "trending_up", color: "text-emerald-600 dark:text-emerald-400" },
  down: { icon: "trending_down", color: "text-red-600 dark:text-red-400" },
  neutral: { icon: "equal", color: "text-slate-500" },
};

export const TrendBadge = ({ value, direction = "neutral", color }: TrendBadgeProps) => {
  const styles = directionStyles[direction];
  const badgeColor = color || styles.color;

  return (
    <span className={`text-xs font-medium ${badgeColor} flex items-center gap-1`}>
      <Icon name={styles.icon} size="sm" />
      {value}
    </span>
  );
};

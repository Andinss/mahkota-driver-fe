import { Badge } from "@/components/ui/badge";

type LevelBadgeProps = {
  level: number;
  name: string;
  size?: "sm" | "md";
};

export const LevelBadge = ({ level, name, size = "md" }: LevelBadgeProps) => {
  const isPremium = level > 1;
  const className = isPremium
    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
    : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-bold ${className} ${sizeClass}`}
    >
      <span className="material-symbols-outlined text-sm">
        {isPremium ? "workspace_premium" : "military_tech"}
      </span>
      {name || (isPremium ? "Premium" : "Regular")}
    </span>
  );
};

interface MembershipStatusBadgeProps {
  isActive: boolean;
}

export const MembershipStatusBadge = ({ isActive }: MembershipStatusBadgeProps) => (
  <Badge variant={isActive ? "success" : "neutral"} dot>
    {isActive ? "Aktif" : "Nonaktif"}
  </Badge>
);

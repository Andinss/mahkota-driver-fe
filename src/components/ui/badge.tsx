type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  danger: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  neutral: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    dot: "bg-slate-500",
  },
};

export const Badge = ({ variant = "neutral", size = "md", dot = false, children }: BadgeProps) => {
  const styles = variantStyles[variant];
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg font-bold ${styles.bg} ${styles.text} ${sizeClasses}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>}
      {children}
    </span>
  );
};

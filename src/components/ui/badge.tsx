type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success: {
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-800 dark:text-emerald-400",
    dot: "bg-emerald-600 dark:bg-emerald-400",
  },
  warning: {
    bg: "bg-amber-100 dark:bg-amber-900/40",
    text: "text-amber-800 dark:text-amber-400",
    dot: "bg-amber-600 dark:bg-amber-400",
  },
  danger: {
    bg: "bg-red-100 dark:bg-red-900/40",
    text: "text-red-800 dark:text-red-400",
    dot: "bg-red-600 dark:bg-red-400",
  },
  info: {
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-800 dark:text-blue-400",
    dot: "bg-blue-600 dark:bg-blue-400",
  },
  neutral: {
    bg: "bg-slate-100 dark:bg-slate-700",
    text: "text-slate-800 dark:text-slate-300",
    dot: "bg-slate-600 dark:bg-slate-400",
  },
};

export const Badge = ({ variant = "neutral", size = "md", dot = false, children }: BadgeProps) => {
  const styles = variantStyles[variant];
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${styles.bg} ${styles.text} ${sizeClasses}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>}
      {children}
    </span>
  );
};

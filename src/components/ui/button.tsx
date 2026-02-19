import { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "icon"
  | "success"
  | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconPosition?: "left" | "right";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary hover:bg-blue-600 text-white shadow-sm",
  secondary: "bg-white dark:bg-[#1a2632] border border-[#dbe0e6] dark:border-[#4b5563] text-[#111418] dark:text-white hover:bg-[#f0f2f4] dark:hover:bg-[#2a3845] shadow-sm",
  outline: "border border-[#dbe0e6] dark:border-[#4b5563] text-[#111418] dark:text-white hover:bg-[#f0f2f4] dark:hover:bg-[#2a3845]",
  ghost: "text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800",
  icon: "size-10 rounded-full flex items-center justify-center",
  success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
};

const sizeStyles: Record<"sm" | "md" | "lg", string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2 text-sm",
};

export const Button = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-95 transform duration-100 focus:outline-none focus:ring-2 focus:ring-primary/50";
  const variantClass = variantStyles[variant];
  const sizeClass = sizeStyles[size];

  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      {children && <span className="truncate">{children}</span>}
      {icon && iconPosition === "right" && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
    </button>
  );
};

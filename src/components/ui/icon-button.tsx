import { ButtonHTMLAttributes } from "react";
import { Icon } from "./icon";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  badge?: boolean;
}

const sizeStyles: Record<"sm" | "md" | "lg", string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

const variantStyles: Record<"default" | "ghost" | "outline", string> = {
  default: "rounded-full border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600",
  ghost: "rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a3845]",
  outline: "rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] text-[#617589] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a3845]",
};

export const IconButton = ({
  name,
  size = "md",
  variant = "default",
  badge = false,
  className = "",
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center ${sizeStyles[size]} ${variantStyles[variant]} transition-colors relative ${className}`}
      {...props}
    >
      <Icon name={name} size={size === "sm" ? "sm" : "md"} className="text-slate-600 dark:text-slate-300" />
      {badge && <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-slate-200 dark:border-slate-700"></span>}
    </button>
  );
};

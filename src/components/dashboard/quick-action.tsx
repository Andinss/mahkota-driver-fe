import { ButtonHTMLAttributes } from "react";

interface QuickActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  title: string;
  description: string;
  variant: "primary" | "amber" | "indigo" | "slate";
}

const variantStyles = {
  primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
  amber: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
  indigo: "bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white",
  slate: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-slate-600 group-hover:text-white",
};

export const QuickAction = ({ icon, title, description, variant, onClick, className = "" }: QuickActionProps) => {
  return (
    <button
      className={`flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left ${className}`}
      onClick={onClick}
    >
      <div className={`size-10 rounded-lg ${variantStyles[variant]} flex items-center justify-center shrink-0 transition-colors`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-slate-900 dark:text-white font-medium text-sm">
          {title}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          {description}
        </p>
      </div>
    </button>
  );
};

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={`rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

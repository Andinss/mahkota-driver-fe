import { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  children: ReactNode;
}

export const Select = ({ label, required, className = "", id, children, ...props }: SelectProps) => {
  const defaultClasses = "w-full rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-3 py-2 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary appearance-none transition-all pr-8";

  return (
    <div className="flex flex-col gap-1.5 relative">
      {label && (
        <label className="text-sm font-medium text-[#111418] dark:text-white" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select className={`${defaultClasses} ${className}`} id={id} {...props}>
          {children}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">
          expand_more
        </span>
      </div>
    </div>
  );
};

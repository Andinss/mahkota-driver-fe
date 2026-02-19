import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
}

export const Input = ({
  label,
  required,
  className = "",
  id,
  ...props
}: InputProps) => {
  const defaultClasses =
    "w-full rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-3 py-2 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className="text-sm font-medium text-[#111418] dark:text-white"
          htmlFor={id}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className={`${defaultClasses} ${className}`}
        id={id}
        {...props}
      />
    </div>
  );
};

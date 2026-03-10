import { forwardRef } from "react";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className = "", label, description, error, required, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={`
            mt-0.5 h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-slate-300 dark:border-slate-600
            checked:border-primary checked:bg-primary
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            transition-colors duration-200
            ${error ? "border-red-500" : ""}
          `}
          {...props}
        />
        <div className="flex-1">
          {label && (
            <label
              htmlFor={radioId}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {description}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Radio.displayName = "Radio";

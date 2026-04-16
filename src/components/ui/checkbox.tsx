import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, id, checked, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <label
        htmlFor={checkboxId}
        className={`inline-flex items-center gap-2 cursor-pointer ${className}`}
      >
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          checked={checked ?? false}
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
          {...props}
        />
        {label && <span className="text-sm font-medium">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

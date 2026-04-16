import { InputHTMLAttributes } from "react";
import { Icon } from "./icon";

export interface RadioCardProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: string;
  label: string;
}

export const RadioCard = ({
  icon,
  label,
  className = "",
  ...props
}: RadioCardProps) => {
  return (
    <label className={`cursor-pointer relative group ${className}`}>
      <input className="peer sr-only" type="radio" {...props} />
      <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#d1d5db] dark:border-gray-600 bg-white dark:bg-gray-800 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all hover:border-gray-400 dark:hover:border-gray-500 h-24">
        <Icon
          name={icon}
          size="lg"
          className="mb-2 text-[#617589] dark:text-gray-400 peer-checked:text-primary"
        />
        <span className="text-sm font-medium text-[#111418] dark:text-gray-200 peer-checked:text-primary">
          {label}
        </span>
      </div>
      <div className="absolute top-2 right-2 hidden peer-checked:block text-primary">
        <Icon name="check_circle" size="md" />
      </div>
    </label>
  );
};

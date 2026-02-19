import { InputHTMLAttributes } from "react";
import { Icon } from "./icon";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export const SearchInput = ({ icon = "search", className = "", ...props }: SearchInputProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name={icon} size="md" className="text-slate-400" />
      </div>
      <input
        className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 text-[#111418] dark:text-white bg-[#f0f2f4] dark:bg-[#2a3845] focus:outline-none ring-1 ring-inset ring-transparent placeholder:text-[#617589] dark:placeholder:text-[#6a7a8a] focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 transition-shadow"
        {...props}
      />
    </div>
  );
};

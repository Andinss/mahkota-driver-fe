import { InputHTMLAttributes } from "react";
import { Icon } from "./icon";
import { Input } from "./input";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export const SearchInput = ({
  icon = "search",
  className = "",
  ...props
}: SearchInputProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name={icon} size="md" className="text-slate-400" />
      </div>
      <Input className="pl-10" {...props} />
    </div>
  );
};

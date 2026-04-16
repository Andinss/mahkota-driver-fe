import { InputHTMLAttributes } from "react";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

interface SearchInputWithClearProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInputWithClear = ({
  onClear,
  className = "",
  ...props
}: SearchInputWithClearProps) => {
  return (
    <div className={`relative ${className}`}>
      <label className="flex flex-col w-full">
        <div className="flex w-full items-stretch rounded-lg h-12 bg-white dark:bg-[#1a2632] border border-[#dbe0e6] dark:border-[#4b5563] ring-1 ring-inset ring-transparent focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary focus-within:border-primary transition-all overflow-hidden">
          <div className="flex items-center justify-center pl-4 text-[#617589] dark:text-gray-400">
            <Icon name="search" size="md" />
          </div>
          <input
            className="flex w-full flex-1 bg-transparent border-none text-[#111418] dark:text-white placeholder:text-[#617589] px-4 focus:ring-0 focus:outline-none h-full text-base"
            {...props}
          />
          <div className="flex items-center pr-2">
            <IconButton
              name="close"
              size="sm"
              className="text-[#617589] hover:text-[#111418] dark:hover:text-white"
              onClick={onClear}
              type="button"
            />
          </div>
        </div>
      </label>
    </div>
  );
};

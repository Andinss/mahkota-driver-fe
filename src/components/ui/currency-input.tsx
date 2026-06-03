"use client";

import { InputHTMLAttributes, useRef, useState, useEffect } from "react";
import { Input } from "./input";

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label?: string;
  required?: boolean;
  error?: string;
  value?: string | number;
  onChange?: (value: string) => void;
}

export const CurrencyInput = ({
  label,
  required,
  error,
  value,
  onChange,
  id,
  ...props
}: CurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      if (!isNaN(numValue)) {
        setDisplayValue(formatNumber(numValue));
      }
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseFormattedValue = (str: string): string => {
    return str.replace(/\./g, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const onlyNumbers = rawValue.replace(/[^0-9]/g, "");
    
    if (onlyNumbers) {
      const formatted = formatNumber(parseInt(onlyNumbers, 10));
      setDisplayValue(formatted);
    } else {
      setDisplayValue("");
    }
    
    onChange?.(onlyNumbers);
  };

  const handleFocus = () => {
    setIsFocused(true);
    const rawValue = parseFormattedValue(displayValue);
    setDisplayValue(rawValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (displayValue) {
      const numValue = parseFloat(parseFormattedValue(displayValue));
      if (!isNaN(numValue)) {
        setDisplayValue(formatNumber(numValue));
      }
    }
  };

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
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#617589] dark:text-slate-400 text-sm font-medium">
          Rp
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          className={`w-full rounded-lg border bg-white dark:bg-[#1a2632] px-3 py-2 pl-12 pr-3 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#dbe0e6] dark:border-[#4b5563]"}`}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};
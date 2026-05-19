"use client";
import { useState } from "react";
import { Input } from "./input";

interface PasswordInputProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

export const PasswordInput = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-3 py-2 pr-10 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }`}
          aria-invalid={error ? "true" : undefined}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-5/6 -translate-y-1/2 text-[#617589] hover:text-[#111418] dark:hover:text-white cursor-pointer flex items-center justify-center"
          style={{ transform: "translateY(-50%)" }}
        >
          <span className="material-symbols-outlined text-xl leading-none">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

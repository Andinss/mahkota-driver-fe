"use client";

import { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
  image?: string;
};

interface SelectSearchProps {
  label?: string;
  required?: boolean;
  options: Option[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export const SelectSearch = ({
  label,
  required,
  options,
  placeholder = "Search...",
  value, 
  defaultValue,
  onChange,
  error,
}: SelectSearchProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const matchedOption = options.find(opt => opt.value === value);
      if (matchedOption) {
        setSelected(matchedOption);
      }
    } else if (defaultValue && !selected) {
      const matchedOption = options.find(opt => opt.value === defaultValue);
      if (matchedOption) {
        setSelected(matchedOption);
      }
    }
  }, [value, defaultValue, options]);


  const inputStyle =
    "w-full rounded-lg border bg-white dark:bg-[#1a2632] px-3 py-2 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary";

  const borderColor = error 
    ? "border-red-500 ring-1 ring-red-500" 
    : "border-[#dbe0e6] dark:border-[#4b5563]";

  const filtered =
    query.trim() !== ""
      ? options.filter((item) =>
          (item.label || "").toLowerCase().includes(query.toLowerCase()),
        )
      : options;

  // ✅ SELECT FIX (tidak bikin data hilang)
  const handleSelect = (item: Option) => {
    setSelected(item);
    setQuery(""); // 🔥 penting: jangan isi label ke query
    setOpen(false);
    onChange?.(item.value);
  };

  // ✅ KLIK LUAR = TUTUP
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="w-full relative">
      {label && (
        <label key="label" className="block mb-1 text-sm font-medium">
          {label} {required && "*"}
        </label>
      )}

      {/* INPUT */}
      <div key="input-group" className="relative">
        {/* Avatar */}
        {selected?.image && (
          <img
            key="selected-image"
            src={selected.image}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-6 rounded-full object-cover"
          />
        )}

        {/* Dropdown Icon */}
        <span
          key="expand-icon"
          onClick={() => {
            setOpen((prev) => !prev);
            setQuery(""); // reset biar semua muncul
          }}
          className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400"
        >
          expand_more
        </span>

        <input
          key="search-input"
          className={`${inputStyle} ${borderColor} ${
            selected?.image ? "pl-10" : "pl-3"
          } pr-10`}
          placeholder={placeholder}
          value={open ? query : selected?.label || ""}
          onFocus={() => {
            setOpen(true);
            setQuery(""); // reset saat buka
          }}
          onChange={(e) => {
            const sanitized = e.target.value.replace(/[^a-zA-Z0-9\s'-]/g, "");
            setQuery(sanitized);
            setSelected(null); // reset pilihan saat ngetik
            setOpen(true);
          }}
        />
      </div>
      {error && (
        <p key="error" className="text-xs text-red-500 mt-1">{error}</p>
      )}

      {/* DROPDOWN */}
      {open && (
        <div key="dropdown" className="absolute z-10 w-full bg-white dark:bg-[#1a2632] border-2 border-blue-500 rounded-lg mt-1 shadow max-h-60 overflow-auto">
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <div
                key={`${item.value || index}-${index}`}
                onClick={() => handleSelect(item)}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition
                  ${
                    selected?.value === item.value
                      ? "bg-blue-100 dark:bg-slate-700"
                      : "hover:bg-blue-50 dark:hover:bg-slate-700"
                  }`}
              >
                {item.image && (
                  <img
                    key="image"
                    src={item.image}
                    className="size-6 rounded-full object-cover"
                  />
                )}

                <span key="label" className="text-sm">{item.label}</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-400">
              Data tidak ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
};

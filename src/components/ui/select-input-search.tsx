"use client";

import { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
  image?: string;
  badges?: string[];
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
      setSelected(matchedOption ?? null);
    } else if (defaultValue && !selected) {
      const matchedOption = options.find(opt => opt.value === defaultValue);
      if (matchedOption) {
        setSelected(matchedOption);
      }
    } else if (!value && !defaultValue) {
      setSelected(null);
    }
  }, [value, defaultValue, options]);


  const boxClass = `flex items-center w-full rounded-lg border-[3px] bg-white dark:bg-slate-800 transition-all h-11 ring-1 ring-inset ring-transparent ${
    error
      ? "border-red-500"
      : open
        ? "border-primary ring-2 ring-inset ring-primary"
        : selected
          ? "border-primary"
          : "border-[#dbe0e6] dark:border-[#4b5563]"
  }`;

  const getInitials = (label: string) => {
    const words = (label || "").trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

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
      <div key="input-group" className={boxClass}>
        <div className="flex items-center justify-center pl-3.5 text-slate-400 dark:text-slate-500 shrink-0">
          <span className="material-symbols-outlined text-xl">search</span>
        </div>

        <input
          key="search-input"
          className="flex w-full flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 focus:ring-0 focus:outline-none h-full text-sm"
          placeholder={placeholder}
          value={open ? query : selected?.label || ""}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            const sanitized = e.target.value.replace(/[^a-zA-Z0-9\s'-]/g, "");
            setQuery(sanitized);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filtered.length > 0) {
              handleSelect(filtered[0]);
            } else if (e.key === "Escape") {
              setOpen(false);
              setQuery("");
            }
          }}
          autoComplete="off"
        />

        {(query || selected) && (
          <button
            type="button"
            onClick={() => {
              if (open && query) {
                setQuery("");
              } else {
                setSelected(null);
                setQuery("");
                setOpen(false);
                onChange?.("");
              }
            }}
            className="flex items-center justify-center mr-1 size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors shrink-0"
            title="Hapus pilihan"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setOpen((prev) => !prev);
            setQuery("");
          }}
          className="flex items-center justify-center mr-2 text-slate-400 shrink-0"
          title="Buka daftar"
        >
          <span className={`material-symbols-outlined text-xl transition-transform ${open ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>
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

                {item.badges && item.badges.length > 0 && (
                  <span key="badges" className="flex items-center gap-1 ml-auto shrink-0">
                    {item.badges.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-semibold whitespace-nowrap"
                      >
                        {b}
                      </span>
                    ))}
                  </span>
                )}
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";

export interface RentalFilters {
  dateRange: string;
  driver: string;
}

interface RentalHistoryFiltersProps {
  onClearFilters?: () => void;
  onExport?: () => void;
  onFilterChange?: (filters: RentalFilters) => void;
}

export function RentalHistoryFilters({
  onClearFilters,
  onExport,
  onFilterChange,
}: RentalHistoryFiltersProps) {
  const [dateRange, setDateRange] = useState("");
  const [driver, setDriver] = useState("");

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateRange(value);
    onFilterChange?.({ dateRange: value, driver });
  };

  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDriver(value);
    onFilterChange?.({ dateRange, driver: value });
  };

  const handleClearFilters = () => {
    setDateRange("");
    setDriver("");
    onClearFilters?.();
  };

  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          icon="calendar_month"
          placeholder="Select date range"
          type="date"
          value={dateRange}
          onChange={handleDateRangeChange}
          className="w-56"
        />
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none z-10">
            person_search
          </span>
          <select
            className="w-56 rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] pl-10 pr-10 py-2.5 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary focus:border-transparent appearance-none transition-all"
            value={driver}
            onChange={handleDriverChange}
          >
            <option value="">All Drivers</option>
            <option value="Budi Santoso">Budi Santoso</option>
            <option value="Siti Aminah">Siti Aminah</option>
            <option value="Dedi Kurniawan">Dedi Kurniawan</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">
            expand_more
          </span>
        </div>
        <button
          className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors px-2"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={onExport} icon="download">
          Export
        </Button>
      </div>
    </div>
  );
}

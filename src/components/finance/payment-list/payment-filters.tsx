// components/finance/payment-list/PaymentFilters.tsx (simple version)
'use client';

import { useState } from 'react';

interface PaymentFiltersProps {
  onSearch?: (value: string) => void;
  onFilterClick?: (filterName: string) => void;
  searchPlaceholder?: string;
}

export default function PaymentFilters({
  onSearch,
  onFilterClick,
  searchPlaceholder = "Search Invoice # or Customer...",
}: PaymentFiltersProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <div className="p-4 border-b border-[#dbe0e6] dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex flex-wrap lg:flex-nowrap gap-4 items-center justify-between">
      {/* Search */}
      <div className="w-full lg:w-96">
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-600 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
          <span className="material-symbols-outlined text-[#617589] dark:text-gray-400">
            search
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-transparent border-none p-0 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:ring-0 focus:outline-none"
            placeholder={searchPlaceholder}
          />
        </label>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => onFilterClick?.('dateRange')}
          className="flex h-9 items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-600 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-[#111418] dark:text-gray-200 text-sm font-medium">Date Range</span>
          <span className="material-symbols-outlined text-base text-[#617589]">
            keyboard_arrow_down
          </span>
        </button>
        
        <button
          onClick={() => onFilterClick?.('status')}
          className="flex h-9 items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-600 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-[#ffffff] dark:text-gray-200 text-sm font-medium">Status: All</span>
          <span className="material-symbols-outlined text-base text-[#617589]">
            keyboard_arrow_down
          </span>
        </button>
        
        <button
          onClick={() => onFilterClick?.('vehicleType')}
          className="flex h-9 items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-600 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-[#f5f7fa] dark:text-gray-200 text-sm font-medium">Vehicle Type</span>
          <span className="material-symbols-outlined text-base text-[#617589]">
            keyboard_arrow_down
          </span>
        </button>
      </div>
    </div>
  );
}
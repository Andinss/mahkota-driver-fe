"use client";

import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

interface FiltersSearchProps {
  searchValue: string;
  rentalDuration: string;
  rentalService: string;
  onSearchChange: (value: string) => void;
  onRentalDurationChange: (value: string) => void;
  onRentalServiceChange: (value: string) => void;
}

export const FiltersSearch = ({
  searchValue,
  rentalDuration,
  rentalService,
  onSearchChange,
  onRentalDurationChange,
  onRentalServiceChange,
}: FiltersSearchProps) => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchInput
          className="w-full md:max-w-md"
          placeholder="Search by ID, Driver or Vehicle..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Select
            id="filter-duration"
            label=""
            className="min-w-[160px]"
            value={rentalDuration}
            onChange={(e) => onRentalDurationChange(e.target.value)}
          >
            <option value="">All Durations</option>
            <option value="harian">Harian</option>
            <option value="mingguan">Mingguan</option>
            <option value="bulanan">Bulanan</option>
            <option value="tahunan">Tahunan</option>
          </Select>
          <Select
            id="filter-service"
            label=""
            className="min-w-[160px]"
            value={rentalService}
            onChange={(e) => onRentalServiceChange(e.target.value)}
          >
            <option value="">All Services</option>
            <option value="lepas kunci">Lepas Kunci</option>
            <option value="pakai supir">Pakai Supir</option>
          </Select>
        </div>
      </div>
    </div>
  );
};
"use client";

import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

export interface MembershipFilters {
  search: string;
  status: string;
}

interface SearchBarMembershipProps {
  filters: MembershipFilters;
  onFilterChange: (filters: MembershipFilters) => void;
}

export const SearchBarMembership = ({
  filters,
  onFilterChange,
}: SearchBarMembershipProps) => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchInput
          className="w-full md:max-w-md"
          placeholder="Search by membership name..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <Select
            id="filter-status"
            className="min-w-[160px]"
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import Link from "next/link";

export interface UserFilters {
  search: string;
  role: string;
  status: string;
}

interface SearchBarProps {
  filters: UserFilters;
  onFilterChange: (filters: UserFilters) => void;
}

const SearchBar = ({ filters, onFilterChange }: SearchBarProps) => {
  return (
    <div className="flex-1 overflow-y-auto mt-5">
      <div className="flex flex-wrap items-end gap-4 mb-6 bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-[#dbe0e6] dark:border-gray-700 shadow-sm">
        <label className="flex flex-col min-w-64 flex-1">
          <p className="text-[#111418] dark:text-gray-300 text-sm font-semibold leading-normal pb-2">
            Search Users
          </p>
          <div className="relative">
            <SearchInput
              className="w-full md:max-w-md"
              placeholder="Search by name, email, or ID..."
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
            />
          </div>
        </label>
        <label className="flex flex-col w-48">
          <p className="text-[#111418] dark:text-gray-300 text-sm font-semibold leading-normal pb-2">
            Role
          </p>
          <div className="relative">
            <Select
              value={filters.role}
              onChange={(e) =>
                onFilterChange({ ...filters, role: e.target.value })
              }
            >
              <option value="">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="manager">Fleet Manager</option>
              <option value="staff">Staff</option>
              <option value="driver">Driver</option>
            </Select>
          </div>
        </label>
        <label className="flex flex-col w-48">
          <p className="text-[#111418] dark:text-gray-300 text-sm font-semibold leading-normal pb-2">
            Status
          </p>
          <div className="relative">
            <Select
              value={filters.status}
              onChange={(e) =>
                onFilterChange({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="locked">Locked</option>
            </Select>
          </div>
        </label>
        <Link href="/dashboard/roles" className="mb-0.5">
          <Button>Roles and Permission</Button>
        </Link>
      </div>
    </div>
  );
};
export default SearchBar;

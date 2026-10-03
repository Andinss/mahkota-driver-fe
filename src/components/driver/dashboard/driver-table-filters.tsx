
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

export interface DriverFilters {
  search: string;
  status: "true" | "false" | "all";
}

interface DriverTableFiltersProps {
  filters: DriverFilters;
  onFilterChange: (filters: DriverFilters) => void;
}

export function DriverTableFilters({
  filters,
  onFilterChange,
}: DriverTableFiltersProps) {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchInput
          className="w-full md:max-w-md"
          id="driverSearch"
          name="driverSearch"
          placeholder="Search by name, ID, or phone..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
        />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <Select
            id="filter-driver-status"
            className="min-w-[160px]"
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value as DriverFilters["status"],
              })
            }
          >
            <option value="all">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </div>
      </div>
    </div>
  );
}

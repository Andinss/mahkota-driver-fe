import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { IconButton } from "@/components/ui/icon-button";

export interface DriverFilters {
  search: string;
  performance: string;
  status: string;
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
    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="relative w-full md:w-96">
        <Input
          id="driverSearch"
          name="driverSearch"
          placeholder="Search by name, ID, or phone..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="pl-10"
        />
        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl leading-none pointer-events-none">
          search
        </span>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <Select
          id="performance"
          name="performance"
          value={filters.performance}
          onChange={(e) =>
            onFilterChange({ ...filters, performance: e.target.value })
          }
        >
          <option>Performance: All</option>
          <option>Top Performer</option>
          <option>Average</option>
          <option>Needs Improvement</option>
        </Select>
        <Select
          id="status"
          name="status"
          value={filters.status}
          onChange={(e) =>
            onFilterChange({ ...filters, status: e.target.value })
          }
        >
          <option>All Statuses</option>
          <option>Active</option>
          <option>On Leave</option>
          <option>Inactive</option>
        </Select>
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { IconButton } from "@/components/ui/icon-button";

export interface VehicleHistoryFilters {
  search: string;
  status: string;
}

interface VehicleHistoryFiltersProps {
  filters: VehicleHistoryFilters;
  onFilterChange: (filters: VehicleHistoryFilters) => void;
}

export function VehicleHistoryFilters({
  filters,
  onFilterChange,
}: VehicleHistoryFiltersProps) {
  return (
    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="relative w-full md:w-96">
        <Input
          id="vehicleSearch"
          name="vehicleSearch"
          placeholder="Search vehicle or plate number..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="pl-10"
        />
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
          search
        </span>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Select
          id="status"
          name="status"
          value={filters.status}
          onChange={(e) =>
            onFilterChange({ ...filters, status: e.target.value })
          }
          className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl"
        >
          <option>All Status</option>
          <option>Current</option>
          <option>Previous</option>
        </Select>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[18px]">
            filter_list
          </span>
          More Filters
        </button>
      </div>
    </div>
  );
}

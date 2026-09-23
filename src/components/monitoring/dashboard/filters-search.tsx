import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

interface MonitoringFiltersProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  statusValue?: string;
  onStatusChange?: (value: string) => void;
}

export const MonitoringFilters = ({
  searchValue = "",
  onSearchChange,
  statusValue = "",
  onStatusChange,
}: MonitoringFiltersProps) => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchInput
          className="flex-1"
          placeholder="Cari nama mobil, plat, atau vendor..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
        <div className="flex gap-3">
          <Select
            id="filter-status"
            label=""
            className="min-w-[160px]"
            value={statusValue}
            onChange={(e) => onStatusChange?.(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="emergency">Darurat</option>
            <option value="moving">Bergerak</option>
            <option value="idle">Idle</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

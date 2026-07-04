import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

interface AuditLogFiltersProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const AuditLogFilters = ({ searchValue = "", onSearchChange }: AuditLogFiltersProps) => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchInput
          className="flex-1"
          placeholder="Search by user, action, or target entity..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
        <div className="flex gap-3">
          <Select
            id="filter-date"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">Date Range</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </Select>
          <Select
            id="filter-action"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">All Actions</option>
            <option value="user">User Management</option>
            <option value="system">System Config</option>
            <option value="security">Security</option>
          </Select>
          <Select
            id="filter-status"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </Select>
        </div>
      </div>
    </div>
  );
};
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

export interface FinanceFilterSelect {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

interface FinanceTabFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selects?: FinanceFilterSelect[];
}

export const FinanceTabFilters = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  selects = [],
}: FinanceTabFiltersProps) => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchInput
          className="w-full md:max-w-md"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {selects.length > 0 && (
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {selects.map((select) => (
              <Select
                key={select.id}
                id={select.id}
                label=""
                className="min-w-[150px]"
                value={select.value}
                onChange={(e) => select.onChange(e.target.value)}
              >
                {select.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

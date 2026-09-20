import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
export const SearchFilters = () => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchInput
          className="w-full md:max-w-md"
          placeholder="Search by license plate, make, or model..."
        />
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Select
            id="filter-status"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="rented">Rented</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Service">Service</option>
            <option value="retrieved">Retrieved</option>
          </Select>
          <Select
            id="filter-type"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">All Types</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

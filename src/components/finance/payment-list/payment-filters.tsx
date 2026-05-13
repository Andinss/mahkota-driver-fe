import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

export const PaymentFilters = () => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchInput
          className="w-full md:max-w-md"
          placeholder="Search Invoice # or Customer..."
        />
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Select
            id="filter-status"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">Date Range</option>
            <option value="today">Today</option>        
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option> 
            <option value="last_month">Last Month</option>
          </Select>
          <Select
            id="filter-type"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">Status: All</option>
            <option value="paid">Paid</option>
            <option value="pending_review">Pending Review</option>
            <option value="late">Late</option> 
          </Select>
          
          <Select
            id="filter-type"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">Vehicle Type</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="minivan">Minivan</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

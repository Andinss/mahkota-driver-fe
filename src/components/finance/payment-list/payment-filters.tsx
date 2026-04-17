import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

export const PaymentFilters = () => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchInput
          className="w-full md:max-w-md"
          placeholder=""
        />
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Select
            id="filter-status"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">All Drivers</option>
            <option value="available">Internal</option>
            <option value="rented">Customer</option>
          </Select>
          <Select
            id="filter-type"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">All Status</option>
            <option value="sedan">Paid</option>
            <option value="suv">Pending</option>
            <option value="truck">Overdue</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

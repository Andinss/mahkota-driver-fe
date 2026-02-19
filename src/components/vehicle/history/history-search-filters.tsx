import { Select } from "@/components/ui/select";

export const HistorySearchFilters = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-[#1a2634] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3b4d] p-4 gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <label className="relative block w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="material-symbols-outlined text-[#617589]">search</span>
            </span>
            <input
              className="w-full rounded-lg border-0 bg-[#f0f2f4] dark:bg-[#111a22] text-[#111418] dark:text-white py-2.5 pl-10 pr-4 text-sm placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-primary transition-shadow"
              placeholder="Search by plate number, model, or driver name..."
              type="text"
            />
          </label>
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Select label="Date Range" id="history-date-range">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </Select>
          <Select label="Status" id="history-status">
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </Select>
          <Select label="Vehicle Type" id="history-vehicle-type">
            <option value="all">All Types</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="luxury">Luxury</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

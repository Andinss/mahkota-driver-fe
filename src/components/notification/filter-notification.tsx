import React from "react";

interface FilterNotifProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterNotif = ({ activeFilter, onFilterChange }: FilterNotifProps) => {
  const filters = [
    { key: "all", label: "All Notifications" },
    { key: "emergency", label: "Emergency" },
    { key: "payment", label: "Late Payments" },
    { key: "system", label: "System Updates" },
    { key: "security", label: "Security" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-tight transition-all ${
            activeFilter === filter.key
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterNotif;

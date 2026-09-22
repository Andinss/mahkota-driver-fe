"use client";

import { useState, useMemo } from "react";
import { VehicleHistoryCard, type VehicleHistory } from "./vehicle-history-card";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

export type { VehicleHistory } from "./vehicle-history-card";

interface VehicleHistoryListProps {
  vehicles: VehicleHistory[];
}

const ITEMS_PER_PAGE = 6;

export function VehicleHistoryList({ vehicles }: VehicleHistoryListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  /* Filter */
  const filtered = useMemo(() => {
    return vehicles
      .filter((v) => {
        if (selectedStatus !== "all" && v.status.toLowerCase() !== selectedStatus) return false;
        if (search) {
          const q = search.toLowerCase();
          const match =
            v.name.toLowerCase().includes(q) ||
            v.plateNumber.toLowerCase().includes(q) ||
            v.rentalNumber.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
  }, [vehicles, selectedStatus, search]);

  /* Visible items (load more) */
  const visibleItems = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  /* Reset visible count saat filter berubah */
  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const isFiltered = selectedStatus !== "all" || search !== "";

  return (
    <div>
      {/* Filter Bar */}
      <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm mb-5">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <SearchInput
            className="w-full md:max-w-md"
            placeholder="Search vehicle, plate, or rental number..."
            value={search}
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
          />

          {/* Filters */}
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Select
              id="filter-status"
              label=""
              className="min-w-[140px]"
              value={selectedStatus}
              onChange={(e) => handleFilterChange(setSelectedStatus)(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="current">Current</option>
              <option value="previous">Previous</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{visibleItems.length}</span> of{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> vehicles
        </p>
      </div>

      {/* Body */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-slate-400 text-4xl">
              {isFiltered ? "search_off" : "directions_car"}
            </span>
          </div>
          <p className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1">
            {isFiltered ? "No matching vehicles" : "No vehicle history yet"}
          </p>
          <p className="text-sm text-slate-400">
            {isFiltered ? "Try adjusting your filters" : "Vehicle history will appear here"}
          </p>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleItems.map((item) => (
              <VehicleHistoryCard key={item.id} vehicle={item} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-base">expand_more</span>
                Load More ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
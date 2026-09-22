"use client";

import { useState, useMemo } from "react";
import type { HistorySetoran } from "@/lib/types/history";
import { DepositHistoryCard } from "./deposit-history-card";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

interface DepositHistoryListProps {
  history: HistorySetoran[];
}

const ITEMS_PER_PAGE = 6;

export function DepositHistoryList({ history }: DepositHistoryListProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  /* Month options */
  const monthOptions = useMemo(() => {
    const months = new Set<string>();
    history.forEach((h) => {
      const d = new Date(h.payment_date);
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });
    return Array.from(months).sort().reverse();
  }, [history]);

  /* Filter */
  const filtered = useMemo(() => {
    return history
      .filter((h) => {
        if (selectedMonth !== "all") {
          const d = new Date(h.payment_date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          if (key !== selectedMonth) return false;
        }
        if (selectedStatus !== "all" && h.finance_type !== selectedStatus) return false;
        if (selectedMethod !== "all" && h.payment_method !== selectedMethod) return false;
        if (search && !h.reference_number.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
  }, [history, selectedMonth, selectedStatus, selectedMethod, search]);

  /* Visible items (load more) */
  const visibleItems = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  /* Reset visible count saat filter berubah */
  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const isFiltered = selectedMonth !== "all" || selectedStatus !== "all" || selectedMethod !== "all" || search !== "";

  return (
    <div>
      {/* Filter Bar */}
      <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm mb-5">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <SearchInput
            className="w-full md:max-w-md"
            placeholder="Search by reference number..."
            value={search}
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
          />

          {/* Filters */}
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Select
              id="filter-month"
              label=""
              className="min-w-[160px]"
              value={selectedMonth}
              onChange={(e) => handleFilterChange(setSelectedMonth)(e.target.value)}
            >
              <option value="all">All Months</option>
              {monthOptions.map((m) => {
                const [year, month] = m.split("-");
                const label = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                });
                return <option key={m} value={m}>{label}</option>;
              })}
            </Select>

            <Select
              id="filter-method"
              label=""
              className="min-w-[150px]"
              value={selectedMethod}
              onChange={(e) => handleFilterChange(setSelectedMethod)(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              <option value="e-wallet">E-Wallet</option>
              <option value="saldo">Koin</option>
            </Select>

            <Select
              id="filter-status"
              label=""
              className="min-w-[140px]"
              value={selectedStatus}
              onChange={(e) => handleFilterChange(setSelectedStatus)(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="unpaid">Unpaid</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{visibleItems.length}</span> of{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> transactions
        </p>
      </div>

      {/* Body */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-slate-400 text-4xl">
              {isFiltered ? "search_off" : "receipt_long"}
            </span>
          </div>
          <p className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1">
            {isFiltered ? "No matching transactions" : "No transactions yet"}
          </p>
          <p className="text-sm text-slate-400">
            {isFiltered ? "Try adjusting your filters" : "Deposit history will appear here"}
          </p>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleItems.map((item) => (
              <DepositHistoryCard key={item.id} item={item} />
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
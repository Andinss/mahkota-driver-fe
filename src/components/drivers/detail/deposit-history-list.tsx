"use client";

import { useState, useMemo } from "react";
import type { HistorySetoran } from "@/lib/types/history";
import { DepositHistoryRow } from "./deposit-history-row";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";

interface DepositHistoryListProps {
  history: HistorySetoran[];
}

const DEFAULT_PAGE_SIZE = 10;

export function DepositHistoryList({ history }: DepositHistoryListProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const filtered = useMemo(() => {
    return history
      .filter((h) => {
        if (selectedMethod !== "all" && h.payment_method !== selectedMethod) return false;
        if (selectedStatus !== "all" && h.finance_type !== selectedStatus) return false;
        if (search) {
          const q = search.toLowerCase();
          const match =
            h.reference_number.toLowerCase().includes(q) ||
            (h.rental_number?.toLowerCase().includes(q) ?? false);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
  }, [history, selectedMethod, selectedStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  );

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const isFiltered = selectedMethod !== "all" || selectedStatus !== "all" || search !== "";

  return (
    <div className="space-y-5">
      {/* Filter Bar — Section Terpisah */}
      <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <SearchInput
            className="w-full md:max-w-md"
            placeholder="Search reference or rental number..."
            value={search}
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
          />
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
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

      {/* Table Card — Section Terpisah */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-500 text-xl">
                payments
              </span>
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white text-base">
                Daily Payment History
              </h2>
              <p className="text-xs text-slate-400">
                {filtered.length} transaksi
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-slate-400 text-4xl">
                {isFiltered ? "search_off" : "receipt_long"}
              </span>
            </div>
            <p className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {isFiltered ? "No matching transactions" : "No transactions yet"}
            </p>
            <p className="text-sm text-slate-400">
              {isFiltered ? "Try adjusting your filters" : "Daily payment history will appear here"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Metode</th>
                    <th className="px-6 py-4">Jumlah</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Rental</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {paged.map((item) => (
                    <DepositHistoryRow key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalResults={filtered.length}
              resultsPerPage={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showPageSize
            />
          </>
        )}
      </div>
    </div>
  );
}
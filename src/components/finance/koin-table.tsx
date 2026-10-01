"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/components/ui/pagination";
import { KoinTransaction } from "@/lib/types/koin";

interface KoinTableProps {
  transactions: KoinTransaction[];
  onBuatTopUp?: () => void;
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const typeLabel: Record<string, string> = {
  top_up: "Top Up",
  rental_payment: "Pembayaran Rental",
  refund: "Refund",
  withdrawal: "Penarikan",
};

/* Warna badge per tipe */
const typeColor: Record<string, string> = {
  top_up: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  rental_payment: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  refund: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  withdrawal: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const getTypeColor = (type: string): string => {
  return typeColor[type] || typeColor.withdrawal;
};

export const KoinTable = ({ transactions, onBuatTopUp }: KoinTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalResults = transactions.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const startEntry = totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalResults);

  const paginatedTransactions = transactions.slice(startEntry - 1, endEntry);

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  if (totalResults === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        <span className="material-symbols-outlined text-4xl mb-2 block">
          account_balance_wallet
        </span>
        <p>Belum ada transaksi Koin</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-3">No. Referensi</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3 text-right">Jumlah</th>
              <th className="px-4 py-3">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {paginatedTransactions.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px] block">
                    {item.reference_number || "-"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                    {item.driver_name || "-"}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getTypeColor(
                      item.type,
                    )}`}
                  >
                    {typeLabel[item.type] || item.type}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-right font-bold whitespace-nowrap ${
                    item.type === "top_up" || item.type === "refund"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.type === "top_up" || item.type === "refund" ? "+" : "-"} Rp{" "}
                  {Number(item.amount).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {formatDateTime(item.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          resultsPerPage={itemsPerPage}
          onPageChange={goToPage}
          onPageSizeChange={handleItemsPerPageChange}
        />
      </div>
    </>
  );
};
"use client";

import { useState } from "react";
import { KoinTransaction } from "@/lib/types/koin";

interface KoinTableProps {
  transactions: KoinTransaction[];
  onBuatTopUp?: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const typeLabel: Record<string, string> = {
  top_up: "Top Up",
  rental_payment: "Pembayaran Rental",
  refund: "Refund",
  withdrawal: "Penarikan",
};

export const KoinTable = ({ transactions, onBuatTopUp }: KoinTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalResults = transactions.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startEntry = totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalResults);

  const paginatedTransactions = transactions.slice(startEntry - 1, endEntry);

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
        <span className="material-symbols-outlined text-4xl mb-2 block">account_balance_wallet</span>
        <p>Belum ada transaksi Koin</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">No. Referensi</th>
              <th className="px-6 py-4">Driver</th>
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4 text-right">Jumlah</th>
              <th className="px-6 py-4">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {paginatedTransactions.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  {item.reference_number || "-"}
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {item.driver_name || "-"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      item.type === "top_up"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : item.type === "rental_payment"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : item.type === "refund"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                    }`}
                  >
                    {typeLabel[item.type] || item.type}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-right font-medium ${
                    item.type === "top_up" || item.type === "refund"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.type === "top_up" || item.type === "refund" ? "+" : "-"} Rp {Number(item.amount).toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                  {formatDate(item.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">Tampilkan</p>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <p className="text-sm text-slate-500 dark:text-slate-400">data</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 ml-2">
              Menampilkan <span className="font-bold text-slate-900 dark:text-white">{startEntry}</span> - <span className="font-bold text-slate-900 dark:text-white">{endEntry}</span> dari <span className="font-bold text-slate-900 dark:text-white">{totalResults}</span> data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                currentPage === 1
                  ? "text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              }`}
            >
              Sebelumnya
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                currentPage === totalPages
                  ? "text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              }`}
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </>
  );
};
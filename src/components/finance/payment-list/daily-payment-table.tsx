"use client";

import { useState } from "react";
import type { DailyPaymentItem } from "@/lib/types/finances";

interface DailyPaymentTableProps {
  payments: DailyPaymentItem[];
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

const statusColor: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabel: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  pending: "Pending",
};

export const DailyPaymentTable = ({ payments }: DailyPaymentTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalResults = payments.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startEntry = totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalResults);

  const paginatedPayments = payments.slice(startEntry - 1, endEntry);

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
        <span className="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
        <p>Belum ada tagihan hari ini</p>
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
              <th className="px-6 py-4">Kendaraan</th>
              <th className="px-6 py-4">Plat Nomor</th>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Rental</th>
              <th className="px-6 py-4">Jumlah</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tanggal Dibuat</th>
              <th className="px-6 py-4">Tanggal Bayar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {paginatedPayments.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  {item.reference_number}
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {item.driver_name}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {item.vehicle_name}
                  </p>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  {item.license_plate}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {item.vendor_name || "-"}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  {item.rental_number}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.amount)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[item.status] || "bg-slate-100 text-slate-700"}`}>
                    {statusLabel[item.status] || item.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                  {formatDate(item.created_at)}
                </td>
              <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                {item.status === "paid" && item.payment_date ? formatDate(item.payment_date) : "-"}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        {totalPages > 1 && (
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
        )}
      </div>
    </>
  );
};

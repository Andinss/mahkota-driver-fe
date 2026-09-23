"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/components/ui/pagination";
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
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const startEntry = totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalResults);

  const paginatedPayments = payments.slice(startEntry - 1, endEntry);

  useEffect(() => {
    setCurrentPage(1);
  }, [payments]);

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
                  {formatDateTime(item.created_at)}
                </td>
              <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                {item.status === "paid" && item.payment_date ? formatDateTime(item.payment_date) : "-"}
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

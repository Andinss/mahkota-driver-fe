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

const formatDateOnly = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatTimeOnly = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const statusColor: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  unpaid: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
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
      {/* Header Card */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">
              receipt_long
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Daily Payment
            </h2>
            <p className="text-xs text-slate-400">
              {totalResults} tagihan tercatat
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      {totalResults === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            receipt_long
          </span>
          <p>Belum ada tagihan hari ini</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Driver / Plat</th>
                  <th className="px-4 py-3">Kendaraan / Vendor</th>
                  <th className="px-4 py-3">Status / Ref</th>
                  <th className="px-4 py-3">Rental</th>
                  <th className="px-4 py-3">Jumlah</th>
                  <th className="px-4 py-3">Dibuat</th>
                  <th className="px-4 py-3">Dibayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {paginatedPayments.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Driver + Plat */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                        {item.driver_name}
                      </p>
                      <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[180px]">
                        {item.license_plate}
                      </p>
                    </td>

                    {/* Kendaraan + Vendor */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]">
                        {item.vehicle_name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[180px]">
                        {item.vendor_name || "-"}
                      </p>
                    </td>

                    {/* Status + Reference */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          statusColor[item.status] ||
                          "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {statusLabel[item.status] || item.status}
                      </span>
                      <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[140px]">
                        {item.reference_number}
                      </p>
                    </td>

                    {/* Rental */}
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                      {item.rental_number}
                    </td>

                    {/* Jumlah */}
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </td>

                    {/* Tanggal Dibuat — 2 baris */}
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {formatDateOnly(item.created_at)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatTimeOnly(item.created_at)}
                      </p>
                    </td>

                    {/* Tanggal Bayar — 2 baris */}
                    <td className="px-4 py-3">
                      {item.status === "paid" ? (
                        <>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {formatDateOnly(item.updated_at)}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {formatTimeOnly(item.updated_at)}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-slate-400">-</p>
                      )}
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
      )}
    </>
  );
};
"use client";

import { useState } from "react";
import { PaymentTableRow } from "./payment-table-row";
import { ModalExport } from "@/components/ui/export";
import type { ExportColumn, ExportOptions } from "@/components/ui/export";
import Link from "next/link";
import type { FinanceItem } from "@/lib/types/finances";

interface PaymentTableProps {
  payment: FinanceItem[];
  onValidate?: (payment: FinanceItem) => void;
  onDetails?: (payment: FinanceItem) => void;
  onDownload?: (payment: FinanceItem) => void;
  onEdit?: (payment: FinanceItem) => void;
  onDelete?: (payment: FinanceItem) => void;
  onExport?: (options: ExportOptions) => void;
}

const paymentColumns: ExportColumn[] = [
  { id: "reference_number", label: "Reference Number", defaultChecked: true },
  { id: "payer", label: "Payer", defaultChecked: true },
  { id: "vehicle", label: "Mobil", defaultChecked: true },
  { id: "vendor", label: "Vendor", defaultChecked: true },
  { id: "amount_received", label: "Dibayar", defaultChecked: true },
  { id: "remaining_amount", label: "Sisa Tagihan", defaultChecked: true },
  { id: "rental_period", label: "Rental Period", defaultChecked: true },
  { id: "payment_date", label: "Payment Date", defaultChecked: true },
  { id: "created_at", label: "Tanggal Dibuat", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
  { id: "payment_method", label: "Payment Method", defaultChecked: true },
  { id: "fee_admin_join", label: "Admin Fee Join", defaultChecked: true },
];

export function PaymentTable({
  payment,
  onValidate,
  onDetails,
  onDownload,
  onEdit,
  onDelete,
  onExport,
}: PaymentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const itemsPerPage = 10;

  const totalResults = payment.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalResults);

  const paginatedPayment = payment.slice(startEntry - 1, endEntry);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">payments</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Finance Management
            </h2>
            <p className="text-xs text-slate-400">{payment.length} transaksi tercatat</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/finances/late"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <span className="material-symbols-outlined text-base">warning</span>
            Late Payment
          </Link>
          <Link
            href="/dashboard/finances/koin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            Koin
          </Link>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Reference Number</th>
              <th className="px-6 py-4">Payer</th>
              <th className="px-6 py-4">Mobil</th>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Total Tagihan</th>
              <th className="px-6 py-4">Dibayar</th>
              <th className="px-6 py-4">Sisa Tagihan</th>
              <th className="px-6 py-4">Deposit</th>
              <th className="px-6 py-4">Rental Period</th>
              <th className="px-6 py-4">Payment Date</th>
              <th className="px-6 py-4">Tanggal Dibuat</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {paginatedPayment.map((item, index) => (
              <PaymentTableRow
                key={item.id || index}
                payment={item}
                onValidate={onValidate}
                onDetails={onDetails}
                onDownload={onDownload}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Menampilkan <span className="font-bold text-slate-900 dark:text-white">{startEntry}</span> - <span className="font-bold text-slate-900 dark:text-white">{endEntry}</span> dari <span className="font-bold text-slate-900 dark:text-white">{totalResults}</span> data
          </p>
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
      <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          setIsExportModalOpen(false);
          onExport?.(options);
        }}
        totalRows={payment.length}
        title="Export Payment Data"
        description="Generate payment reports."
        columns={paymentColumns}
      />
    </>
  );
}

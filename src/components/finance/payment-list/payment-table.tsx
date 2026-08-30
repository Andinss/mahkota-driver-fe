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
  { id: "amount_received", label: "Amount Received", defaultChecked: true },
  { id: "payment_date", label: "Payment Date", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
  { id: "payment_method", label: "Payment Method", defaultChecked: true },
  { id: "notes", label: "Notes", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
  { id: "finance_type", label: "Finance Type", defaultChecked: false },
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
    <div>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Finance Management
        </h2>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/finance/late"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <span className="material-symbols-outlined text-base">warning</span>
            Late Payment
          </Link>
          <Link
            href="/dashboard/finance/saldo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            Saldo
          </Link>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <span className="material-symbols-outlined text-base">
              download
            </span>
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto ">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Reference Number</th>
              <th className="px-6 py-4">Payer</th>
              <th className="px-6 py-4">Amount Received</th>
              <th className="px-6 py-4">Payment Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-2 py-4">Method</th>
              <th className="px-6 py-4">Notes</th>
              <th className="px-2 py-4">Active</th>
              <th className="pe-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
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
    </div>
  );
}

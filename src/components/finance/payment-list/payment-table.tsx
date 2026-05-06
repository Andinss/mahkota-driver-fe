"use client";

import { useState } from "react";
import { PaymentTableRow } from "./payment-table-row";
import { ModalExport } from "@/components/ui/export";
import type { ExportColumn, ExportOptions } from "@/components/ui/export";
import Link from "next/link";

interface Payment {
  invoiceId: string;
  customer: {
    name: string;
    avatar?: string;
  };
  vehicle: {
    plate: string;
  };
  amount: string;
  dueDate: string;
  status: "Late" | "Pending Review" | "Paid";
  method: string;
}

interface PaymentTableProps {
  payment: Payment[];
  onValidate?: (payment: Payment) => void;
  onDetails?: (payment: Payment) => void;
  onDownload?: (payment: Payment) => void;
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
  onExport?: (options: ExportOptions) => void;
}

const paymentColumns: ExportColumn[] = [
  { id: "invoiceId", label: "Invoice ID", defaultChecked: true },
  { id: "customerName", label: "Customer Name", defaultChecked: true },
  { id: "vehiclePlate", label: "Vehicle Plate", defaultChecked: true },
  { id: "amount", label: "Amount", defaultChecked: true },
  { id: "dueDate", label: "Due Date", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
  { id: "method", label: "Payment Method", defaultChecked: true },
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
  const itemsPerPage = 5;

  const totalResults = payment.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalResults);

  const paginatedPayment = payment.slice(startEntry - 1, endEntry);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (totalResults === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          No payment data available
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Finance Dashboard
        </h2>
        <div className="flex items-center gap-3">
        {/* Button Late Payment */}
        <Link
          href="/dashboard/finance/late"
          className="text-red-600 dark:text-red-400 text-sm font-medium hover:underline transition-colors">
          Late Payment
        </Link>
        {/* Button Export Data */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
          Export Data
        </button>
      </div>
      <div>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Customer Name</th>
              <th className="px-6 py-4">Vehicle Plate</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-2 py-4">Method</th>
              <th className="pe-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {paginatedPayment.map((item, index) => (
              <PaymentTableRow
                key={item.invoiceId || index}
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

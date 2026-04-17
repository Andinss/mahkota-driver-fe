
'use client';

import { useState } from 'react';
import { PaymentTableRow } from './payment-table-row';

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
  status: 'Late' | 'Pending Review' | 'Paid';
  method: string;
}

interface PaymentTableProps {
  payment: Payment[];
  onValidate?: (payment: Payment) => void;
  onDetails?: (payment: Payment) => void;
  onDownload?: (payment: Payment) => void;
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}

export function PaymentTable({
  payment,
  onValidate,
  onDetails,
  onDownload,
  onEdit,
  onDelete,
}: PaymentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
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
      <div className="bg-surface-light dark:bg-surface-dark border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden p-8 text-center">
        <p className="text-[#617589] dark:text-gray-400">No payment data available</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      {/* Table */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Finance Dashboard
        </h2>
        <button
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
        >
          Export as CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-[#617589] dark:text-gray-400 font-medium border-b border-[#dbe0e6] dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Customer Name</th>
              <th className="px-6 py-4">Vehicle Plate</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dbe0e6] dark:divide-gray-700">
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

      {/* Pagination */}
      {totalResults > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {startEntry} to {endEntry} of {totalResults} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              disabled={currentPage === 1}
            >
              <span className="material-symbols-outlined text-sm text-slate-500">chevron_left</span>
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              disabled={currentPage === totalPages}
            >
              <span className="material-symbols-outlined text-sm text-slate-500">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
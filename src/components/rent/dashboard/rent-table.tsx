import { useState } from "react";
import { RentalTableRow } from "./rent-table-row";
import { ModalExport, ExportOptions, ExportColumn } from "@/components/ui/export";

interface Rental {
  transactionId: string;
  driver: {
    name: string;
    id: string;
    avatar?: string;
  };
  vehicle: {
    name: string;
    id: string;
  };
  rentalPeriod: {
    start: string;
    end: string;
    duration: number;
  };
  deposit: string;
  paymentStatus: string;
}

interface RentalTableProps {
  rentals: Rental[];
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
  resultsPerPage?: number;
  onEdit?: (rental: Rental) => void;
  onDelete?: (rental: Rental) => void;
  onDetails?: (rental: Rental) => void;
  onEndRental?: (rental: Rental) => void;
  onExport?: (options: ExportOptions) => void;
}

const rentalColumns: ExportColumn[] = [
  { id: "transactionId", label: "Transaction ID", defaultChecked: true },
  { id: "driver", label: "Driver", defaultChecked: true },
  { id: "vehicle", label: "Vehicle Info", defaultChecked: true },
  { id: "rentalPeriod", label: "Rental Period", defaultChecked: true },
  { id: "deposit", label: "Deposit", defaultChecked: false },
  { id: "status", label: "Status", defaultChecked: true },
];

export const RentalTable = ({
  rentals,
  currentPage = 1,
  totalPages = 6,
  totalResults = 142,
  resultsPerPage = 4,
  onEdit,
  onDelete,
  onDetails,
  onEndRental,
  onExport,
}: RentalTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const startEntry = (currentPage - 1) * resultsPerPage + 1;
  const endEntry = Math.min(currentPage * resultsPerPage, totalResults);

  const handleExportClick = () => {
    setIsModalOpen(true);
  };

  const handleExport = (options: ExportOptions) => {
    console.log("Export options from modal:", options);
    if (onExport) {
      onExport(options);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Rental Transactions
        </h2>
        <button
          onClick={handleExportClick}
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
          Export Data
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Driver Details</th>
              <th className="px-6 py-4">Vehicle Info</th>
              <th className="px-6 py-4">Rental Period</th>
              <th className="px-6 py-4">Deposit</th>
              <th className="px-6 py-4">Payment Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {rentals.map((rental, index) => (
              <RentalTableRow
                key={rental.transactionId || index}
                rental={rental}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetails={onDetails}
                onEndRental={onEndRental}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {startEntry} to {endEntry} of {totalResults} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            disabled={currentPage === 1}
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            disabled={currentPage === totalPages}
          >
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </button>
        </div>
      </div>
      
      {/* Modal Export */}
      <ModalExport
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExport={handleExport}
        totalRows={totalResults}
        dateRange={{ start: "Oct 1, 2023", end: "Oct 31, 2023" }}
        title="Export Rental Data"
        description="Generate rental transaction reports."
        columns={rentalColumns}
      />
    </div>
  );
};
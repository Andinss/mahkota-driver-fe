import { ExportColumn, ModalExport } from "@/components/ui/export";
import { useState } from "react";
import { RentalTableRow } from "./rent-table-row";

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
  onExport?: (options?: any) => void;
}

const rentalColumns: ExportColumn[] = [
  { id: "transactionId", label: "Transaction ID", defaultChecked: true },
  { id: "driverName", label: "Driver Name", defaultChecked: true },
  { id: "driverId", label: "Driver ID", defaultChecked: true },
  { id: "vehicleName", label: "Vehicle Name", defaultChecked: true },
  { id: "vehiclePlate", label: "Vehicle Plate", defaultChecked: true },
  { id: "rentalPeriod", label: "Rental Period", defaultChecked: true },
  { id: "duration", label: "Duration (Days)", defaultChecked: true },
  { id: "deposit", label: "Deposit", defaultChecked: true },
  { id: "paymentStatus", label: "Payment Status", defaultChecked: true },
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const startEntry = (currentPage - 1) * resultsPerPage + 1;
  const endEntry = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Rental Transactions
        </h2>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined text-base">download</span>
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

      <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          setIsExportModalOpen(false);
          onExport?.(options);
        }}
        totalRows={totalResults}
        title="Export Rental Data"
        description="Generate rental transaction reports."
        columns={rentalColumns}
      />
    </div>
  );
};

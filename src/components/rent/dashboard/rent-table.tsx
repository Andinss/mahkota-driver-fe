import { ExportColumn, ExportOptions, ModalExport } from "@/components/ui/export";
import { useState } from "react";
import { RentalTableRow } from "./rent-table-row";

interface Rental {
  id: string;
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
  vehicleId?: string;
  vehicleEngineStatus?: "on" | "off";
  rentalPeriod: {
    start: string;
    end: string;
    duration: number;
  };
  rentalDuration?: string;
  rentalService?: string;
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
  onExport?: (options?: ExportOptions) => void;
  onEngineChanged?: (vehicleId: string, engineStatus: "on" | "off") => void;
}

const rentalColumns: ExportColumn[] = [
  { id: "transactionId", label: "Transaction ID", defaultChecked: true },
  { id: "driverName", label: "Driver Name", defaultChecked: true },
  { id: "driverId", label: "Driver ID", defaultChecked: true },
  { id: "vehicleName", label: "Vehicle Name", defaultChecked: true },
  { id: "vehiclePlate", label: "Vehicle Plate", defaultChecked: true },
  { id: "rentalPeriod", label: "Rental Period", defaultChecked: true },
  { id: "duration", label: "Duration (Days)", defaultChecked: true },
  { id: "rentalDuration", label: "Tipe Durasi", defaultChecked: true },
  { id: "rentalService", label: "Jenis Layanan", defaultChecked: true },
  { id: "engine", label: "Engine", defaultChecked: true },
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
  onEngineChanged,
}: RentalTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">assignment</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Rental Transactions
            </h2>
            <p className="text-xs text-slate-400">{rentals.length} transaksi aktif</p>
          </div>
        </div>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Driver Details</th>
              <th className="px-6 py-4">Vehicle Info</th>
              <th className="px-6 py-4">Rental Period</th>
              <th className="px-6 py-4">Tipe Durasi</th>
              <th className="px-6 py-4">Jenis Layanan</th>
              <th className="px-6 py-4">Engine</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {rentals.map((rental, index) => (
              <RentalTableRow
                key={rental.transactionId || index}
                rental={rental}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetails={onDetails}
                onEndRental={onEndRental}
                onEngineChanged={onEngineChanged}
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
    </>
  );
};

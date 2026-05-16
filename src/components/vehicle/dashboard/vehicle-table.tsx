import { useState } from "react";
import { VehicleTableRow } from "./vehicle-table-row";
import { ExportColumn, ModalExport } from "@/components/ui/export";

const vehicleColumns: ExportColumn[] = [
  { id: "name", label: "Car Name", defaultChecked: true},
  { id: "year", label: "Year", defaultChecked: true},
  { id: "transmission", label: "Transmission", defaultChecked: true},
  { id: "licensePlate", label: "License Plate", defaultChecked: true},
  { id: "type", label: "Type", defaultChecked: true},
  { id: "dailyRate", label: "Daily Rate", defaultChecked: true},
  { id: "status", label: "Status", defaultChecked: true},
];

interface Vehicle {
  name: string;
  year: number;
  transmission: string;
  plate: string;
  type: string;
  rate: string;
  status: "available" | "rented" | "maintenance";
  image: string;
  imageAlt: string;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onDetailsVehicle?: (vehicle: Vehicle) => void;
  onExport?: (options?: any) => void;
}

export const VehicleTable = ({
  vehicles,
  onEdit,
  onDelete,
  onDetailsVehicle,
  onExport,
}: VehicleTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  return (
    <>
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Vehicle Management
        </h2>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined text-base">download</span>
          Export
        </button>
      </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#e5e7eb] dark:border-[#2a3845] bg-[#f9fafb] dark:bg-[#111827]">
            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#94a3b8] w-[300px]">
              Vehicle
            </th>
            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#94a3b8]">
              License Plate
            </th>
            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#94a3b8]">
              Type
            </th>
            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#94a3b8]">
              Daily Rate
            </th>
            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#94a3b8]">
              Status
            </th>
            <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#94a3b8] text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5e7eb] dark:divide-[#2a3845]">
          {vehicles.map((vehicle, index) => (
            <VehicleTableRow
              key={index}
              vehicle={vehicle}
              onEdit={onEdit}
              onDelete={onDelete}
              onDetails={onDetailsVehicle}
            />
          ))}
        </tbody>
      </table>
      <ModalExport 
      isOpen={isExportModalOpen}
      onClose={() => setIsExportModalOpen(false)}
      onExport={(options) => {
        setIsExportModalOpen(false);
        onExport?.(options);
      }}
      totalRows={vehicles.length}
      title="Export Vehicle Data"
      description="Generate vehicle fleet report and status data."
      columns={vehicleColumns}
      />
    </div>
    </>
  );
};

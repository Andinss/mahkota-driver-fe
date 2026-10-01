import { useState } from "react";
import { VehicleTableRow } from "./vehicle-table-row";
import { ExportColumn, ModalExport } from "@/components/ui/export";

const vehicleColumns: ExportColumn[] = [
  { id: "name", label: "Car Name", defaultChecked: true },
  { id: "year", label: "Year", defaultChecked: true },
  { id: "licensePlate", label: "License Plate", defaultChecked: true },
  { id: "vendor", label: "Vendor", defaultChecked: true },
  { id: "device", label: "Device", defaultChecked: true },
  { id: "dailyRate", label: "Daily Rate", defaultChecked: true },
  { id: "membership", label: "Kategori Membership", defaultChecked: true },
  { id: "status", label: "Condition", defaultChecked: true },
  { id: "is_active", label: "Status", defaultChecked: true },
];

interface Vehicle {
  id?: string;
  name: string;
  year: number;
  plate: string;
  rate: string;
  membership: string;
  status: string;
  isActive?: boolean;
  image: string;
  imageAlt: string;
  vendorName: string;
  deviceName: string;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onToggleStatus?: (vehicle: Vehicle) => void;
  onDetailsVehicle?: (vehicle: Vehicle) => void;
  onExport?: (options?: any) => void;
}

export const VehicleTable = ({
  vehicles,
  onEdit,
  onDelete,
  onToggleStatus,
  onDetailsVehicle,
  onExport,
}: VehicleTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  return (
    <>
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">directions_car</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Vehicle Management
            </h2>
            <p className="text-xs text-slate-400">{vehicles.length} kendaraan terdaftar</p>
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
        <table className="w-full text-left text-sm">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-4 whitespace-nowrap">Kendaraan</th>
              <th className="px-5 py-4 whitespace-nowrap">Vendor</th>
              <th className="px-5 py-4 whitespace-nowrap">Device</th>
              <th className="px-5 py-4 whitespace-nowrap">Kategori</th>
              <th className="px-5 py-4 whitespace-nowrap">Tarif/Hari</th>
              <th className="px-5 py-4 whitespace-nowrap">Condition</th>
              <th className="px-5 py-4 whitespace-nowrap">Status</th>
              <th className="px-5 py-4 text-right whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {vehicles.map((vehicle, index) => (
              <VehicleTableRow
                key={index}
                vehicle={vehicle}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                onDetails={onDetailsVehicle}
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
        totalRows={vehicles.length}
        title="Export Vehicle Data"
        description="Generate vehicle fleet report and status data."
        columns={vehicleColumns}
      />
    </>
  );
};
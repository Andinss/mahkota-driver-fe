"use client";

import { useState } from "react";
import { VendorTableRow } from "./row-vendor";
import { ModalExport } from "@/components/ui/export";
import type { ExportColumn, ExportOptions } from "@/components/ui/export";
import type { VendorVehicle } from "@/lib/types/vendor-vehicle";

interface VendorTableProps {
  vendors: VendorVehicle[];
  totalResults?: number;
  onEdit?: (vendor: VendorVehicle) => void;
  onDelete?: (vendor: VendorVehicle) => void;
  onDetails?: (vendor: VendorVehicle) => void;
  onExport?: (options: ExportOptions) => void;
}

const vendorColumns: ExportColumn[] = [
  { id: "name", label: "Nama Vendor", defaultChecked: true },
  { id: "ownerName", label: "Nama Pemilik", defaultChecked: true },
  { id: "pendapatan", label: "Pendapatan", defaultChecked: true },
  { id: "totalKendaraan", label: "Total Kendaraan", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
  { id: "createdAt", label: "Tanggal Bergabung", defaultChecked: false },
];

export const VendorTable = ({
  vendors,
  totalResults,
  onEdit,
  onDelete,
  onDetails,
  onExport,
}: VendorTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">
              storefront
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Vendor Vehicles
            </h2>
            <p className="text-xs text-slate-400">
              {vendors.length} vendor terdaftar
            </p>
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
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Nama Vendor</th>
              <th className="px-6 py-4">Nama Pemilik</th>
              <th className="px-6 py-4">Pendapatan</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {vendors.map((vendor, index) => (
              <VendorTableRow
                key={vendor.id || index}
                vendor={vendor}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetails={onDetails}
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
        totalRows={totalResults ?? vendors.length}
        title="Export Vendor Data"
        description="Generate vendor vehicle reports."
        columns={vendorColumns}
      />
    </>
  );
};
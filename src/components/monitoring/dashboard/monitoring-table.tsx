import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExportColumn, ExportOptions, ModalExport } from "@/components/ui/export";
import { MonitoringTableRow, VehicleDisplay } from "./monitoring-table-row";
import type { GpsTrackingRecord } from "@/lib/api/monitoring";

// Dummy display data (FE only) — diganti join BE nanti
const DUMMY_VEHICLES: Record<
  string,
  { vehicle_name: string; vendor: string }
> = {
  "veh-001": { vehicle_name: "Toyota Avanza 1.3 G", vendor: "Nusantara Rental" },
  "veh-002": { vehicle_name: "Honda Brio Satya", vendor: "Mitra Jaya Trans" },
  "veh-003": { vehicle_name: "Suzuki Ertiga GX", vendor: "Bali Fleet Service" },
  "veh-004": { vehicle_name: "Mitsubishi Xpander", vendor: "Nusantara Rental" },
  "veh-005": { vehicle_name: "Daihatsu Xenia", vendor: "Sinar Motor" },
  "veh-006": { vehicle_name: "Toyota Innova Zenix", vendor: "Mitra Jaya Trans" },
};

const FALLBACK_VEHICLE: VehicleDisplay = {
  vehicle_name: "Kendaraan Armada",
  vendor: "Vendor Umum",
};

export const resolveVehicleDisplay = (
  r: GpsTrackingRecord,
): VehicleDisplay => {
  const byId = DUMMY_VEHICLES[r.VehicleId];
  if (byId) return byId;
  const byPlate = DUMMY_VEHICLES[r.VehicleNumber];
  if (byPlate) return byPlate;
  return FALLBACK_VEHICLE;
};

const monitoringColumns: ExportColumn[] = [
  { id: "vehicleName", label: "Nama Mobil", defaultChecked: true },
  { id: "plate", label: "Plat", defaultChecked: true },
  { id: "vendor", label: "Vendor", defaultChecked: true },
  { id: "location", label: "Lokasi", defaultChecked: true },
  { id: "coordinates", label: "Koordinat", defaultChecked: true },
  { id: "datetime", label: "Waktu (UTC)", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
  { id: "speed", label: "Kecepatan", defaultChecked: true },
  { id: "direction", label: "Arah", defaultChecked: true },
  { id: "odometer", label: "Odometer", defaultChecked: true },
  { id: "vehicleType", label: "Tipe", defaultChecked: true },
  { id: "alarm", label: "Alarm", defaultChecked: true },
  { id: "engine", label: "Mesin", defaultChecked: true },
];

interface MonitoringTableProps {
  records: GpsTrackingRecord[];
  totalResults?: number;
  onEngineChanged?: (vehicleId: string, engineStatus: "on" | "off") => void;
  onExport?: (options?: ExportOptions) => void;
}

export const MonitoringTable = ({
  records,
  totalResults,
  onEngineChanged,
  onExport,
}: MonitoringTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">satellite_alt</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Lokasi Armada
            </h2>
            <p className="text-xs text-slate-400">{records.length} kendaraan tercatat</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/monitorings/real-time">
            <Button icon="map">Lihat Peta</Button>
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
              <th className="px-4 py-4 whitespace-nowrap">Nama Mobil</th>
              <th className="px-4 py-4 whitespace-nowrap">Plat</th>
              <th className="px-4 py-4 whitespace-nowrap">Vendor</th>
              <th className="px-4 py-4 whitespace-nowrap">Lokasi</th>
              <th className="px-4 py-4 whitespace-nowrap">Koordinat</th>
              <th className="px-4 py-4 whitespace-nowrap">Waktu (UTC)</th>
              <th className="px-4 py-4 whitespace-nowrap">Status</th>
              <th className="px-4 py-4 whitespace-nowrap">Kecepatan</th>
              <th className="px-4 py-4 whitespace-nowrap">Arah</th>
              <th className="px-4 py-4 whitespace-nowrap">Odometer</th>
              <th className="px-4 py-4 whitespace-nowrap">Tipe</th>
              <th className="px-4 py-4 whitespace-nowrap">Alarm</th>
              <th className="px-4 py-4 whitespace-nowrap">Mesin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {records.map((r) => (
              <MonitoringTableRow
                key={r.id}
                record={r}
                display={resolveVehicleDisplay(r)}
                onEngineChanged={onEngineChanged}
              />
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block">
              location_off
            </span>
            <p className="text-slate-400 text-sm font-medium">
              Tidak ada data ditemukan
            </p>
          </div>
        )}
      </div>
      <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          setIsExportModalOpen(false);
          onExport?.(options);
        }}
        totalRows={totalResults ?? records.length}
        title="Export Monitoring Data"
        description="Generate fleet location report from GPS tracking."
        columns={monitoringColumns}
      />
    </>
  );
};

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { ModalExport, ExportColumn } from "@/components/ui/export";

const vehicleHistoryColumns: ExportColumn[] = [
  { id: "vehicleName", label: "Vehicle Name", defaultChecked: true },
  { id: "vehiclePlate", label: "Plate Number", defaultChecked: true },
  { id: "rentalPeriod", label: "Period", defaultChecked: true },
  { id: "totalDistance", label: "Total Distance", defaultChecked: true },
  { id: "fuelEfficiency", label: "Fuel Efficiency", defaultChecked: true },
  { id: "maintenance", label: "Maintenance", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
];


export interface VehicleHistoryFilters {
  search: string;
  status: string;
}

interface VehicleHistoryFiltersProps {
  filters: VehicleHistoryFilters;
  onExport?: (options?: any) => void;
  onFilterChange: (filters: VehicleHistoryFilters) => void;
  totalRows?: number;
}

export function VehicleHistoryFilters({
  filters,
  onExport,
  onFilterChange,
  totalRows = 0,
}: VehicleHistoryFiltersProps) {
   const [isExportModalOpen, setIsExportModalOpen] = useState(false);

   const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

const handleConfirmExport = (options?: any) => {
     setIsExportModalOpen(false);
     onExport?.(options);
   };
  return (
    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="relative w-full md:w-96">
        <Input
          id="vehicleSearch"
          name="vehicleSearch"
          placeholder="Search vehicle or plate number..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="pl-10"
        />
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
          search
        </span>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Select
          id="status"
          name="status"
          value={filters.status}
          onChange={(e) =>
            onFilterChange({ ...filters, status: e.target.value })
          }
          className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl"
        >
          <option>All Status</option>
          <option>Current</option>
          <option>Previous</option>
        </Select>
      </div>
      <div className="flex items-center gap-3">
               <Button 
            variant="secondary" 
            onClick={handleExportClick}  
            icon="download"
          >
            Export
          </Button>
            </div>
            <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleConfirmExport}
        totalRows={totalRows}  // ← Ganti dengan total data
        title="Export Vehicle History"
        description="Generate vehicle history reports."
        columns={vehicleHistoryColumns}
      />
    </div>
  );
}

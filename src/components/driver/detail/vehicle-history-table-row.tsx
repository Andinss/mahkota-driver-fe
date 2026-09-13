import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import Link from "next/link";

export type VehicleStatus = "Current" | "Previous";

export interface VehicleHistory {
  name: string;
  plateNumber: string;
  imageUrl: string;
  period: string;
  activeDuration: string;
  totalDistance: string;
  fuelEfficiency: string;
  fuelEfficiencyLabel: string;
  fuelEfficiencyColor: string;
  maintenanceCount: number;
  maintenanceIcon: string;
  maintenanceColor: string;
  status: VehicleStatus;
}

interface VehicleHistoryTableRowProps {
  vehicle: VehicleHistory;
}

const statusStyles: Record<
  VehicleStatus,
  { bg: string; text: string }
> = {
  Current: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
  },
  Previous: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-500 dark:text-slate-400",
  },
};

export function VehicleHistoryTableRow({ vehicle }: VehicleHistoryTableRowProps) {
  const statusStyle = statusStyles[vehicle.status];

  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
            <img
              alt={vehicle.name}
              className="w-full h-full object-cover"
              src={vehicle.imageUrl}
            />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {vehicle.name}
            </p>
            <p className="text-xs font-medium text-slate-400">
              {vehicle.plateNumber}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <p className="font-medium text-slate-900 dark:text-white">
            {vehicle.period}
          </p>
          <p className="text-xs text-slate-400">{vehicle.activeDuration}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {vehicle.totalDistance}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex flex-col items-center">
          <span className={`text-sm font-semibold ${vehicle.fuelEfficiencyColor}`}>
            {vehicle.fuelEfficiency}
          </span>
          <span className="text-[10px] text-slate-400">
            {vehicle.fuelEfficiencyLabel}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className={`flex items-center justify-center gap-1.5 ${vehicle.maintenanceColor}`}>
          <span className="material-symbols-outlined text-xl">
            {vehicle.maintenanceIcon}
          </span>
          <span className="text-sm font-bold">{vehicle.maintenanceCount}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}
        >
          {vehicle.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
          }
        >
          <Link href={`/dashboard/vehicle/detail/`}>
            <DropdownMenuItem icon="visibility">
              View Details
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem icon="download">Download Report</DropdownMenuItem>
        </Dropdown>
      </td>
    </tr>
  );
}

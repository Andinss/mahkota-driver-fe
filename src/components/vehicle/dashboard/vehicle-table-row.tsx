import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import { ActiveBadge } from "@/components/ui/active-badge";

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

interface VehicleTableRowProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onToggleStatus?: (vehicle: Vehicle) => void;
  onDetails?: (vehicle: Vehicle) => void;
}

/* Config status condition (tanpa dot) */
const statusConfig: Record<string, { label: string; className: string }> = {
  available: {
    label: "Available",
    className: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  },
  rented: {
    label: "Rented",
    className: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  },
  maintenance: {
    label: "Maintenance",
    className: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  },
  reserved: {
    label: "Reserved",
    className: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  },
  retrieved: {
    label: "Retrieved",
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
};

const getStatusColor = (status: string): string => {
  const key = status.toLowerCase();
  return statusConfig[key]?.className || statusConfig.available.className;
};

const getStatusLabel = (status: string): string => {
  const key = status.toLowerCase();
  return statusConfig[key]?.label || status;
};

export const VehicleTableRow = ({
  vehicle,
  onEdit,
  onDelete,
  onToggleStatus,
  onDetails,
}: VehicleTableRowProps) => {
  const isActive = vehicle.isActive !== false;

  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
      {/* Kendaraan */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-20 rounded-lg bg-cover bg-center shrink-0 border border-slate-200 dark:border-slate-700"
            data-alt={vehicle.imageAlt}
            style={{ backgroundImage: `url("${vehicle.image}")` }}
          ></div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
              {vehicle.name}
            </p>
            <p className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 truncate max-w-[180px]">
              {vehicle.plate}
            </p>
          </div>
        </div>
      </td>

      {/* Vendor */}
      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
        {vehicle.vendorName || "-"}
      </td>

      {/* Device */}
      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
        {vehicle.deviceName || "-"}
      </td>

      {/* Kategori */}
      <td className="px-5 py-4">
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {vehicle.membership || "-"}
        </span>
      </td>

      {/* Tarif/Hari */}
      <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
        {vehicle.rate}
      </td>

      {/* Condition — tanpa dot */}
      <td className="px-5 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor(vehicle.status)}`}>
          {getStatusLabel(vehicle.status)}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <ActiveBadge isActive={isActive} />
      </td>

      {/* Aksi */}
      <td className="px-5 py-4 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/vehicles/register?plate=${vehicle.plate}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          {/* <DropdownMenuItem icon="delete" danger onClick={() => onDelete?.(vehicle)}>
            Delete
          </DropdownMenuItem> */}
          <DropdownMenuItem
            icon={isActive ? "block" : "check_circle"}
            onClick={() => onToggleStatus?.(vehicle)}
          >
            {isActive ? "Mark as Inactive" : "Mark as Active"}
          </DropdownMenuItem>
          <Link href={`/dashboard/vehicles/detail?id=${vehicle.id}`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>
        </Dropdown>
      </td>
    </tr>
  );
};
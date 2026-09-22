import Link from "next/link";
import { StatusBadge } from "../../status-badge";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

interface Vehicle {
  id?: string;
  name: string;
  year: number;
  plate: string;
  rate: string;
  pricingCategory: string;
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
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-20 rounded-lg bg-cover bg-center shrink-0 border border-slate-200 dark:border-slate-700"
            data-alt={vehicle.imageAlt}
            style={{ backgroundImage: `url("${vehicle.image}")` }}
          ></div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {vehicle.name}
            </p>
            <p className="text-xs text-slate-400">{vehicle.year}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
          {vehicle.plate}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {vehicle.vendorName || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {vehicle.deviceName || "-"}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {vehicle.pricingCategory}
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">
        {vehicle.rate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={vehicle.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isActive ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Inactive
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right whitespace-nowrap">
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
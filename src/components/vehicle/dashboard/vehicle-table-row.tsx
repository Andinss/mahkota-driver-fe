import Link from "next/link";
import { StatusBadge } from "../../status-badge";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

interface Vehicle {
  id?: string;
  name: string;
  year: number;
  transmission: string;
  plate: string;
  type: string;
  rate: string;
  pricingCategory: string;
  status: "available" | "rented" | "maintenance";
  image: string;
  imageAlt: string;
  vendorName: string;
}

interface VehicleTableRowProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onDetails?: (vehicle: Vehicle) => void;
}

export const VehicleTableRow = ({
  vehicle,
  onEdit,
  onDelete,
  onDetails,
}: VehicleTableRowProps) => {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
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
            <p className="text-xs text-slate-400">
              {vehicle.year} • {vehicle.transmission}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-mono text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          {vehicle.plate}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {vehicle.type}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {vehicle.vendorName || "-"}
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
          <Link href={`/dashboard/vehicle/register?plate=${vehicle.plate}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem icon="delete" danger onClick={() => onDelete?.(vehicle)}>
            Delete
          </DropdownMenuItem>
          <Link href={`/dashboard/vehicle/detail?id=${vehicle.id}`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>
        </Dropdown>
      </td>
    </tr>
  );
};

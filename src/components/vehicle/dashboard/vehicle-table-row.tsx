import Link from "next/link";
import { StatusBadge } from "../../status-badge";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

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

interface VehicleTableRowProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onDetails?: (vehicle: Vehicle) => void;
}

export const VehicleTableRow = ({
  vehicle,
  onEdit,

  onDetails,
}: VehicleTableRowProps) => {
  return (
    <tr className="group hover:bg-[#f9fafb] dark:hover:bg-[#23303d] transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-20 rounded-lg bg-cover bg-center shrink-0 border border-[#e5e7eb] dark:border-[#2a3845]"
            data-alt={vehicle.imageAlt}
            style={{ backgroundImage: `url("${vehicle.image}")` }}
          ></div>
          <div>
            <p className="text-sm font-bold text-[#111418] dark:text-white">
              {vehicle.name}
            </p>
            <p className="text-xs text-[#617589] dark:text-[#94a3b8]">
              {vehicle.year} • {vehicle.transmission}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="font-mono text-sm font-medium text-[#111418] dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {vehicle.plate}
        </span>
      </td>
      <td className="py-4 px-6 text-sm text-[#111418] dark:text-gray-300">
        {vehicle.type}
      </td>
      <td className="py-4 px-6 text-sm font-semibold text-[#111418] dark:text-white">
        {vehicle.rate}
      </td>
      <td className="py-4 px-6">
        <StatusBadge status={vehicle.status} />
      </td>
      <td className="py-4 px-6 text-right">
        <Dropdown
          trigger={
            <button className="text-[#617589] hover:text-[#111418] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/vehicle/register?plate=${vehicle.plate}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>

          <DropdownMenuItem icon="delete" danger>
            Delete
          </DropdownMenuItem>

          <Link href={`/dashboard/vehicle/detail/`}>
            <DropdownMenuItem icon="details">Details</DropdownMenuItem>
          </Link>
        </Dropdown>
      </td>
    </tr>
  );
};

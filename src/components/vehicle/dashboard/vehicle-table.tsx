import { VehicleTableRow } from "./vehicle-table-row";

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
}

export const VehicleTable = ({
  vehicles,
  onEdit,
  onDelete,
}: VehicleTableProps) => {
  return (
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

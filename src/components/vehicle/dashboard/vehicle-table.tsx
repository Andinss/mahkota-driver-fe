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
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
  resultsPerPage?: number;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

export const VehicleTable = ({
  vehicles,
  currentPage = 1,
  totalPages = 6,
  totalResults = 24,
  resultsPerPage = 4,
  onEdit,
  onDelete,
}: VehicleTableProps) => {
  return (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] shadow-sm overflow-hidden">
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
              <VehicleTableRow key={index} vehicle={vehicle} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e7eb] dark:border-[#2a3845] bg-white dark:bg-[#1a2632]">
        <p className="text-sm text-[#617589] dark:text-[#94a3b8]">
          Showing{" "}
          <span className="font-medium text-[#111418] dark:text-white">
            {(currentPage - 1) * resultsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-[#111418] dark:text-white">
            {Math.min(currentPage * resultsPerPage, totalResults)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-[#111418] dark:text-white">
            {totalResults}
          </span>{" "}
          results
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded border border-[#e5e7eb] dark:border-[#4b5563] text-sm font-medium text-[#617589] dark:text-white disabled:opacity-50 hover:bg-[#f0f2f4] dark:hover:bg-[#2a3845]">
            Previous
          </button>
          <button className="px-3 py-1.5 rounded bg-primary text-sm font-medium text-white shadow-sm hover:bg-blue-600">
            1
          </button>
          <button className="px-3 py-1.5 rounded border border-[#e5e7eb] dark:border-[#4b5563] text-sm font-medium text-[#617589] dark:text-white hover:bg-[#f0f2f4] dark:hover:bg-[#2a3845]">
            2
          </button>
          <button className="px-3 py-1.5 rounded border border-[#e5e7eb] dark:border-[#4b5563] text-sm font-medium text-[#617589] dark:text-white hover:bg-[#f0f2f4] dark:hover:bg-[#2a3845]">
            3
          </button>
          <span className="px-2 py-1.5 text-sm text-[#617589]">...</span>
          <button className="px-3 py-1.5 rounded border border-[#e5e7eb] dark:border-[#4b5563] text-sm font-medium text-[#617589] dark:text-white hover:bg-[#f0f2f4] dark:hover:bg-[#2a3845]">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

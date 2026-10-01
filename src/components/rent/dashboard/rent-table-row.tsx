import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import { EngineSwitch } from "@/components/ui/engine-switch";

interface Rental {
  id: string;
  transactionId: string;
  driver: {
    name: string;
    id: string;
    avatar?: string;
  };
  vehicle: {
    name: string;
    id: string;
  };
  vehicleId?: string;
  vehicleEngineStatus?: "on" | "off";
  rentalPeriod: {
    start: string;
    end: string;
    duration: number;
  };
  rentalDuration?: string;
  rentalService?: string;
}

interface RentalTableRowProps {
  rental: Rental;
  onEdit?: (rental: Rental) => void;
  onDelete?: (rental: Rental) => void;
  onDetails?: (rental: Rental) => void;
  onEndRental?: (rental: Rental) => void;
  onEngineChanged?: (vehicleId: string, engineStatus: "on" | "off") => void;
}

export const RentalTableRow = ({
  rental,
  onEdit,
  onDelete,
  onDetails,
  onEndRental,
  onEngineChanged,
}: RentalTableRowProps) => {
  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
      {/* Transaction ID */}
      <td className="px-4 py-3">
        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
          {rental.transactionId}
        </span>
      </td>

      {/* Driver Details */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
            {rental.driver.avatar ? (
              <img
                alt={rental.driver.name}
                src={rental.driver.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-xs font-medium">
                {rental.driver.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate max-w-[140px]">
              {rental.driver.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
              {rental.driver.id}
            </p>
          </div>
        </div>
      </td>

      {/* Vehicle Info */}
      <td className="px-4 py-3">
        <div className="min-w-0">
          <p className="font-medium text-slate-900 dark:text-white text-sm truncate max-w-[140px]">
            {rental.vehicle.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-[140px]">
            {rental.vehicle.id}
          </p>
        </div>
      </td>

      {/* Rental Period */}
      <td className="px-4 py-3">
        <p className="text-sm text-slate-900 dark:text-white whitespace-nowrap">
          {rental.rentalPeriod.start} - {rental.rentalPeriod.end}
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
            ({rental.rentalPeriod.duration}h)
          </span>
        </p>
      </td>

      {/* Tipe Durasi */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 capitalize">
          {rental.rentalDuration || "-"}
        </span>
      </td>

      {/* Jenis Layanan */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
          rental.rentalService === "lepas kunci"
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : rental.rentalService === "pakai supir"
            ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
        }`}>
          {rental.rentalService || "-"}
        </span>
      </td>

      {/* Engine */}
      <td className="px-4 py-3 whitespace-nowrap">
        {rental.vehicleId ? (
          <div className="flex items-center gap-2">
            <EngineSwitch
              key={`${rental.vehicleId}-${rental.vehicleEngineStatus}`}
              vehicleId={rental.vehicleId}
              engineStatus={rental.vehicleEngineStatus}
              onChanged={(next) =>
                onEngineChanged?.(rental.vehicleId!, next)
              }
            />
            <span className={`text-xs font-bold ${
              rental.vehicleEngineStatus === "on"
                ? "text-green-600 dark:text-green-400"
                : "text-slate-400 dark:text-slate-500"
            }`}>
              {rental.vehicleEngineStatus === "on" ? "ON" : "OFF"}
            </span>
          </div>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-500">-</span>
        )}
      </td>

      {/* Aksi */}
      <td className="px-4 py-3 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/rentals/new?id=${rental.id}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            icon="delete"
            danger
            onClick={() => onDelete?.(rental)}
          >
            Delete
          </DropdownMenuItem>
          <Link href={`/dashboard/rentals/detail/?id=${rental.id}`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>
        </Dropdown>
      </td>
    </tr>
  );
};
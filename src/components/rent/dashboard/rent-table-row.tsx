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
  status?: "active" | "stopped";
  stoppedAt?: string | null;
  startDate?: string;
  endDate?: string;
}

interface RentalTableRowProps {
  rental: Rental;
  onEdit?: (rental: Rental) => void;
  onDelete?: (rental: Rental) => void;
  onDetails?: (rental: Rental) => void;
  onEndRental?: (rental: Rental) => void;
  onEngineChanged?: (vehicleId: string, engineStatus: "on" | "off") => void;
}

/* Warna badge per tipe durasi */
const durationColor: Record<string, string> = {
  harian: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  mingguan: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  bulanan: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
  tahunan: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
};

const getDurationColor = (duration?: string): string => {
  if (!duration)
    return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
  return (
    durationColor[duration.toLowerCase()] ||
    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
  );
};

/* Warna badge per jenis layanan */
const serviceColor: Record<string, string> = {
  "lepas kunci": "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  "pakai supir": "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
};

const getServiceColor = (service?: string): string => {
  if (!service)
    return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
  return (
    serviceColor[service.toLowerCase()] ||
    "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
  );
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* Status rental yang sedang berjalan dihitung dari periode sewa */
const getDerivedStatus = (rental: Rental) => {
  const today = new Date().toISOString().slice(0, 10);
  const start = rental.startDate;
  const end = rental.endDate;
  if (start && today < start) return "upcoming";
  if (end && today > end) return "completed";
  return "active";
};

const derivedStatusLabel: Record<string, string> = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
};

const derivedStatusColor: Record<string, string> = {
  active:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  upcoming:
    "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  completed:
    "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

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
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${getDurationColor(
            rental.rentalDuration,
          )}`}
        >
          {rental.rentalDuration || "-"}
        </span>
      </td>

      {/* Jenis Layanan */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${getServiceColor(
            rental.rentalService,
          )}`}
        >
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
            <span
              className={`text-xs font-bold ${
                rental.vehicleEngineStatus === "on"
                  ? "text-green-600 dark:text-green-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {rental.vehicleEngineStatus === "on" ? "ON" : "OFF"}
            </span>
          </div>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-500">-</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        {rental.status === "stopped" ? (
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <span className="material-symbols-outlined text-sm">stop_circle</span>
              Stopped
            </span>
            {rental.stoppedAt && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {formatDate(rental.stoppedAt)}
              </span>
            )}
          </div>
        ) : (() => {
          const derived = getDerivedStatus(rental);
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${derivedStatusColor[derived]}`}
            >
              {derivedStatusLabel[derived]}
            </span>
          );
        })()}
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
          {rental.status !== "stopped" && (
            <DropdownMenuItem
              icon="stop_circle"
              danger
              onClick={() => onEndRental?.(rental)}
            >
              Stop Rental
            </DropdownMenuItem>
          )}
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
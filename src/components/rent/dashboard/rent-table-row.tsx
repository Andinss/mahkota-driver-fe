import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
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
  deposit: string;
  paymentStatus: string;
  methodPayment?: string;
  saldoDeducted?: number;
  rentalDuration?: string;
  rentalService?: string;
}

const paymentStatusLabels: Record<string, string> = {
  paid: "Paid",
  late: "Late",
  pending_confirmation: "Pending Confirmation",
  partial: "Partial",
  unpaid: "Unpaid",
};

const allowedTransitions: Record<string, string[]> = {
  unpaid: ["paid", "late", "pending_confirmation", "partial"],
  late: ["paid", "pending_confirmation"],
  pending_confirmation: ["paid", "late", "unpaid"],
  partial: ["paid"],
  paid: [],
};

const getStatusOptions = (currentStatus: string) =>
  Object.entries(paymentStatusLabels)
    .filter(([value]) => allowedTransitions[currentStatus]?.includes(value))
    .map(([value, label]) => ({ value, label }));

interface RentalTableRowProps {
  rental: Rental;
  onEdit?: (rental: Rental) => void;
  onDelete?: (rental: Rental) => void;
  onDetails?: (rental: Rental) => void;
  onEndRental?: (rental: Rental) => void;
  onStatusChange?: (rental: Rental, status: string) => void;
}

export const RentalTableRow = ({
  rental,
  onEdit,
  onDelete,
  onDetails,
  onEndRental,
  onStatusChange,
}: RentalTableRowProps) => {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      {/* Transaction ID */}
      <td className="px-6 py-4">
        <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
          {rental.transactionId}
        </span>
      </td>

      {/* Driver Details */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
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
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {rental.driver.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {rental.driver.id}
            </p>
          </div>
        </div>
      </td>

      {/* Vehicle Info */}
      <td className="px-6 py-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {rental.vehicle.id}
        </p>
        <p className="font-medium text-slate-900 dark:text-white">
          {rental.vehicle.name}
        </p>
      </td>

      {/* Rental Period */}
      <td className="px-6 py-4">
        <p className="text-slate-900 dark:text-white">
          {rental.rentalPeriod.start} - {rental.rentalPeriod.end}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {rental.rentalPeriod.duration} Days
        </p>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {rental.deposit}
        </span>
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {rental.methodPayment === "Saldo" && (
            <span className="material-symbols-outlined text-sm text-green-600 dark:text-green-400">account_balance_wallet</span>
          )}
          {rental.methodPayment || "Bank"}
        </span>
      </td>

      <td className="px-6 py-4">
        {rental.methodPayment === "Saldo" && Number(rental.saldoDeducted) > 0 ? (
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            -Rp {Number(rental.saldoDeducted).toLocaleString("id-ID")}
          </span>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-500">-</span>
        )}
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 capitalize">
          {rental.rentalDuration || "-"}
        </span>
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 capitalize">
          {rental.rentalService || "-"}
        </span>
      </td>

      <td className="px-6 py-4">
        {rental.vehicleId ? (
          <div className="flex items-center gap-2">
            <EngineSwitch
              vehicleId={rental.vehicleId}
              engineStatus={rental.vehicleEngineStatus}
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

      <td className="px-6 py-4">
        <Badge
          variant={
            rental.paymentStatus === "paid"
              ? "success"
              : rental.paymentStatus === "partial"
                ? "warning"
                : rental.paymentStatus === "late"
                  ? "danger"
                  : rental.paymentStatus === "pending_confirmation"
                    ? "info"
                    : "neutral"
          }
          dot
        >
          {paymentStatusLabels[rental.paymentStatus] || rental.paymentStatus}
        </Badge>
      </td>

      <td className="py-4 px-6 text-right">
        <Dropdown
          trigger={
            <button className="text-[#617589] hover:text-[#111418] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/rent/new?id=${rental.id}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            icon="delete"
            danger
            onClick={() => onDelete?.(rental)}
          >
            Delete
          </DropdownMenuItem>

          <Link href={`/dashboard/rent/detail/?id=${rental.id}`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>

          <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>

          {getStatusOptions(rental.paymentStatus).map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              icon={opt.value === "paid" ? "check_circle" : opt.value === "late" ? "warning" : opt.value === "pending_confirmation" ? "hourglass_empty" : opt.value === "partial" ? "payments" : "cancel"}
              onClick={() => onStatusChange?.(rental, opt.value)}
            >
              Set {opt.label}
            </DropdownMenuItem>
          ))}
        </Dropdown>
      </td>
    </tr>
  );
};

import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";

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
  rentalPeriod: {
    start: string;
    end: string;
    duration: number;
  };
  deposit: string;
  paymentStatus: string;
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
      <td className="px-6 py-4 font-mono font-medium">
        {rental.transactionId}
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
        <Badge
          variant={
            rental.deposit === "held"
              ? "success"
              : rental.deposit === "pending"
                ? "warning"
                : rental.deposit === "waiting"
                  ? "info"
                  : "neutral"
          }
          dot
        >
          {rental.deposit}
        </Badge>
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
              <span className="material-symbols-outlined text-[20px]">
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

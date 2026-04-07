import { StatusBadge } from "@/components/status-badge";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

interface Rental {
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
  deposit:string;
  paymentStatus: string;
}

interface RentalTableRowProps {
  rental: Rental;
  onEdit?: (rental: Rental) => void;
  onDelete?: (rental: Rental) => void;
  onDetails?: (rental: Rental) => void;
  onEndRental?: (rental: Rental) => void;
}

export const RentalTableRow = ({
  rental,
  onEdit,
  onDelete,
  onDetails,
  onEndRental,
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
              ID: {rental.driver.id}
            </p>
          </div>
        </div>
      </td>

      {/* Vehicle Info */}
      <td className="px-6 py-4">
        <p className="font-medium text-slate-900 dark:text-white">
          {rental.vehicle.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {rental.vehicle.id}
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

      {/* Deposit */}
      <td className="px-6 py-4">
         <StatusBadge status={rental.deposit} />
      </td>

      {/* Payment Status */}
      <td className="px-6 py-4">
        <StatusBadge status={rental.paymentStatus} />
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
          {/* <Link href={`/dashboard/vehicle/register?plate=${vehicle.plate}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link> */}

          <DropdownMenuItem icon="delete" danger>
            Delete
          </DropdownMenuItem>

          {/* <Link href={`/dashboard/vehicle/detail/`}>
            <DropdownMenuItem icon="details">Details</DropdownMenuItem>
          </Link> */}
        </Dropdown>
      </td>
    </tr>
  );
};
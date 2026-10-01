import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

export interface Driver {
  id: string;
  name: string;
  profilePhoto: string;
  employeeId: string;
  phoneNumber: string;
  email: string;
  koin?: number;
  isActive?: boolean;
  membership?: { name: string; level: number } | null;
}

interface DriverTableRowProps {
  driver: Driver;
  onDeleteClick?: (driver: Driver) => void;
  onToggleStatus?: (driver: Driver) => void;
  onDetailsClick?: (driver: Driver) => void;
}

export function DriverTableRow({
  driver,
  onDeleteClick,
  onToggleStatus,
  onDetailsClick,
}: DriverTableRowProps) {
  const isActive = driver.isActive !== false;

  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
            {driver.profilePhoto ? (
              <img
                alt={driver.name}
                className="w-full h-full object-cover"
                src={driver.profilePhoto}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-lg">person</span>
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {driver.name}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {driver.employeeId}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {driver.phoneNumber}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {driver.email}
      </td>
      <td className="px-6 py-4">
        {driver.membership ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
            <span className="material-symbols-outlined text-sm">card_membership</span>
            {driver.membership.name} (Level {driver.membership.level})
          </span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            (driver.koin ?? 0) > 0
              ? "text-green-600 dark:text-green-400"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          <span className="material-symbols-outlined text-base">account_balance_wallet</span>
          Rp {Number(driver.koin ?? 0).toLocaleString("id-ID")}
        </span>
      </td>
      <td className="px-6 py-4">
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
      <td className="px-6 py-4 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/drivers/register?id=${driver.id}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          {/* <DropdownMenuItem
            icon="delete"
            danger
            onClick={() => onDeleteClick?.(driver)}
          >
            Delete
          </DropdownMenuItem> */}
          <DropdownMenuItem
            icon={isActive ? "person_off" : "person_check"}
            onClick={() => onToggleStatus?.(driver)}
          >
            {isActive ? "Mark as Inactive" : "Mark as Active"}
          </DropdownMenuItem>
          <Link href={`/dashboard/drivers/detail?id=${driver.id}`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>
        </Dropdown>
      </td>
    </tr>
  );
}

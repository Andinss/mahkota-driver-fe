import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

export interface Driver {
  id: string;
  name: string;
  profilePhoto: string;
  employeeId: string;
  phoneNumber: string;
  email: string;
}

interface DriverTableRowProps {
  driver: Driver;
  onDeleteClick?: (driver: Driver) => void;
  onDetailsClick?: (driver: Driver) => void;
}

export function DriverTableRow({
  driver,
  onDeleteClick,
  onDetailsClick,
}: DriverTableRowProps) {
  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-5">
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
      <td className="px-6 py-5">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {driver.employeeId}
        </span>
      </td>
      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
        {driver.phoneNumber}
      </td>
      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
        {driver.email}
      </td>
      <td className="px-6 py-5 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/driver/register?id=${driver.id}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            icon="delete"
            danger
            onClick={() => onDeleteClick?.(driver)}
          >
            Delete
          </DropdownMenuItem>
          <Link href={`/dashboard/driver/detail?id=${driver.id}`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>
        </Dropdown>
      </td>
    </tr>
  );
}

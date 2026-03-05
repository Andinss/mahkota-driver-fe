import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

export type DriverStatus = "Active" | "On Leave" | "Inactive";

export interface Driver {
  name: string;
  imageUrl: string;
  joinedDate: string;
  employeeId: string;
  phoneNumber: string;
  licenseType: string;
  totalTrips: number;
  status: DriverStatus;
}

interface DriverTableRowProps {
  driver: Driver;
}

const statusStyles: Record<
  DriverStatus,
  { bg: string; text: string; dotColor: string }
> = {
  Active: {
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
  },
  "On Leave": {
    bg: "bg-amber-100 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
  },
  Inactive: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-500 dark:text-slate-400",
    dotColor: "bg-slate-400",
  },
};

export function DriverTableRow({ driver }: DriverTableRowProps) {
  const statusStyle = statusStyles[driver.status];

  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
            <img
              alt={driver.name}
              className="w-full h-full object-cover"
              src={driver.imageUrl}
            />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {driver.name}
            </p>
            <p className="text-xs text-slate-500">{driver.joinedDate}</p>
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
      <td className="px-6 py-5">
        <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-bold uppercase">
          {driver.licenseType}
        </span>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {driver.totalTrips}
        </p>
      </td>
      <td className="px-6 py-5">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 ${statusStyle.bg} ${statusStyle.text} rounded-full text-xs font-bold`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotColor}`}
          ></span>
          {driver.status}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/driver/register?id=${driver.employeeId}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem icon="delete" danger>
            Delete
          </DropdownMenuItem>
          <Link href={`/dashboard/driver/detail/`}>
            <DropdownMenuItem icon="details">Details</DropdownMenuItem>
          </Link>
        </Dropdown>
      </td>
    </tr>
  );
}

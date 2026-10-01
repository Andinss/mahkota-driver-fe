import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import { ActiveBadge } from "@/components/ui/active-badge";

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

/* Warna badge berdasarkan level membership */
const membershipColorByLevel: Record<number, string> = {
  1: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  2: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
  3: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  4: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  5: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
  6: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
  7: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400",
};

const getMembershipColor = (level: number): string => {
  return (
    membershipColorByLevel[level] ||
    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
  );
};

export function DriverTableRow({
  driver,
  onDeleteClick,
  onToggleStatus,
  onDetailsClick,
}: DriverTableRowProps) {
  const isActive = driver.isActive !== false;

  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
      {/* Driver: foto + nama + employee ID */}
      <td className="px-4 py-3">
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
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[180px]">
              {driver.name}
            </p>
            <p className="text-xs text-slate-400 font-mono truncate max-w-[180px]">
              {driver.employeeId}
            </p>
          </div>
        </div>
      </td>

      {/* Kontak: telepon + email */}
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
          {driver.phoneNumber || "-"}
        </p>
        <p className="text-xs text-slate-400 truncate max-w-[200px]">
          {driver.email || "-"}
        </p>
      </td>

      {/* Membership */}
      <td className="px-4 py-3">
        {driver.membership ? (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getMembershipColor(driver.membership.level)}`}>
            {driver.membership.name}
          </span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
        )}
      </td>

      {/* Koin */}
      <td className="px-4 py-3 text-sm">
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

      {/* Status */}
      <td className="px-5 py-4">
        <ActiveBadge isActive={isActive} />
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
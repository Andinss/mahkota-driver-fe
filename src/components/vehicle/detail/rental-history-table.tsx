import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import Link from "next/link";

type RentalStatus = "AKTIF" | "SELESAI";

interface RentalRecord {
  dateRange: string;
  tripDuration: string;
  driverName: string;
  dailyRate: string;
  status: RentalStatus;
}

interface RentalHistoryTableProps {
  rentals: RentalRecord[];
}

function getStatusStyles(status: RentalStatus) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold";

  switch (status) {
    case "AKTIF":
      return {
        container: `${baseStyles} bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400`,
        dot: "w-1.5 h-1.5 rounded-full bg-green-500",
      };
    default:
      return {
        container: `${baseStyles} bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400`,
        dot: "w-1.5 h-1.5 rounded-full bg-slate-400",
      };
  }
}

export function RentalHistoryTable({ rentals }: RentalHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <th className="px-6 py-4">
              Date Range
            </th>
            <th className="px-6 py-4">
              Driver Name
            </th>
            <th className="px-6 py-4">
              Daily Rate
            </th>
            <th className="px-6 py-4">
              Status
            </th>
            <th className="px-6 py-4 text-right">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rentals.map((rental, index) => {
            const statusStyles = getStatusStyles(rental.status);
            return (
              <tr
                key={index}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {rental.dateRange}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {rental.tripDuration}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-lg">
                        person
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {rental.driverName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                  {rental.dailyRate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={statusStyles.container}>
                    <span className={statusStyles.dot}></span>
                    {rental.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Dropdown
                    trigger={
                      <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl">
                          more_vert
                        </span>
                      </button>
                    }
                  >
                    <Link href={`/dashboard/rent/detail/`}>
                      <DropdownMenuItem icon="visibility">
                        Details
                      </DropdownMenuItem>
                    </Link>
                  </Dropdown>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

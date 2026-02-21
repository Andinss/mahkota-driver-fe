type RentalStatus = "PAID" | "LATE" | "PENDING";

interface RentalRecord {
  dateRange: string;
  tripDuration: string;
  driverName: string;
  dailyRate: string;
  totalFee: string;
  status: RentalStatus;
}

interface RentalHistoryTableProps {
  rentals: RentalRecord[];
}

function getStatusStyles(status: RentalStatus) {
  const baseStyles =
    "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold";
  const dotStyles = "size-1.5 rounded-full mr-2";

  switch (status) {
    case "PAID":
      return {
        container: `${baseStyles} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300`,
        dot: `${dotStyles} bg-emerald-500`,
      };
    case "LATE":
      return {
        container: `${baseStyles} bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300`,
        dot: `${dotStyles} bg-rose-500`,
      };
    default:
      return {
        container: `${baseStyles} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300`,
        dot: `${dotStyles} bg-yellow-500`,
      };
  }
}

export function RentalHistoryTable({ rentals }: RentalHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Date Range
            </th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Driver Name
            </th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Daily Rate
            </th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Total Fee
            </th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Status
            </th>
            <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rentals.map((rental, index) => {
            const statusStyles = getStatusStyles(rental.status);
            return (
              <tr
                key={index}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {rental.dateRange}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                  {rental.totalFee}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={statusStyles.container}>
                    <span className={statusStyles.dot}></span>
                    {rental.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="material-symbols-outlined text-slate-300 hover:text-primary transition-colors p-1">
                    more_horiz
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

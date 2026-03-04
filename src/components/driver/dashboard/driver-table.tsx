import { DriverTableRow, Driver } from "./driver-table-row";

interface DriverTableProps {
  drivers: Driver[];
}

export function DriverTable({ drivers }: DriverTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4">Profile</th>
            <th className="px-6 py-4">Employee ID</th>
            <th className="px-6 py-4">Phone Number</th>
            <th className="px-6 py-4">License Type</th>
            <th className="px-6 py-4">Total Trips</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {drivers.map((driver, index) => (
            <DriverTableRow key={index} driver={driver} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

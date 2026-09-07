import { VehicleHistoryTableRow, VehicleHistory } from "./vehicle-history-table-row";

interface VehicleHistoryTableProps {
  vehicles: VehicleHistory[];
}

export function VehicleHistoryTable({ vehicles }: VehicleHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <th className="px-6 py-4">Kendaraan</th>
            <th className="px-6 py-4">Periode</th>
            <th className="px-6 py-4 text-center">Total Jarak</th>
            <th className="px-6 py-4 text-center">Efisiensi BBM</th>
            <th className="px-6 py-4 text-center">Maintenance</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {vehicles.map((vehicle, index) => (
            <VehicleHistoryTableRow key={index} vehicle={vehicle} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

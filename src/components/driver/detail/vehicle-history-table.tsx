import { VehicleHistoryTableRow, VehicleHistory } from "./vehicle-history-table-row";

interface VehicleHistoryTableProps {
  vehicles: VehicleHistory[];
}

export function VehicleHistoryTable({ vehicles }: VehicleHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4">Vehicle</th>
            <th className="px-6 py-4">Period</th>
            <th className="px-6 py-4 text-center">Total Distance</th>
            <th className="px-6 py-4 text-center">Fuel Efficiency</th>
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

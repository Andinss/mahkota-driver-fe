import { EngineSwitch } from "@/components/ui/engine-switch";
import type { GpsTrackingRecord } from "@/lib/api/monitoring";

export interface VehicleDisplay {
  driver_name: string;
  vendor: string;
}

const statusLabel: Record<string, string> = {
  emergency: "Darurat",
  moving: "Bergerak",
  idle: "Idle",
  stopped: "Berhenti",
  parking: "Parkir",
};

const statusClass: Record<string, string> = {
  emergency: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  moving: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  idle: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  stopped:
    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  parking: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

interface MonitoringTableRowProps {
  record: GpsTrackingRecord;
  display: VehicleDisplay;
  onEngineChanged?: (vehicleId: string, engineStatus: "on" | "off") => void;
}

export const MonitoringTableRow = ({
  record,
  display,
  onEngineChanged,
}: MonitoringTableRowProps) => {
  const status = (record.Car_Status || "").toLowerCase();
  const engineOn = record.Engine === "on";

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
  <td className="px-4 py-4 whitespace-nowrap">
  <div className="flex items-center gap-2 mb-1.5">
    
    <p className="font-medium text-slate-900 dark:text-white">
      {display.driver_name}
    </p> /
 <span className="inline-flex items-center font-mono text-[10px] font-bold 
  text-blue-700 dark:text-blue-300 
  bg-blue-50 dark:bg-blue-900/30 
  px-1.5 py-0.5 rounded">
  {record.VehicleNumber || "-"}
</span>
  </div>
</td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
          <span className="material-symbols-outlined text-sm">business</span>
          {display.vendor}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 text-lg">
            location_on
          </span>
          <span className="text-slate-600 dark:text-slate-400 truncate max-w-[180px]">
            {record.GpsLocation || "-"}
          </span>
        </div>
        {record.Lat && record.Lon ? `${record.Lat}, ${record.Lon}` : "-"}
      </td>
  
      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
        {record.DatetimeUTC || "-"}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            statusClass[status] || statusClass.idle
          }`}
        >
          {statusLabel[status] || record.Car_Status || "-"}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
        {record.Speed ? `${record.Speed} km/h` : "-"}
      </td>
      {/* <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
        {record.Direction ? `${record.Direction}°` : "-"}
      </td> */}
      <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
        {record.Odometer || "-"}
      </td>
      {/* <td className="px-4 py-4 whitespace-nowrap">
        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
          {record.VehicleType || "-"}
        </span>
      </td> */}
      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
        {record.Alarm && record.Alarm !== "none" ? record.Alarm : "-"}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <EngineSwitch
            key={`${record.vehicle?.id || record.VehicleId}-${record.Engine}`}
            vehicleId={record.vehicle?.id || record.VehicleId || record.id}
            engineStatus={engineOn ? "on" : "off"}
            onChanged={(next) =>
              onEngineChanged?.(
                record.vehicle?.id || record.VehicleId || record.id,
                next,
              )
            }
          />
          <span
            className={`text-xs font-bold ${
              engineOn
                ? "text-green-600 dark:text-green-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {engineOn ? "ON" : "OFF"}
          </span>
        </div>
      </td>
    </tr>
  );
};

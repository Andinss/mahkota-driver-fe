"use client";

import { useEffect, useState, useCallback } from "react";
import { monitoringApi } from "@/lib/api/monitoring";
import type { FleetLocation } from "@/lib/types/monitoring";
import { EngineSwitch } from "@/components/ui/engine-switch";

const statusLabel: Record<string, string> = {
  moving: "Moving",
  idle: "Idle",
  emergency: "Emergency",
};

const statusClass: Record<string, string> = {
  moving: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  idle: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
  emergency: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const formatCoord = (value: number) =>
  value != null ? Number(value).toFixed(5) : "-";

export default function FleetLocationsTable() {
  const [locations, setLocations] = useState<FleetLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await monitoringApi.getFleetLocations();
      if (res.success && Array.isArray(res.data)) {
        setLocations(res.data);
      }
    } catch {
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return (
    <div className="bg-white dark:bg-[#1e2732] rounded-xl border border-[#e5e7eb] dark:border-[#333] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Fleet Locations
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {locations.length} vehicle(s) with position data
        </span>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Loading locations...
          </div>
        ) : locations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No location data available.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Plate</th>
                <th className="px-6 py-4">Latitude</th>
                <th className="px-6 py-4">Longitude</th>
                <th className="px-6 py-4">Speed (km/h)</th>
                <th className="px-6 py-4">Fuel (%)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Engine</th>
                <th className="px-6 py-4">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {locations.map((loc) => (
                <tr key={loc.id || loc.vehicle_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {loc.vehicle_name || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {loc.plate || "-"}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                    {formatCoord(loc.latitude)}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                    {formatCoord(loc.longitude)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {Number(loc.speed) || 0}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {loc.fuel_level != null ? `${loc.fuel_level}%` : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusClass[loc.status] || statusClass.idle}`}>
                      {statusLabel[loc.status] || loc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <EngineSwitch
                        vehicleId={loc.vehicle_id}
                        engineStatus={loc.engine_status === "on" ? "on" : "off"}
                        onChanged={() => fetchLocations()}
                      />
                      <span className={`text-xs font-bold ${
                        loc.engine_status === "on"
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}>
                        {loc.engine_status === "on" ? "ON" : "OFF"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {loc.last_updated
                      ? new Date(loc.last_updated).toLocaleString("id-ID")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

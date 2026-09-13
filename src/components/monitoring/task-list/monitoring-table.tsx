"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EngineSwitch } from "@/components/ui/engine-switch";
import type { FleetLocation } from "@/lib/types/monitoring";
import type { MonitoringTask } from "@/lib/api/monitoring";

export interface MergedVehicle {
  id: string;
  vehicleName: string;
  plate: string;
  priority: string;
  location: string;
  timeWindow: string;
  taskStatus: string;
  speed: number;
  fuelLevel: number | null;
  fleetStatus: string;
  engineStatus: "on" | "off";
  lastUpdated: string;
  vehicleId: string;
}

interface MonitoringTableProps {
  vehicles: MergedVehicle[];
  loading: boolean;
  onRefresh?: () => void;
}

const statusLabel: Record<string, string> = {
  moving: "Bergerak",
  idle: "Idle",
  emergency: "Darurat",
  Pending: "Menunggu",
  Scheduled: "Terjadwal",
  "In Progress": "Berlangsung",
  Completed: "Selesai",
};

const statusClass: Record<string, string> = {
  moving: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  idle: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  emergency: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  Pending: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  Scheduled: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  "In Progress": "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  Completed: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
};

const priorityClass: Record<string, string> = {
  High: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  Normal: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export function mergeData(
  tasks: MonitoringTask[],
  locations: FleetLocation[]
): MergedVehicle[] {
  const merged = new Map<string, MergedVehicle>();

  for (const loc of locations) {
    const key = loc.plate || loc.vehicle_id;
    merged.set(key, {
      id: loc.id || loc.vehicle_id,
      vehicleName: loc.vehicle_name || "-",
      plate: loc.plate || "-",
      priority: "-",
      location: "-",
      timeWindow: "-",
      taskStatus: "-",
      speed: Number(loc.speed) || 0,
      fuelLevel: loc.fuel_level,
      fleetStatus: loc.status,
      engineStatus: loc.engine_status,
      lastUpdated: loc.last_updated,
      vehicleId: loc.vehicle_id,
    });
  }

  for (const task of tasks) {
    const key = task.plate || task.id;
    const existing = merged.get(key);
    if (existing) {
      existing.priority = task.priority || "-";
      existing.location = task.location || existing.location;
      existing.timeWindow = task.time_window || "-";
      existing.taskStatus = task.status || "-";
    } else {
      merged.set(key, {
        id: task.id,
        vehicleName: task.vehicle_name || "-",
        plate: task.plate || "-",
        priority: task.priority || "-",
        location: task.location || "-",
        timeWindow: task.time_window || "-",
        taskStatus: task.status || "-",
        speed: 0,
        fuelLevel: null,
        fleetStatus: "idle",
        engineStatus: "off",
        lastUpdated: "-",
        vehicleId: task.id,
      });
    }
  }

  return Array.from(merged.values());
}

export function MonitoringTable({ vehicles, loading, onRefresh }: MonitoringTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center gap-3 text-slate-400">
            <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
            <span className="text-sm font-medium">Memuat data armada...</span>
          </div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block">location_off</span>
          <p className="text-slate-400 text-sm font-medium">Tidak ada data ditemukan</p>
        </div>
      ) : (
        <table className="w-full text-left">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-4 whitespace-nowrap">Kendaraan</th>
              <th className="px-4 py-4 whitespace-nowrap">Plat</th>
              <th className="px-4 py-4 whitespace-nowrap">Prioritas</th>
              <th className="px-4 py-4 whitespace-nowrap">Lokasi</th>
              <th className="px-4 py-4 whitespace-nowrap">Status</th>
              <th className="px-4 py-4 whitespace-nowrap">Kecepatan</th>
              <th className="px-4 py-4 whitespace-nowrap">Bahan Bakar</th>
              <th className="px-4 py-4 whitespace-nowrap">Mesin</th>
              <th className="px-4 py-4 whitespace-nowrap">Terakhir Diperbarui</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {vehicles.map((v) => (
              <tr
                key={v.id}
                className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/monitoring/detail?id=${v.id}`)}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <p className="font-medium text-slate-900 dark:text-white">{v.vehicleName}</p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-mono text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {v.plate}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {v.priority !== "-" ? (
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${priorityClass[v.priority] || priorityClass.Normal}`}>
                      {v.priority === "High" ? "Tinggi" : v.priority}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg">location_on</span>
                    <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{v.location}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusClass[v.fleetStatus] || statusClass.idle}`}>
                    {statusLabel[v.fleetStatus] || v.fleetStatus}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {v.speed} km/h
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (v.fuelLevel || 0) > 50
                            ? "bg-green-500"
                            : (v.fuelLevel || 0) > 20
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${v.fuelLevel || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {v.fuelLevel != null ? `${v.fuelLevel}%` : "-"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <EngineSwitch
                      vehicleId={v.vehicleId}
                      engineStatus={v.engineStatus}
                      onChanged={() => onRefresh?.()}
                    />
                    <span className={`text-xs font-bold ${
                      v.engineStatus === "on"
                        ? "text-green-600 dark:text-green-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}>
                      {v.engineStatus === "on" ? "ON" : "OFF"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                  {v.lastUpdated && v.lastUpdated !== "-"
                    ? new Date(v.lastUpdated).toLocaleString("id-ID")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

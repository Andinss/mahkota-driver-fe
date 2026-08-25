"use client";
import { useState } from "react";
import { monitoringApi } from "@/lib/api/monitoring";
import type { FleetVehicle } from "./monitoring-map";

interface DetailStatusCardProps {
  onClose?: () => void;
  vehicle?: FleetVehicle | null;
  onStatusChanged?: () => void;
}

const DetailStatusCard = ({ onClose, vehicle, onStatusChanged }: DetailStatusCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!vehicle) return null;

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  const statusColor = vehicle.status === "emergency" ? "red" : vehicle.status === "moving" ? "blue" : "gray";
  const statusLabel = vehicle.status === "emergency" ? "Emergency" : vehicle.status === "moving" ? "Moving" : "Idle";

  const handleShutdown = async () => {
    setIsShuttingDown(true);
    try {
      await monitoringApi.updateVehicleStatus(vehicle.id, "Maintenance");
      setShowConfirm(false);
      onStatusChanged?.();
    } catch (err) {
      console.error("Failed to shutdown vehicle:", err);
    } finally {
      setIsShuttingDown(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 bottom-auto w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[1001] flex flex-col overflow-hidden">
      <div className="relative h-36 bg-slate-200 dark:bg-slate-700">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <button
            onClick={handleClose}
            className="size-8 bg-black/40 text-white hover:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="absolute bottom-3 left-4 text-white w-full pr-8">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold">{vehicle.plate}</h3>
            <span className={`${
              statusColor === "red" ? "bg-red-600" : statusColor === "blue" ? "bg-blue-600" : "bg-gray-500"
            } text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-xs opacity-90 font-medium">
            Updated: <span className="text-green-400">{vehicle.lastUpdated || "Just now"}</span>
          </p>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-lg ring-2 ring-white dark:ring-slate-700 shadow-sm">
            {vehicle.driverName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {vehicle.driverName}
            </p>
            {vehicle.driverPhone && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {vehicle.driverPhone}
              </p>
            )}
          </div>
          {vehicle.driverPhone && (
            <button className="ml-auto size-9 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors ring-1 ring-green-100 dark:ring-green-900/30">
              <span className="material-symbols-outlined text-xl">call</span>
            </button>
          )}
        </div>
        <div className="h-px bg-slate-100 dark:bg-slate-700"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1">
              Speed
            </p>
            <p className="text-sm font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-slate-400 text-base">
                speed
              </span>
              {vehicle.speed !== undefined ? `${vehicle.speed} km/h` : "N/A"}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1">
              Fuel
            </p>
            <p className="text-sm font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-slate-400 text-base">
                local_gas_station
              </span>
              {vehicle.fuelLevel !== undefined ? `${vehicle.fuelLevel}%` : "N/A"}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Status
            </p>
            <p className="text-sm font-medium leading-snug text-slate-800 dark:text-slate-200 capitalize">
              {vehicle.status === "emergency" ? "Geofence Violation - Emergency" : 
               vehicle.status === "moving" ? `Moving at ${vehicle.speed} km/h` : 
               "Parked / Idle"}
            </p>
          </div>
        </div>
        {vehicle.status === "emergency" && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 animate-pulse-slow">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-red-500 mt-0.5 text-lg">
                warning
              </span>
              <div>
                <p className="text-xs font-bold text-red-700 dark:text-red-400">
                  Geofence Violation Alert
                </p>
                <p className="text-xs text-red-600 dark:text-red-300/80 leading-relaxed mt-1">
                  Vehicle has exited the designated zone without authorization.
                </p>
              </div>
            </div>
          </div>
        )}

        {showConfirm ? (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-3">
              Shutdown vehicle <strong>{vehicle.plate}</strong> to Maintenance?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleShutdown}
                disabled={isShuttingDown}
                className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                {isShuttingDown ? "Shutting down..." : "Yes, Shutdown"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isShuttingDown}
                className="flex-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors">
              History
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold text-white transition-colors shadow-lg shadow-red-500/30"
            >
              <span className="material-symbols-outlined text-base">power_settings_new</span>
              Shutdown
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailStatusCard;

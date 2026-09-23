"use client";
import React from "react";
import type { FleetVehicle } from "./monitoring-map";

interface SideStatusProps {
  vehicles: FleetVehicle[];
  onVehicleClick?: (vehicle: FleetVehicle) => void;
  selectedVehicleId?: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

const statusColorMap: Record<string, string> = {
  emergency: "red",
  moving: "blue",
  idle: "gray",
};

const statusLabelMap: Record<string, string> = {
  emergency: "SOS",
  moving: "MOVING",
  idle: "IDLE",
};

const SideStatus = ({ vehicles = [], onVehicleClick, selectedVehicleId, isOpen, onToggle }: SideStatusProps) => {
  const emergencyCount = vehicles.filter((v) => v.status === "emergency").length;
  const movingCount = vehicles.filter((v) => v.status === "moving").length;
  const idleCount = vehicles.filter((v) => v.status === "idle").length;

  return (
    <div className="flex shrink-0">
      <aside
        className={`${isOpen ? "w-72 sm:w-80 lg:w-96" : "w-0"} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        <div
          className={`${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-200 flex flex-col flex-1 w-72 sm:w-80 lg:w-96`}
        >
          {/* Stats Summary */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{emergencyCount}</p>
                <p className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase">Emergency</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{movingCount}</p>
                <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase">Moving</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-slate-600 dark:text-slate-400">{idleCount}</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Idle</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary dark:text-white transition-all"
                placeholder="Search plate or driver..."
                type="text"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs font-medium whitespace-nowrap transition-colors">
              All ({vehicles.length})
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-full text-xs font-medium whitespace-nowrap transition-colors">
              <span className="size-1.5 bg-red-500 rounded-full"></span>
              Emergency ({emergencyCount})
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-medium whitespace-nowrap transition-colors">
              <span className="size-1.5 bg-blue-500 rounded-full"></span>
              Moving ({movingCount})
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium whitespace-nowrap transition-colors">
              <span className="size-1.5 bg-slate-400 rounded-full"></span>
              Idle ({idleCount})
            </button>
          </div>

          {/* Vehicle List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {vehicles.map((vehicle) => {
              const color = statusColorMap[vehicle.status] || "gray";
              const label = statusLabelMap[vehicle.status] || "IDLE";
              const isSelected = selectedVehicleId === vehicle.id;

              return (
                <div
                  key={vehicle.id}
                  onClick={() => onVehicleClick?.(vehicle)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                    isSelected
                      ? "bg-primary/5 dark:bg-primary/10 border-primary/30"
                      : vehicle.status === "emergency"
                        ? "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent"
                  } relative`}
                >
                  {vehicle.status === "emergency" && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-red-500 rounded-r"></div>
                  )}
                  <div className={`size-10 rounded-full flex items-center justify-center shadow-sm shrink-0 ${
                    vehicle.status === "emergency"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                      : vehicle.status === "moving"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}>
                    <span className="material-symbols-outlined text-xl">
                      {vehicle.status === "emergency" ? "warning" : "local_shipping"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {vehicle.plate}
                      </h3>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        color === "red"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : color === "blue"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}>
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {vehicle.driverName}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">
                        {vehicle.status === "emergency" ? "near_me" : vehicle.status === "moving" ? "speed" : "history"}
                      </span>
                      {vehicle.status === "emergency"
                        ? "Violation"
                        : vehicle.status === "moving"
                          ? `${vehicle.speed} km/h`
                          : vehicle.lastUpdated || "Idle"}
                      {vehicle.engineStatus !== undefined && (
                        <span className={`ml-1 px-1 py-0.5 rounded text-[9px] font-bold ${
                          vehicle.engineStatus === "on"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                        }`}>
                          E/{vehicle.engineStatus === "on" ? "ON" : "OFF"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}

            {vehicles.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No vehicles found
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="self-center -ml-px w-5 h-14 bg-white dark:bg-slate-900 border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors z-10 shadow-sm shrink-0"
      >
        <span className="material-symbols-outlined text-base">
          {isOpen ? "chevron_left" : "chevron_right"}
        </span>
      </button>
    </div>
  );
};

export default SideStatus;

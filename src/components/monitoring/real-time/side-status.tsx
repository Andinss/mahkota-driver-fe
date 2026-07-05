"use client";
import React from "react";
import type { FleetVehicle } from "./monitoring-map";

interface SideStatusProps {
  vehicles: FleetVehicle[];
  onVehicleClick?: (vehicle: FleetVehicle) => void;
  selectedVehicleId?: string | null;
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

const SideStatus = ({ vehicles = [], onVehicleClick, selectedVehicleId }: SideStatusProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative flex shrink-0">
      <aside
        className={`${isOpen ? "w-72 sm:w-80 lg:w-96" : "w-0"} bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-700 flex flex-col z-20 shadow-lg transition-all duration-300 overflow-hidden`}
      >
        <div
          className={`${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-200 flex flex-col flex-1 w-72 sm:w-80 lg:w-96 overflow-hidden`}
        >
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Fleet Status
              </h2>
              <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                {vehicles.length} Total
              </span>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-100 dark:bg-slate-800 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary dark:text-white transition-all"
                placeholder="Search plate or driver..."
                type="text"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-xs font-medium whitespace-nowrap transition-colors">
                All
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-full text-xs font-medium whitespace-nowrap transition-colors">
                <span className="size-2 bg-red-500 rounded-full"></span>{" "}
                Emergency
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-full text-xs font-medium whitespace-nowrap transition-colors">
                Moving
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-xs font-medium whitespace-nowrap transition-colors">
                Idle
              </button>
            </div>
          </div>

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
                      ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      : vehicle.status === "emergency"
                        ? "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent"
                  } shadow-sm relative`}
                >
                  {vehicle.status === "emergency" && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-red-500 rounded-r"></div>
                  )}
                  <div className={`size-10 rounded-full flex items-center justify-center shadow-sm shrink-0 ${
                    vehicle.status === "emergency"
                      ? "bg-white dark:bg-slate-800 text-red-500 border border-red-100 dark:border-red-900/50"
                      : vehicle.status === "moving"
                        ? "bg-slate-100 dark:bg-slate-800 text-primary group-hover:bg-white dark:group-hover:bg-slate-700"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}>
                    <span className="material-symbols-outlined">
                      {vehicle.status === "emergency" ? "warning" : "local_shipping"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">
                        {vehicle.plate}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
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
                      Driver: {vehicle.driverName}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        {vehicle.status === "emergency" ? "near_me" : vehicle.status === "moving" ? "speed" : "history"}
                      </span>
                      {vehicle.status === "emergency"
                        ? "Geofence Violation"
                        : vehicle.status === "moving"
                          ? `${vehicle.speed} km/h`
                          : vehicle.lastUpdated || "Idle"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-14 bg-white dark:bg-surface-dark border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors z-30 shadow-md"
      >
        <span className="material-symbols-outlined text-[16px]">
          {isOpen ? "chevron_left" : "chevron_right"}
        </span>
      </button>
    </div>
  );
};

export default SideStatus;

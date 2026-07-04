"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { FleetVehicle } from "@/components/monitoring/real-time/monitoring-map";
import DetailStatusCard from "@/components/monitoring/real-time/detail-status-car";
import SideStatus from "@/components/monitoring/real-time/side-status";
import { PermissionGuard } from "@/components/auth-guard-permission";

const MonitoringMap = dynamic(
  () => import("@/components/monitoring/real-time/monitoring-map"),
  { ssr: false },
);

const defaultVehicles: FleetVehicle[] = [
  {
    id: "1",
    plate: "B 1234 KKY",
    driverName: "Budi Santoso",
    driverPhone: "+62 812 3456 7890",
    latitude: -6.2088,
    longitude: 106.8456,
    status: "emergency",
    speed: 0,
    fuelLevel: 45,
    lastUpdated: "Just now",
  },
  {
    id: "2",
    plate: "D 5678 AB",
    driverName: "Siti Aminah",
    latitude: -6.175,
    longitude: 106.827,
    status: "moving",
    speed: 45,
    fuelLevel: 72,
    lastUpdated: "1 min ago",
  },
  {
    id: "3",
    plate: "B 9988 XYZ",
    driverName: "Ahmad Dhani",
    latitude: -6.255,
    longitude: 106.89,
    status: "moving",
    speed: 62,
    fuelLevel: 55,
    lastUpdated: "30s ago",
  },
  {
    id: "4",
    plate: "F 2233 LL",
    driverName: "Eko Prasetyo",
    latitude: -6.18,
    longitude: 106.8,
    status: "idle",
    speed: 0,
    fuelLevel: 30,
    lastUpdated: "2h ago",
  },
];

const RealtimeMonitoring = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [vehicles] = useState<FleetVehicle[]>(defaultVehicles);

  const handleVehicleClick = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseDetail = () => {
    setSelectedVehicle(null);
  };

  return (
    <PermissionGuard permission="driver.read.all" fallbackPermission="driver.read.own">
    <div className="relative flex flex-1 mx-2 my-2 md:mx-4 md:my-4 lg:m-8 overflow-hidden">
      <SideStatus />

      <div className="flex-1 relative">
        <MonitoringMap
          vehicles={vehicles}
          center={[-6.2088, 106.8456]}
          zoom={12}
          onVehicleClick={handleVehicleClick}
        />

        <div className="absolute top-4 left-4 z-10 flex flex-col sm:flex-row gap-3 pointer-events-none">
          <div className="bg-white dark:bg-surface-dark p-3 pr-6 rounded-lg shadow-lg border border-red-100 dark:border-red-900/30 flex items-center gap-3 pointer-events-auto">
            <div className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 p-2 rounded-lg">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Active Emergencies
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                {vehicles.filter((v) => v.status === "emergency").length}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-3 pr-6 rounded-lg shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-3 pointer-events-auto">
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-2 rounded-lg">
              <span className="material-symbols-outlined text-xl">near_me</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Geofence Alerts
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                {vehicles.filter((v) => v.status === "emergency").length * 4}
              </p>
            </div>
          </div>
        </div>

        {selectedVehicle && (
          <DetailStatusCard onClose={handleCloseDetail} vehicle={selectedVehicle} />
        )}

        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10 pointer-events-none">
          <button className="size-10 bg-white dark:bg-slate-800 rounded-lg shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 pointer-events-auto">
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </div>
    </div>
    </PermissionGuard>
  );
};

export default RealtimeMonitoring;

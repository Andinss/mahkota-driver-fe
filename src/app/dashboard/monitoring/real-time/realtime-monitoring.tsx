"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useRef } from "react";
import type { FleetVehicle } from "@/components/monitoring/real-time/monitoring-map";
import DetailStatusCard from "@/components/monitoring/real-time/detail-status-car";
import SideStatus from "@/components/monitoring/real-time/side-status";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { monitoringApi } from "@/lib/api/monitoring";

const MonitoringMap = dynamic(
  () => import("@/components/monitoring/real-time/monitoring-map"),
  { ssr: false },
);

const POLL_INTERVAL = 10000;

function mapFleetLocationToVehicle(loc: any): FleetVehicle {
  return {
    id: loc.vehicle_id,
    plate: loc.plate,
    driverName: loc.driver_name || loc.vehicle_name || loc.plate,
    driverPhone: loc.driver_phone || undefined,
    latitude: Number(loc.latitude),
    longitude: Number(loc.longitude),
    status: loc.status,
    speed: Number(loc.speed) || 0,
    fuelLevel: loc.fuel_level !== null ? Number(loc.fuel_level) : undefined,
    lastUpdated: loc.last_updated
      ? new Date(loc.last_updated).toLocaleTimeString()
      : undefined,
  };
}

const RealtimeMonitoring = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await monitoringApi.getFleetLocations();
      if (mountedRef.current && res.success) {
        const mapped = (res.data || []).map(mapFleetLocationToVehicle);
        setVehicles(mapped);
      }
    } catch {
      // silent fail — keep last known positions
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchLocations();

    const interval = setInterval(fetchLocations, POLL_INTERVAL);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchLocations]);

  const handleVehicleClick = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseDetail = () => {
    setSelectedVehicle(null);
  };

  const emergencyCount = vehicles.filter((v) => v.status === "emergency").length;

  return (
    <PermissionGuard permission="driver.read.all" fallbackPermission="driver.read.own">
    <div className="relative flex flex-1 mx-2 my-2 md:mx-4 md:my-4 lg:m-8 overflow-hidden">
      <SideStatus
        vehicles={vehicles}
        onVehicleClick={handleVehicleClick}
        selectedVehicleId={selectedVehicle?.id}
      />

      <div className="flex-1 relative">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-slate-400 text-sm">Loading fleet locations...</div>
          </div>
        ) : (
          <MonitoringMap
            vehicles={vehicles}
            center={[-6.2088, 106.8456]}
            zoom={12}
            onVehicleClick={handleVehicleClick}
          />
        )}

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
                {emergencyCount}
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
                {emergencyCount}
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

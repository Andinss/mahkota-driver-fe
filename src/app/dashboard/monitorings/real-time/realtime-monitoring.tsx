"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useRef } from "react";
import type { FleetVehicle } from "@/components/monitoring/real-time/monitoring-map";
import DetailStatusCard from "@/components/monitoring/real-time/detail-status-car";
import SideStatus from "@/components/monitoring/real-time/side-status";
import { PermissionGuard } from "@/components/auth-guard-permission";
import type { FleetLocation } from "@/lib/types/monitoring";
import { monitoringApi } from "@/lib/api/monitoring";

const MonitoringMap = dynamic(
  () => import("@/components/monitoring/real-time/monitoring-map"),
  { ssr: false },
);

const POLL_INTERVAL = 10000;

function mapFleetLocationToVehicle(loc: FleetLocation): FleetVehicle {
  return {
    id: loc.vehicle_id || loc.plate,
    plate: loc.plate,
    driverName: loc.driver_name || loc.vehicle_name || loc.plate,
    driverPhone: loc.driver_phone || undefined,
    latitude: Number(loc.latitude),
    longitude: Number(loc.longitude),
    status: loc.status,
    engineStatus: loc.engine_status || "off",
    speed: Number(loc.speed) || 0,
    lastUpdated: loc.last_updated
      ? new Date(loc.last_updated).toLocaleTimeString()
      : undefined,
  };
}

const RealtimeMonitoring = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    setIsSidebarOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedVehicle(null);
  };

  return (
    <PermissionGuard permission="driver.read.all" fallbackPermission="driver.read.own">
      <div className="flex flex-1 bg-white dark:bg-slate-950 mx-2 my-2 md:mx-4 md:my-4 lg:m-8">
        {/* Sidebar */}
        <SideStatus
          vehicles={vehicles}
          onVehicleClick={handleVehicleClick}
          selectedVehicleId={selectedVehicle?.id}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Toolbar */}
          <div className="h-10 border-b border-slate-200 dark:border-slate-700 flex items-center px-3 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Real-time Fleet Monitoring
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>

          {/* Map Area */}
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
                selectedVehicle={selectedVehicle}
              />
            )}
            {selectedVehicle && (
              <DetailStatusCard onClose={handleCloseDetail} vehicle={selectedVehicle} onStatusChanged={fetchLocations} />
            )}
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
};

export default RealtimeMonitoring;

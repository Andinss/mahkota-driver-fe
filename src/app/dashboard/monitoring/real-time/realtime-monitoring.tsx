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
    engineStatus: loc.engine_status || "off",
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
  const [isExpanded, setIsExpanded] = useState(false);
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  const handleVehicleClick = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseDetail = () => {
    setSelectedVehicle(null);
  };

  return (
    <PermissionGuard permission="driver.read.all" fallbackPermission="driver.read.own">
      <div className={`flex flex-1 bg-white dark:bg-slate-950 ${isExpanded ? "fixed inset-0 z-50" : "mx-2 my-2 md:mx-4 md:my-4 lg:m-8"}`}>
        {/* Sidebar */}
        {!isExpanded && (
          <SideStatus
            vehicles={vehicles}
            onVehicleClick={handleVehicleClick}
            selectedVehicleId={selectedVehicle?.id}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Toolbar */}
          <div className="h-12 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Real-time Fleet Monitoring
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full uppercase tracking-wider">
                Live
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                className="h-8 px-3 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors"
                title="Center on my location"
              >
                <span className="material-symbols-outlined text-lg">my_location</span>
                <span className="hidden sm:inline">Locate</span>
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 px-3 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors"
                title={isExpanded ? "Exit fullscreen" : "Fullscreen"}
              >
                <span className="material-symbols-outlined text-lg">
                  {isExpanded ? "fullscreen_exit" : "fullscreen"}
                </span>
                <span className="hidden sm:inline">{isExpanded ? "Exit" : "Expand"}</span>
              </button>
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
              />
            )}
          </div>
        </div>

        {/* Detail Card - slides in from right */}
        {selectedVehicle && (
          <DetailStatusCard onClose={handleCloseDetail} vehicle={selectedVehicle} onStatusChanged={fetchLocations} />
        )}
      </div>
    </PermissionGuard>
  );
};

export default RealtimeMonitoring;

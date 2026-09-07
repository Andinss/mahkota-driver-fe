"use client";
import { useState } from "react";
import { monitoringApi } from "@/lib/api/monitoring";
import { notificationApi } from "@/lib/api/notification";
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
  const [showActionAlert, setShowActionAlert] = useState(false);
  const [actionAlertMessage, setActionAlertMessage] = useState("");
  const [isSendingAction, setIsSendingAction] = useState(false);

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

  const handleContactDriver = async () => {
    setIsSendingAction(true);
    try {
      await notificationApi.create({
        type: "driver_contact",
        title: `Contact Driver: ${vehicle.plate}`,
        message: `Field team is attempting to contact driver of vehicle ${vehicle.plate} (${vehicle.driverName}). Location: ${vehicle.latitude.toFixed(6)}, ${vehicle.longitude.toFixed(6)}.`,
        vehicle_id: vehicle.id,
        metadata: {
          action: "contact_driver",
          latitude: vehicle.latitude,
          longitude: vehicle.longitude,
        },
      });
      setActionAlertMessage(`Contact request sent to driver of ${vehicle.plate}`);
      setShowActionAlert(true);
      setTimeout(() => setShowActionAlert(false), 3000);
    } catch {
      setActionAlertMessage("Failed to send contact request");
      setShowActionAlert(true);
      setTimeout(() => setShowActionAlert(false), 3000);
    } finally {
      setIsSendingAction(false);
    }
  };

  const handleVehicleRetrieval = async () => {
    setIsSendingAction(true);
    try {
      await notificationApi.create({
        type: "vehicle_retrieval",
        title: `Vehicle Retrieval: ${vehicle.plate}`,
        message: `Vehicle retrieval initiated for ${vehicle.plate} (${vehicle.driverName}). Vehicle status changed to Reserved. Last known location: ${vehicle.latitude.toFixed(6)}, ${vehicle.longitude.toFixed(6)}.`,
        vehicle_id: vehicle.id,
        metadata: {
          action: "retrieval",
          latitude: vehicle.latitude,
          longitude: vehicle.longitude,
        },
      });
      await monitoringApi.updateVehicleStatus(vehicle.id, "Reserved");
      setActionAlertMessage(`Retrieval initiated for ${vehicle.plate}`);
      setShowActionAlert(true);
      onStatusChanged?.();
      setTimeout(() => setShowActionAlert(false), 3000);
    } catch {
      setActionAlertMessage("Failed to initiate retrieval");
      setShowActionAlert(true);
      setTimeout(() => setShowActionAlert(false), 3000);
    } finally {
      setIsSendingAction(false);
    }
  };

  const handleEmergencyAssist = async () => {
    setIsSendingAction(true);
    try {
      await notificationApi.create({
        type: "emergency_assist",
        title: `Emergency Assistance: ${vehicle.plate}`,
        message: `URGENT: Emergency assistance requested for vehicle ${vehicle.plate} (${vehicle.driverName}). Vehicle may be outside operational area. Location: ${vehicle.latitude.toFixed(6)}, ${vehicle.longitude.toFixed(6)}. Immediate response required.`,
        vehicle_id: vehicle.id,
        metadata: {
          action: "emergency_assist",
          latitude: vehicle.latitude,
          longitude: vehicle.longitude,
          priority: "critical",
        },
      });
      setActionAlertMessage(`Emergency assistance requested for ${vehicle.plate}`);
      setShowActionAlert(true);
      setTimeout(() => setShowActionAlert(false), 5000);
    } catch {
      setActionAlertMessage("Failed to request emergency assistance");
      setShowActionAlert(true);
      setTimeout(() => setShowActionAlert(false), 3000);
    } finally {
      setIsSendingAction(false);
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
            <button
              onClick={handleContactDriver}
              disabled={isSendingAction}
              className="ml-auto size-9 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors ring-1 ring-green-100 dark:ring-green-900/30 disabled:opacity-50"
            >
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
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1">
              Engine
            </p>
            <p className={`text-sm font-bold flex items-center gap-1.5 ${
              vehicle.engineStatus === "on"
                ? "text-green-700 dark:text-green-400"
                : "text-slate-500 dark:text-slate-400"
            }`}>
              <span className={`material-symbols-outlined text-base ${
                vehicle.engineStatus === "on" ? "text-green-500" : "text-slate-400"
              }`}>
                power_settings_new
              </span>
              {vehicle.engineStatus === "on" ? "Running" : "Off"}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Status
            </p>
            <p className="text-sm font-medium leading-snug text-slate-800 dark:text-slate-200 capitalize">
              {vehicle.status === "emergency" ? "Geofence Violation - Outside Operational Area" : 
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
                  Vehicle has exited the operational area. Immediate action required.
                </p>
              </div>
            </div>
          </div>
        )}

        {showActionAlert && (
          <div className={`p-3 rounded-lg border ${
            actionAlertMessage.includes("Failed")
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          }`}>
            <p className={`text-xs font-medium ${
              actionAlertMessage.includes("Failed")
                ? "text-red-700 dark:text-red-400"
                : "text-green-700 dark:text-green-400"
            }`}>
              {actionAlertMessage}
            </p>
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
          <div className="space-y-3 pt-2">
            {/* Action Buttons for Field Team */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleContactDriver}
                disabled={isSendingAction}
                className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg text-green-700 dark:text-green-400 transition-colors border border-green-200 dark:border-green-800 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                <span className="text-[10px] font-bold">Hubungi Driver</span>
              </button>
              <button
                onClick={handleVehicleRetrieval}
                disabled={isSendingAction}
                className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg text-orange-700 dark:text-orange-400 transition-colors border border-orange-200 dark:border-orange-800 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">local_shipping</span>
                <span className="text-[10px] font-bold">Penarikan</span>
              </button>
              <button
                onClick={handleEmergencyAssist}
                disabled={isSendingAction}
                className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg text-red-700 dark:text-red-400 transition-colors border border-red-200 dark:border-red-800 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">emergency</span>
                <span className="text-[10px] font-bold">Bantuan Darurat</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailStatusCard;

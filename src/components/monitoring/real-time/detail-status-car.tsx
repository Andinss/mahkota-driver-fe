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
    <div className="absolute top-2 right-2 bottom-auto w-60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700 z-[1001] flex flex-col overflow-hidden rounded-xl">
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 ${
        statusColor === "red" ? "bg-red-50 dark:bg-red-900/20" :
        statusColor === "blue" ? "bg-blue-50 dark:bg-blue-900/20" :
        "bg-slate-50 dark:bg-slate-700/50"
      }`}>
        <span className={`material-symbols-outlined text-base ${
          statusColor === "red" ? "text-red-500" :
          statusColor === "blue" ? "text-blue-500" :
          "text-slate-400 dark:text-slate-500"
        }`}>local_shipping</span>
        <span className="text-[11px] font-bold text-slate-900 dark:text-white">{vehicle.plate}</span>
        <span className={`ml-auto ${
          statusColor === "red" ? "bg-red-600" : statusColor === "blue" ? "bg-blue-600" : "bg-gray-500"
        } text-white text-[8px] px-1 py-px rounded font-bold uppercase`}>
          {statusLabel}
        </span>
      </div>
      <div className="p-2.5 space-y-2">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-[10px]">
            {vehicle.driverName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{vehicle.driverName}</p>
            {vehicle.driverPhone && (
              <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{vehicle.driverPhone}</p>
            )}
          </div>
          {vehicle.driverPhone && (
            <button
              onClick={handleContactDriver}
              disabled={isSendingAction}
              className="shrink-0 size-6 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xs">call</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-1 rounded border border-slate-100 dark:border-slate-700/50 flex items-center gap-1">
            <span className="material-symbols-outlined text-slate-400 text-[10px]">speed</span>
            <span className="text-[10px] font-bold text-slate-900 dark:text-white">{vehicle.speed !== undefined ? `${vehicle.speed}` : "N/A"}</span>
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-1 rounded border border-slate-100 dark:border-slate-700/50 flex items-center gap-1">
            <span className="material-symbols-outlined text-slate-400 text-[10px]">local_gas_station</span>
            <span className="text-[10px] font-bold text-slate-900 dark:text-white">{vehicle.fuelLevel !== undefined ? `${vehicle.fuelLevel}%` : "N/A"}</span>
          </div>
          <div className={`flex-1 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-1 rounded border border-slate-100 dark:border-slate-700/50 flex items-center gap-1 ${
            vehicle.engineStatus === "on" ? "text-green-700 dark:text-green-400" : "text-slate-400 dark:text-slate-500"
          }`}>
            <span className={`material-symbols-outlined text-[10px] ${
              vehicle.engineStatus === "on" ? "text-green-500" : "text-slate-400"
            }`}>power_settings_new</span>
            <span className="text-[10px] font-bold">{vehicle.engineStatus === "on" ? "On" : "Off"}</span>
          </div>
        </div>

        {vehicle.status === "emergency" && (
          <div className="bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-100 dark:border-red-900/30 flex items-center gap-1">
            <span className="material-symbols-outlined text-red-500 text-[10px]">warning</span>
            <p className="text-[9px] font-bold text-red-600 dark:text-red-400">Geofence Violation</p>
          </div>
        )}

        {showActionAlert && (
          <div className={`px-2 py-1 rounded border ${
            actionAlertMessage.includes("Failed")
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          }`}>
            <p className={`text-[9px] font-medium ${
              actionAlertMessage.includes("Failed")
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}>
              {actionAlertMessage}
            </p>
          </div>
        )}

        {showConfirm ? (
          <div className="bg-orange-50 dark:bg-orange-900/20 px-2 py-1.5 rounded border border-orange-200 dark:border-orange-800">
            <p className="text-[10px] font-medium text-orange-800 dark:text-orange-300 mb-1.5">
              Shutdown <strong>{vehicle.plate}</strong>?
            </p>
            <div className="flex gap-1">
              <button
                onClick={handleShutdown}
                disabled={isShuttingDown}
                className="flex-1 px-2 py-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded text-[10px] font-semibold transition-colors"
              >
                {isShuttingDown ? "..." : "Yes"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isShuttingDown}
                className="flex-1 px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded text-[10px] font-semibold transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={handleContactDriver}
              disabled={isSendingAction}
              className="flex-1 flex flex-col items-center gap-px py-1.5 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded text-green-700 dark:text-green-400 transition-colors border border-green-200 dark:border-green-800 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xs">call</span>
              <span className="text-[7px] font-bold leading-none">Hubungi</span>
            </button>
            <button
              onClick={handleVehicleRetrieval}
              disabled={isSendingAction}
              className="flex-1 flex flex-col items-center gap-px py-1.5 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded text-orange-700 dark:text-orange-400 transition-colors border border-orange-200 dark:border-orange-800 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xs">local_shipping</span>
              <span className="text-[7px] font-bold leading-none">Tarik</span>
            </button>
            <button
              onClick={handleEmergencyAssist}
              disabled={isSendingAction}
              className="flex-1 flex flex-col items-center gap-px py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded text-red-700 dark:text-red-400 transition-colors border border-red-200 dark:border-red-800 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xs">emergency</span>
              <span className="text-[7px] font-bold leading-none">Darurat</span>
            </button>
          </div>
        )}

        {!showConfirm && (
          <div className="flex gap-1">
            <button className="flex-1 flex items-center justify-center gap-0.5 px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-[10px] font-semibold text-slate-700 dark:text-slate-200 transition-colors">
              <span className="material-symbols-outlined text-[9px]">history</span>
              History
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex-1 flex items-center justify-center gap-0.5 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-[10px] font-semibold text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[9px]">power_settings_new</span>
              Shutdown
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailStatusCard;

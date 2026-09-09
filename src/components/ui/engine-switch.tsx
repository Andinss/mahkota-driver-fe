"use client";

import { useState } from "react";
import { monitoringApi } from "@/lib/api/monitoring";
import { confirmToast, toastSuccess, toastError } from "@/components/ui/toast-provider";

interface EngineSwitchProps {
  vehicleId: string;
  engineStatus?: "on" | "off";
  onChanged?: (engineStatus: "on" | "off") => void;
}

export function EngineSwitch({ vehicleId, engineStatus = "off", onChanged }: EngineSwitchProps) {
  const [isOn, setIsOn] = useState<boolean>(engineStatus === "on");
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const next = !isOn ? "on" : "off";

    if (next === "off") {
      const confirmed = await confirmToast({
        title: "Matikan Mesin",
        message: "Apakah Anda yakin ingin mematikan mesin kendaraan ini?",
        confirmText: "Ya, Matikan",
        variant: "danger",
      });
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      await monitoringApi.updateVehicleEngine(vehicleId, next);
      setIsOn(next === "on");
      onChanged?.(next);
      toastSuccess(`Mesin kendaraan berhasil ${next === "on" ? "dinyalakan" : "dimatikan"}`);
    } catch {
      toastError("Gagal mengubah status mesin kendaraan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-pressed={isOn}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
        isOn ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
      } focus:ring-green-500/40`}
      title={isOn ? "Mesin menyala - klik untuk matikan" : "Mesin mati - klik untuk nyalakan"}
    >
      <span className="sr-only">{isOn ? "Engine ON" : "Engine OFF"}</span>
      <span
        className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${
          isOn ? "translate-x-6" : "translate-x-1"
        }`}
      />
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="size-3 border-2 border-transparent border-t-white rounded-full animate-spin" />
        </span>
      )}
    </button>
  );
}

"use client";

import { Select } from "@/components/ui/select";
import type { VehicleStatus } from "@/lib/types/vehicle";

interface StatusSelectProps {
  value?: VehicleStatus;
  onChange?: (status: VehicleStatus) => void;
  disabled?: boolean;
}

const statusOptions: Array<{ value: VehicleStatus; label: string }> = [
  { value: "Available", label: "Available for Rent" },
  { value: "rented", label: "Rented" },
  { value: "Maintenance", label: "In Maintenance" },
  { value: "Reserved", label: "Reserved" },
];

export function StatusSelect({
  value = "Available",
  onChange,
  disabled = false,
}: StatusSelectProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-amber-500 text-xl">tune</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Status Kendaraan
          </h3>
          <p className="text-xs text-slate-400">Atur status awal operasional kendaraan</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-bold text-[#111418] dark:text-white"
          htmlFor="status"
        >
          Initial Operational Status
        </label>
        <div className="relative">
          <Select
            id="status"
            value={value}
            onChange={(e) => onChange?.(e.target.value as VehicleStatus)}
            disabled={disabled}
            className="appearance-none pr-10"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#617589] dark:text-slate-400">
            expand_more
          </span>
        </div>
        <p className="text-xs text-[#617589] dark:text-slate-400">
          Set the initial availability of the vehicle upon registration.
        </p>
      </div>
    </div>
  );
}

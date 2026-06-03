"use client";

import { Select } from "@/components/ui/select";

export type VehicleStatus = "Available" | "Maintenance" | "Service" | "Reserved";

interface StatusSelectProps {
  value?: VehicleStatus;
  onChange?: (status: VehicleStatus) => void;
  disabled?: boolean;
}

const statusOptions: Array<{ value: VehicleStatus; label: string }> = [
  { value: "Available", label: "Available for Rent" },
  { value: "Maintenance", label: "In Maintenance" },
  { value: "Service", label: "Out of Service" },
  { value: "Reserved", label: "Reserved" },
];

export function StatusSelect({
  value = "Available",
  onChange,
  disabled = false,
}: StatusSelectProps) {
  return (
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
  );
}

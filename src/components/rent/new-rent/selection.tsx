"use client";

import { SelectSearch } from "@/components/ui/select-input-search";
import { useState } from "react";

interface FormErrors {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  dailyRate?: string;
  serverDriverId?: string;
  serverVehicleId?: string;
}

interface SelectOption {
  label: string;
  value: string;
  image?: string;
  dailyRate?: number;
  badges?: string[];
}

interface SelectionFormProps {
  onDataChange?: (data: {
    vehicleId?: string;
    driverId?: string;
    driverType?: string;
  }) => void;
  initialData?: {
    vehicleId?: string;
    driverId?: string;
  };
  error?: FormErrors;
  driverOptions?: SelectOption[];
  vehicleOptions?: SelectOption[];
  serverErrors?: Record<string, string[]>;
}

const SelectionForm = ({
  onDataChange,
  initialData,
  error,
  driverOptions,
  vehicleOptions,
  serverErrors = {},
}: SelectionFormProps) => {
  const effectiveDriverOptions = driverOptions || [];
  const effectiveVehicleOptions = vehicleOptions || [];

  const [selectedDriver, setSelectedDriver] = useState<string | undefined>(
    initialData?.driverId
  );
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(
    initialData?.vehicleId
  );

  const handleDriverChange = (value: string) => {
    setSelectedDriver(value);
    // Kendaraan di-reset saat ganti driver karena daftar mobil
    // difilter mengikuti membership driver terpilih
    setSelectedVehicle(undefined);
    onDataChange?.({ driverId: value, vehicleId: "" });
  };

  const handleVehicleChange = (value: string) => {
    setSelectedVehicle(value);
    onDataChange?.({ vehicleId: value, driverId: selectedDriver });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">person_search</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Pilih Driver & Kendaraan
          </h3>
          <p className="text-xs text-slate-400">Tentukan driver dan kendaraan untuk sewa ini</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-slate-400 text-base">person</span>
            Driver Aktif
          </label>
          <SelectSearch
            options={effectiveDriverOptions}
            placeholder="Cari driver..."
            value={selectedDriver}
            onChange={handleDriverChange}
            error={error?.serverDriverId || error?.driverId}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-slate-400 text-base">directions_car</span>
            Kendaraan Tersedia
          </label>
          <SelectSearch
            options={effectiveVehicleOptions}
            placeholder={
              selectedDriver
                ? "Cari kendaraan..."
                : "Pilih driver terlebih dahulu..."
            }
            value={selectedVehicle}
            onChange={handleVehicleChange}
            error={error?.serverVehicleId || error?.vehicleId}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectionForm;

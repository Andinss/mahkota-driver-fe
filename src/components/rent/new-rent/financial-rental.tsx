"use client";

import { CurrencyInput } from "@/components/ui/currency-input";
import { Select } from "@/components/ui/select";
import { useState } from "react";

interface FormErrors {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  dailyRate?: string;
}

interface FinancialRentalProps {
  onDataChange?: (data: {
    dailyRate: number;
  }) => void;
  onRentalTypeChange?: (data: {
    rentalDuration?: string;
    rentalService?: string;
  }) => void;
  initialData?: {
    dailyRate?: number;
    rentalDuration?: string;
    rentalService?: string;
  };
  error?: FormErrors;
}

const parseCurrency = (val: string) =>
  val ? parseInt(val.replace(/\./g, ""), 10) : 0;

const FinancialRental = ({
  onDataChange,
  onRentalTypeChange,
  initialData,
  error,
}: FinancialRentalProps) => {
  const initRate = initialData?.dailyRate
    ? initialData.dailyRate.toString()
    : "";
  const [dailyRate, setDailyRate] = useState<string>(initRate);
  const [rentalDuration, setRentalDuration] = useState<string>(
    initialData?.rentalDuration || ""
  );
  const [rentalService, setRentalService] = useState<string>(
    initialData?.rentalService || ""
  );

  const handleDailyRateChange = (val: string) => {
    setDailyRate(val);
    onDataChange?.({
      dailyRate: parseCurrency(val),
    });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRentalDuration(val);
    onRentalTypeChange?.({
      rentalDuration: val,
      rentalService,
    });
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRentalService(val);
    onRentalTypeChange?.({
      rentalDuration,
      rentalService: val,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-violet-500 text-xl">account_balance</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Detail Keuangan
          </h3>
          <p className="text-xs text-slate-400">Atur tarif dan tipe sewa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Select
            id="rentalDuration"
            name="rentalDuration"
            label="Tipe Durasi"
            value={rentalDuration}
            onChange={handleDurationChange}
          >
            <option value="">Pilih Durasi</option>
            <option value="harian">Harian</option>
            <option value="mingguan">Mingguan</option>
            <option value="bulanan">Bulanan</option>
            <option value="tahunan">Tahunan</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Select
            id="rentalService"
            name="rentalService"
            label="Jenis Layanan"
            value={rentalService}
            onChange={handleServiceChange}
          >
            <option value="">Pilih Layanan</option>
            <option value="lepas kunci">Lepas Kunci</option>
            <option value="pakai supir">Pakai Supir</option>
          </Select>
        </div>
        <div className="space-y-2">
          <CurrencyInput
            id="dailyRate"
            name="dailyRate"
            label="Tarif Harian"
            placeholder="0"
            value={dailyRate}
            onChange={handleDailyRateChange}
            error={error?.dailyRate}
          />
          <p className="text-[10px] text-slate-400 italic">
            *Otomatis dari data kendaraan
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialRental;

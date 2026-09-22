"use client";

import { DateInput } from "@/components/ui/date-input";
import { useState } from "react";

interface FormErrors {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  dailyRate?: string;
}

interface PeriodProps {
  onDataChange?: (data: {
    startDate: string;
    endDate: string;
    duration: number;
  }) => void;
  initialData?: {
    startDate?: string;
    endDate?: string;
  };
  error?: FormErrors;
}

const calculateDuration = (start: string, end: string) => {
  if (start && end) {
    const startObj = new Date(start);
    const endObj = new Date(end);
    const diffTime = endObj.getTime() - startObj.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }
  return null;
};

const toLocalDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const Period = ({ onDataChange, initialData, error }: PeriodProps) => {
  const [startDate, setStartDate] = useState<string>(initialData?.startDate || "");
  const [endDate, setEndDate] = useState<string>(initialData?.endDate || "");
  const initDuration = calculateDuration(initialData?.startDate || "", initialData?.endDate || "");
  const [duration, setDuration] = useState<number | null>(initDuration);

  // Tanggal mulai hanya boleh hari ini atau besok
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const minStartDate = toLocalDateStr(today);
  const maxStartDate = toLocalDateStr(tomorrow);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newStart = e.target.value;
    if (newStart) {
      if (newStart < minStartDate) newStart = minStartDate;
      if (newStart > maxStartDate) newStart = maxStartDate;
    }
    setStartDate(newStart);
    const newDuration = calculateDuration(newStart, endDate);
    setDuration(newDuration);
    if (onDataChange && newDuration !== null) {
      onDataChange({ startDate: newStart, endDate, duration: newDuration });
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setEndDate(newEnd);
    const newDuration = calculateDuration(startDate, newEnd);
    setDuration(newDuration);
    if (onDataChange && newDuration !== null) {
      onDataChange({ startDate, endDate: newEnd, duration: newDuration });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-emerald-500 text-xl">calendar_month</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Periode Sewa
          </h3>
          <p className="text-xs text-slate-400">Tentukan durasi waktu sewa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        <div className="space-y-2">
          <DateInput
            id="StartDate"
            name="startDate"
            label="Tanggal Mulai"
            required
            value={startDate}
            min={minStartDate}
            max={maxStartDate}
            onChange={handleStartChange}
            error={error?.startDate}
          />
          <p className="text-[10px] text-slate-400 italic">
            *Hanya bisa hari ini atau besok
          </p>
        </div>
        <div className="space-y-2">
          <DateInput
            id="EndDate"
            name="endDate"
            label="Tanggal Selesai"
            required
            value={endDate}
            onChange={handleEndChange}
            error={error?.endDate}
          />
        </div>
        <div className="h-[68px] bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <span className="material-symbols-outlined text-lg mb-0.5">schedule</span>
          <p className="text-lg font-black leading-none">
            {duration !== null
              ? `${duration} Hari`
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Period;

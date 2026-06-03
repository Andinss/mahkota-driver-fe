"use client";

import { DateInput } from "@/components/ui/date-input";
import { useState } from "react";

interface FormErrors {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  dailyRate?: string;
  depositAmount?: string;
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

const Period = ({ onDataChange, initialData, error }: PeriodProps) => {
  const [startDate, setStartDate] = useState<string>(initialData?.startDate || "");
  const [endDate, setEndDate] = useState<string>(initialData?.endDate || "");
  const initDuration = calculateDuration(initialData?.startDate || "", initialData?.endDate || "");
  const [duration, setDuration] = useState<number | null>(initDuration);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
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
    <div>
      <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            2
          </span>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            Rental Period
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <DateInput
              id="StartDate"
              name="startDate"
              label="Start Date"
              required
              value={startDate}
              onChange={handleStartChange}
              error={error?.startDate}
            />
          </div>
          <div className="space-y-2">
            <DateInput
              id="EndDate"
              name="endDate"
              label="End Date"
              required
              value={endDate}
              onChange={handleEndChange}
              error={error?.endDate}
            />
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center border border-primary/20 h-[50px]">
            <div className="text-xs text-primary font-bold uppercase tracking-widest">
              Total Duration
            </div>
            <div className="text-xs font-black text-primary leading-none">
              {duration !== null
                ? `${duration} ${duration === 1 ? "Day" : "Days"}`
                : "-"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Period;

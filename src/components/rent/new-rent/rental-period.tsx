"use client";

import { DateInput } from "@/components/ui/date-input";
import { useState, useEffect } from "react";

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
}

const Period = ({ onDataChange, initialData }: PeriodProps) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    console.log("Period initialData:", initialData);

    if (initialData?.startDate) {
      setStartDate(initialData.startDate);
    }
    if (initialData?.endDate) {
      setEndDate(initialData.endDate);
    } 
  }, [initialData]);

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

  useEffect(() => {
    const calculatedDuration = calculateDuration(startDate, endDate);
    setDuration(calculatedDuration);

    // Kirim data ke parent component
    if (onDataChange && calculatedDuration !== null) {
      onDataChange({
        startDate,
        endDate,
        duration: calculatedDuration,
      });
    }
  }, [startDate, endDate, onDataChange]);
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
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <DateInput
              id="EndDate"
              name="endDate"
              label="End Date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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

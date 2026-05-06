"use client";

import { useState, useRef, useEffect } from "react";

export interface ExportColumn {
  id: string;
  label: string;
  defaultChecked?: boolean;
}

export interface ExportOptions {
  type: "filtered" | "all";
  columns: string[];
  format: "csv" | "xlsx" | "pdf";
  dateRange?: {
    start: string;
    end: string;
  };
}

interface ModalExportProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: ExportOptions) => void;
  totalRows?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  title?: string;
  description?: string;
  columns?: ExportColumn[];
  defaultSelectedColumns?: string[];
}

const defaultRentalColumns: ExportColumn[] = [
  { id: "transactionId", label: "Transaction ID", defaultChecked: true },
  { id: "driver", label: "Driver", defaultChecked: true },
  { id: "vehicle", label: "Vehicle Info", defaultChecked: true },
  { id: "rentalPeriod", label: "Rental Period", defaultChecked: true },
  { id: "deposit", label: "Deposit", defaultChecked: false },
  { id: "status", label: "Status", defaultChecked: true },
];

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const resetTime = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export function ModalExport({
  isOpen,
  onClose,
  onExport,
  totalRows = 142,
  title = "Export Data",
  description = "Generate reports.",
  columns = defaultRentalColumns,
  defaultSelectedColumns,
}: ModalExportProps) {
  const getDefaultSelected = () => {
    if (defaultSelectedColumns) return defaultSelectedColumns;
    return columns.filter((col) => col.defaultChecked).map((col) => col.id);
  };

  const [exportType, setExportType] = useState<"filtered" | "all">("filtered");
  const [selectedColumns, setSelectedColumns] =
    useState<string[]>(getDefaultSelected());
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "xlsx" | "pdf">(
    "csv",
  );

  const today = resetTime(new Date());
  const defaultStart = new Date(today);
  defaultStart.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState<Date>(resetTime(defaultStart));
  const [endDate, setEndDate] = useState<Date>(resetTime(today));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [lastViewedMonth, setLastViewedMonth] = useState<Date>(
    resetTime(today),
  );

  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLastViewedMonth(resetTime(endDate));
    }
  }, [isOpen, endDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
        setTempStartDate(null);
        setTempEndDate(null);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId],
    );
  };

  const handleExport = () => {
    onExport({
      type: exportType,
      columns: selectedColumns,
      format: selectedFormat,
      dateRange: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
    });
    onClose();
  };

  const openCalendar = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsCalendarOpen(true);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
    setTempStartDate(null);
    setTempEndDate(null);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(resetTime(new Date(year, month, i)));
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isInRange = (date: Date, start: Date | null, end: Date | null) => {
    if (!start || !end) return false;
    return date >= start && date <= end;
  };

  const handleDateClick = (date: Date) => {
    if (!tempStartDate) {
      setTempStartDate(date);
      setTempEndDate(null);
    } else if (!tempEndDate) {
      if (date >= tempStartDate) {
        setTempEndDate(date);
        setTimeout(() => {
          setStartDate(tempStartDate);
          setEndDate(date);
          setLastViewedMonth(date);
          closeCalendar();
        }, 150);
      } else {
        setTempStartDate(date);
        setTempEndDate(null);
      }
    } else {
      setTempStartDate(date);
      setTempEndDate(null);
    }
  };

  const CalendarPicker = () => {
    const [currentMonth, setCurrentMonth] = useState(() =>
      resetTime(lastViewedMonth),
    );
    const days = getDaysInMonth(currentMonth);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handleMonthChange = (newMonth: Date) => {
      setCurrentMonth(newMonth);
      setLastViewedMonth(newMonth);
    };

    return (
      <div
        ref={calendarRef}
        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 w-80"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() =>
              handleMonthChange(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                  1,
                ),
              )
            }
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              chevron_left
            </span>
          </button>
          <span className="font-semibold text-slate-900 dark:text-white">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={() =>
              handleMonthChange(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  1,
                ),
              )
            }
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              chevron_right
            </span>
          </button>
        </div>

        <div className="mb-3 p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
          {tempStartDate && !tempEndDate && (
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Start: {formatDate(tempStartDate)} - Select end date
            </span>
          )}
          {tempStartDate && tempEndDate && (
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {formatDate(tempStartDate)} → {formatDate(tempEndDate)}
            </span>
          )}
          {!tempStartDate && (
            <span className="text-sm text-slate-500">Select start date</span>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-slate-500 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-9" />;
            }

            const isStart = tempStartDate && isSameDay(day, tempStartDate);
            const isEnd = tempEndDate && isSameDay(day, tempEndDate);
            const inRange = isInRange(day, tempStartDate, tempEndDate);

            let cellClass =
              "h-9 w-9 rounded-full text-sm transition-colors flex items-center justify-center mx-auto";

            if (isStart || isEnd) {
              cellClass += " bg-blue-600 text-white hover:bg-blue-700";
            } else if (inRange) {
              cellClass +=
                " bg-blue-100 dark:bg-blue-900/30 text-slate-900 dark:text-white";
            } else {
              cellClass +=
                " hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300";
            }

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={cellClass}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
      {/* Modal Container - dengan max-h dan scroll */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* Selection Tabs */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setExportType("filtered")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
                exportType === "filtered"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                filter_alt
              </span>
              <span>Export Filtered Data</span>
            </button>
            <button
              onClick={() => setExportType("all")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
                exportType === "all"
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                database
              </span>
              <span>Export All Data</span>
            </button>
          </div>

          {/* Content berdasarkan tipe export */}
          {exportType === "filtered" ? (
            <div className="space-y-6">
              {/* Date Range Picker */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Date Range
                </label>

                <div className="relative">
                  <button
                    onClick={openCalendar}
                    className="w-full flex items-center justify-between p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-base">
                        calendar_today
                      </span>
                      <span>
                        {formatDate(startDate)} - {formatDate(endDate)}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">
                      expand_more
                    </span>
                  </button>

                  {isCalendarOpen && <CalendarPicker />}
                </div>
              </div>

              {/* Select Columns */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Select Columns
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {columns.map((column) => (
                    <label
                      key={column.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(column.id)}
                        onChange={() => handleColumnToggle(column.id)}
                        className="w-4 h-4 rounded-sm border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500/20"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {column.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
                <span
                  className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  info
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                    You are about to export the complete database (approximately{" "}
                    {totalRows.toLocaleString()}+ rows).
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This operation may take a few moments to process depending
                    on your connection speed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Select Format */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Output Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "csv", icon: "csv", label: "CSV" },
                { value: "xlsx", icon: "table_view", label: "XLSX" },
                { value: "pdf", icon: "picture_as_pdf", label: "PDF" },
              ].map((format) => (
                <label
                  key={format.value}
                  className={`relative flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                    selectedFormat === format.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-transparent bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={selectedFormat === format.value}
                    onChange={() =>
                      setSelectedFormat(format.value as "csv" | "xlsx" | "pdf")
                    }
                    className="hidden"
                  />
                  <span
                    className={`material-symbols-outlined mb-1 ${
                      selectedFormat === format.value
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {format.icon}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      selectedFormat === format.value
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {format.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 flex justify-end items-center gap-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">
              cloud_download
            </span>
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

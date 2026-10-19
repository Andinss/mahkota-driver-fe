"use client";

import type {
  OutOfTownRequest,
  OutOfTownStatus,
} from "@/components/monitoring/out-of-town/out-of-town-table-row";

interface DriverOutOfTownCardProps {
  request: OutOfTownRequest;
}

const statusConfig: Record<OutOfTownStatus, { label: string; dot: string }> = {
  pending: { label: "Menunggu", dot: "bg-amber-400" },
  approved: { label: "Disetujui", dot: "bg-emerald-400" },
  rejected: { label: "Ditolak", dot: "bg-rose-400" },
};

export function DriverOutOfTownCard({ request }: DriverOutOfTownCardProps) {
  const status = statusConfig[request.status] || statusConfig.pending;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="vehicle-history-header px-5 py-4 text-white relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-xl">
                commute
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wide truncate">
                {request.destination}
              </h3>
              <p className="text-[11px] font-mono font-medium text-white/70 truncate">
                {request.driverName}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>
      </div>

      {/* Hero: Tanggal */}
      <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mb-1">
          Periode Perjalanan
        </p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {request.departureDate} - {request.returnDate}
        </p>
      </div>

      {/* Details */}
      <div className="px-5 py-4 space-y-3 flex-1">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-base">
              directions_car
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide leading-tight mb-1">
              Kendaraan
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight truncate">
                {request.vehicleName}
              </p>
              <span className="w-px h-4 bg-slate-300 dark:bg-slate-600 shrink-0"></span>{" "}
              {/* Garis pemisah */}
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold shrink-0">
                {request.vehiclePlate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-base">
              notes
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide leading-tight">
              Alasan
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {request.reason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

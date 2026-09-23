"use client";

import type { ReactNode } from "react";
import Link from "next/link";

export type VehicleStatus = "Current" | "Previous";

export interface VehicleHistory {
  id: string;
  vehicleId: string;
  name: string;
  plateNumber: string;
  rentalNumber: string;
  period: string;
  totalDuration: number;
  dailyRate: number;
  rentalDuration: string;
  rentalService: string;
  vendorName: string;
  createdAt: string;
  documentContract?: string;
  status: VehicleStatus;
}

interface VehicleHistoryCardProps {
  vehicle: VehicleHistory;
}

const statusConfig: Record<VehicleStatus, { label: string; dot: string }> = {
  Current: { label: "Current", dot: "bg-emerald-400" },
  Previous: { label: "Previous", dot: "bg-slate-300" },
};

export function VehicleHistoryCard({ vehicle }: VehicleHistoryCardProps) {
  const status = statusConfig[vehicle.status];
  const hasContract = Boolean(vehicle.documentContract);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Hero Header — Gradient */}
      <div className="vehicle-history-header px-5 py-4 text-white relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-xl">
                directions_car
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold leading-tight truncate">
                {vehicle.name}
              </h3>
              <p className="text-[11px] font-mono font-medium text-white/70 truncate">
                {vehicle.plateNumber}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mb-1">
            Tarif Harian
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">
            Rp {vehicle.dailyRate.toLocaleString("id-ID")}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mb-1">
            Durasi
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">
            {vehicle.totalDuration} hari
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-4 space-y-3 flex-1">
        <InfoField icon="receipt_long" label="Nomor Rental">
          <span className="font-mono">{vehicle.rentalNumber}</span>
        </InfoField>

        <InfoField icon="calendar_today" label="Periode">
          {vehicle.period}
        </InfoField>

        <InfoField icon="local_taxi" label="Layanan">
          {vehicle.rentalService}
          {vehicle.rentalDuration && (
            <span className="text-slate-400 font-normal">
              {" · "}{vehicle.rentalDuration}
            </span>
          )}
        </InfoField>

        {vehicle.vendorName && vehicle.vendorName !== "-" && (
          <InfoField icon="store" label="Vendor">
            {vehicle.vendorName}
          </InfoField>
        )}

        {vehicle.createdAt && (
          <InfoField icon="schedule" label="Dibuat">
            {new Date(vehicle.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </InfoField>
        )}
      </div>

      {/* Footer Actions */}
      <div className={`px-5 py-4 border-t border-slate-100 dark:border-slate-800 grid gap-2 ${hasContract ? "grid-cols-2" : "grid-cols-1"}`}>
        <Link
          href={`/dashboard/vehicles/detail/?id=${vehicle.vehicleId}`}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-base">visibility</span>
          View Details
        </Link>
        {hasContract && (
          <a
            href={vehicle.documentContract}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Contract
          </a>
        )}
      </div>
    </div>
  );
}

interface InfoFieldProps {
  icon: string;
  label: string;
  children: ReactNode;
}

function InfoField({ icon, label, children }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-base">
          {icon}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide leading-tight">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
          {children}
        </p>
      </div>
    </div>
  );
}
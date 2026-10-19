"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { OutOfTownRequest, OutOfTownStatus } from "./out-of-town-table-row";
import { confirmToast, toastSuccess } from "@/components/ui/toast-provider";

interface OutOfTownDetailModalProps {
  request: OutOfTownRequest | null;
  onClose: () => void;
  onStatusChange?: (id: string, status: OutOfTownStatus) => void;
}

const statusConfig: Record<
  OutOfTownStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  },
};

export const OutOfTownDetailModal = ({
  request,
  onClose,
  onStatusChange,
}: OutOfTownDetailModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!request) return null;

  const status = statusConfig[request.status] || statusConfig.pending;

  const handleAction = async (newStatus: OutOfTownStatus) => {
    const actionLabel = newStatus === "approved" ? "menyetujui" : "menolak";

    const confirmed = await confirmToast({
      title:
        newStatus === "approved" ? "Setujui Pengajuan?" : "Tolak Pengajuan?",
      message: `Apakah Anda yakin ingin ${actionLabel} pengajuan dari ${request.driverName}?`,
      confirmText: newStatus === "approved" ? "Ya, Setujui" : "Ya, Tolak",
      cancelText: "Batal",
      variant: newStatus === "approved" ? "info" : "danger",
    });

    if (!confirmed) return;

    setIsProcessing(true);
    try {
      onStatusChange?.(request.id, newStatus);
      toastSuccess(
        `Pengajuan dari ${request.driverName} berhasil di${newStatus === "approved" ? "setujui" : "tolak"}.`,
      );
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Detail Pengajuan" size="md">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <span className="material-symbols-outlined text-primary text-xl">
            commute
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Diajukan pada {request.submittedAt}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <InfoField icon="person" label="Driver">
            {request.driverName}
            <span className="block text-xs font-normal text-slate-400">
              {request.driverPhone}
            </span>
          </InfoField>

          <InfoField icon="directions_car" label="Kendaraan">
            {request.vehicleName}
            <span className="block text-xs font-normal text-slate-400 font-mono">
              {request.vehiclePlate}
            </span>
          </InfoField>

          <InfoField icon="location_on" label="Tujuan">
            {request.destination}
          </InfoField>

          <InfoField icon="calendar_month" label="Periode">
            {request.departureDate} - {request.returnDate}
          </InfoField>

          <InfoField icon="notes" label="Alasan">
            <span className="italic font-normal text-slate-600 dark:text-slate-300">
              {request.reason}
            </span>
          </InfoField>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">
              Status
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${status.className}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Footer — hanya kalau pending */}
        {request.status === "pending" && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              onClick={() => handleAction("rejected")}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-semibold rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors text-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">
                cancel
              </span>
              Tolak
            </button>
            <button
              onClick={() => handleAction("approved")}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">
                check_circle
              </span>
              Setujui
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

interface InfoFieldProps {
  icon: string;
  label: string;
  children: React.ReactNode;
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

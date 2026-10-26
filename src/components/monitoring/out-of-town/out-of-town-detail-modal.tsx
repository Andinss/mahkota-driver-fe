"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { OutOfTownRequest, OutOfTownStatus } from "./out-of-town-table-row";
import { outOfTownApi } from "@/lib/api/out-of-town";
import {
  confirmToast,
  toastError,
  toastSuccess,
} from "@/components/ui/toast-provider";
import { formatRupiah } from "@/lib/utils/format";
import { getErrorMessage } from "@/lib/utils/error-message";

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
  const [adminNote, setAdminNote] = useState("");
  const [feeAmount, setFeeAmount] = useState("");

  if (!request) return null;

  const status = statusConfig[request.status] || statusConfig.pending;

  const handleAction = async (newStatus: OutOfTownStatus) => {
    const actionLabel = newStatus === "approved" ? "menyetujui" : "menolak";

    const parsedFee = Number(feeAmount);
    const fee =
      newStatus === "approved" && feeAmount.trim() && parsedFee > 0
        ? parsedFee
        : undefined;

    const confirmed = await confirmToast({
      title:
        newStatus === "approved" ? "Setujui Pengajuan?" : "Tolak Pengajuan?",
      message:
        newStatus === "approved" && fee
          ? `Setujui pengajuan dari ${request.driverName} dan tambahkan biaya ${formatRupiah(fee)} ke daily payment tanggal keberangkatan?`
          : `Apakah Anda yakin ingin ${actionLabel} pengajuan dari ${request.driverName}?`,
      confirmText: newStatus === "approved" ? "Ya, Setujui" : "Ya, Tolak",
      cancelText: "Batal",
      variant: newStatus === "approved" ? "info" : "danger",
    });

    if (!confirmed) return;

    setIsProcessing(true);
    try {
      const note = adminNote.trim() || undefined;
      if (newStatus === "approved") {
        await outOfTownApi.approve(request.id, note, fee);
      } else {
        await outOfTownApi.reject(request.id, note);
      }
      toastSuccess(
        `Pengajuan dari ${request.driverName} berhasil di${newStatus === "approved" ? "setujui" : "tolak"}.`,
      );
      onStatusChange?.(request.id, newStatus);
      onClose();
    } catch (err) {
      console.error("Gagal memproses pengajuan luar kota:", err);
      toastError(getErrorMessage(err, "Gagal memproses pengajuan."));
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

          {request.feeAmount ? (
            <InfoField icon="payments" label="Biaya Tambahan Luar Kota">
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatRupiah(request.feeAmount)}
              </span>
            </InfoField>
          ) : null}

          {request.adminNote && (
            <InfoField icon="sticky_note_2" label="Catatan Admin">
              <span className="font-normal text-slate-600 dark:text-slate-300">
                {request.adminNote}
              </span>
            </InfoField>
          )}

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
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <Input
                id="fee-amount"
                label="Biaya Tambahan Luar Kota (opsional)"
                type="number"
                min={0}
                step={1000}
                placeholder="Cth: 50000"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-400">
                Nominal bebas. Jika diisi, biaya ini ditambahkan ke daily
                payment pada tanggal keberangkatan driver.
              </p>
            </div>
            <Textarea
              id="admin-note"
              label="Catatan (opsional)"
              placeholder="Tambahkan catatan untuk driver..."
              className="min-h-[80px]"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
            <div className="flex items-center justify-end gap-2">
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

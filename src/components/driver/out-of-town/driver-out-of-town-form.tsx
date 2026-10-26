"use client";

import { useState, useEffect, useCallback } from "react";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { driverApi } from "@/lib/api/driver";
import { outOfTownApi } from "@/lib/api/out-of-town";
import { toastError, toastSuccess } from "@/components/ui/toast-provider";
import { formatDateOnly, getTodayLocal } from "@/lib/utils/format";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { DriverRentalItem } from "@/lib/types/driver";

interface DriverOutOfTownFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const emptyForm = {
  destination: "",
  departureDate: "",
  returnDate: "",
  reason: "",
};

/** Ambil bagian YYYY-MM-DD dari nilai tanggal apa pun. */
const dateOnly = (value?: string | null): string => {
  if (!value) return "";
  return value.slice(0, 10);
};

/**
 * Rental yang masih berlaku (status active & hari ini dalam rentang),
 * sama seperti definisi di backend. Terbaru (start_date) dipakai lebih dulu.
 */
const pickActiveRental = (
  rentals: DriverRentalItem[],
): DriverRentalItem | null => {
  const today = getTodayLocal();
  const active = rentals
    .filter(
      (r) =>
        r.status === "active" &&
        r.vehicle &&
        (!r.start_date || dateOnly(r.start_date) <= today) &&
        (!r.end_date || dateOnly(r.end_date) >= today),
    )
    .sort((a, b) =>
      dateOnly(a.start_date) < dateOnly(b.start_date) ? 1 : -1,
    );
  return active[0] || null;
};

export function DriverOutOfTownForm({
  isOpen,
  onClose,
  onSubmit,
}: DriverOutOfTownFormProps) {
  const [loading, setLoading] = useState(false);
  const [isLoadingRental, setIsLoadingRental] = useState(false);
  const [rental, setRental] = useState<DriverRentalItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadRental = useCallback(async () => {
    setIsLoadingRental(true);
    try {
      const res = await driverApi.getMe();
      const rentals = res?.data?.rentals || [];
      setRental(pickActiveRental(rentals));
    } catch (err) {
      console.error("Gagal memuat data kontrak rental:", err);
      setRental(null);
      toastError(getErrorMessage(err, "Gagal memuat data kontrak rental."));
    } finally {
      setIsLoadingRental(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData(emptyForm);
      loadRental();
    }
  }, [isOpen, loadRental]);

  const contractStart = dateOnly(rental?.start_date);
  const contractEnd = dateOnly(rental?.end_date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rental?.vehicle) {
      toastError(
        "Anda tidak memiliki kontrak rental aktif untuk mengajukan keluar kota",
      );
      return;
    }
    if (
      formData.departureDate &&
      formData.returnDate &&
      formData.returnDate < formData.departureDate
    ) {
      toastError("Tanggal kembali tidak boleh sebelum tanggal keluar");
      return;
    }
    if (
      contractStart &&
      contractEnd &&
      (formData.departureDate < contractStart ||
        formData.returnDate > contractEnd)
    ) {
      toastError(
        `Tanggal perjalanan harus di dalam masa kontrak rental (${formatDateOnly(
          contractStart,
        )} s/d ${formatDateOnly(contractEnd)})`,
      );
      return;
    }

    setLoading(true);
    try {
      await outOfTownApi.createMy({
        destination: formData.destination.trim(),
        departure_date: formData.departureDate,
        return_date: formData.returnDate,
        reason: formData.reason.trim(),
      });
      toastSuccess("Pengajuan luar kota berhasil dikirim");
      onSubmit();
      onClose();
      setFormData(emptyForm);
    } catch (err) {
      console.error("Gagal mengirim pengajuan luar kota:", err);
      toastError(getErrorMessage(err, "Gagal mengirim pengajuan."));
    } finally {
      setLoading(false);
    }
  };

  const hasRental = !!rental?.vehicle;
  const vehicleLabel = rental?.vehicle
    ? `${rental.vehicle.merk} ${rental.vehicle.model}`.trim()
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Form Pengajuan Luar Kota"
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Kendaraan ditentukan otomatis dari kontrak rental aktif. */}
        <div>
          <p className="text-sm font-medium text-[#111418] dark:text-white mb-1.5">
            Kendaraan
          </p>
          {isLoadingRental ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-400">
              Memuat data kontrak...
            </div>
          ) : hasRental ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">
                  directions_car
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {vehicleLabel}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {rental!.vehicle!.license_plate}
                </p>
                {contractStart && contractEnd && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Masa kontrak: {formatDateOnly(contractStart)} -{" "}
                    {formatDateOnly(contractEnd)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 px-4 py-3">
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                Tidak ada kontrak rental aktif
              </p>
              <p className="text-xs text-rose-500 dark:text-rose-400">
                Pengajuan keluar kota memerlukan kontrak rental yang masih
                berlaku. Hubungi admin untuk penugasan kendaraan.
              </p>
            </div>
          )}
        </div>

        <Input
          id="destination"
          label="Tujuan (Kota)"
          placeholder="Cth: Bandung"
          value={formData.destination}
          onChange={(e) =>
            setFormData({ ...formData, destination: e.target.value })
          }
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <DateInput
            id="departureDate"
            label="Tgl Keluar"
            value={formData.departureDate}
            min={contractStart || undefined}
            max={contractEnd || undefined}
            onChange={(e) =>
              setFormData({ ...formData, departureDate: e.target.value })
            }
            required
          />
          <DateInput
            id="returnDate"
            label="Tgl Kembali"
            value={formData.returnDate}
            min={contractStart || undefined}
            max={contractEnd || undefined}
            onChange={(e) =>
              setFormData({ ...formData, returnDate: e.target.value })
            }
            required
          />
        </div>

        <Textarea
          id="reason"
          label="Alasan Perjalanan"
          placeholder="Jelaskan alasan Anda keluar kota..."
          className="min-h-[100px]"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          required
        />

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            disabled={loading || isLoadingRental || !hasRental}
          >
            {loading ? "Mengirim..." : "Ajukan Sekarang"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

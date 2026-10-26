"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { driverApi } from "@/lib/api/driver";
import { financeApi } from "@/lib/api/finances";
import { toastError, toastSuccess } from "@/components/ui/toast-provider";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { DriverItem } from "@/lib/types/driver";

interface AdditionalChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Dipanggil setelah tagihan berhasil dibuat supaya daftar di-refresh. */
  onCreated?: () => void;
}

/** Contoh alasan yang sering dipakai — sekali klik untuk isi kolom nama tagihan. */
const CHARGE_PRESETS = [
  "Ganti Rugi Kendaraan Lecet",
  "Kecelakaan",
  "Kehilangan STNK",
  "Tagihan Lainnya",
];

const toDateInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const AdditionalChargeModal = ({
  isOpen,
  onClose,
  onCreated,
}: AdditionalChargeModalProps) => {
  const [driverQuery, setDriverQuery] = useState("");
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverItem | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  const [chargeName, setChargeName] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [paymentDate, setPaymentDate] = useState(() => toDateInput(new Date()));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset form setiap kali modal dibuka.
  useEffect(() => {
    if (!isOpen) return;
    setDriverQuery("");
    setDrivers([]);
    setSelectedDriver(null);
    setShowDropdown(false);
    setChargeName("");
    setAmount("");
    setReason("");
    setPaymentDate(toDateInput(new Date()));
    setErrors({});
    setIsSubmitting(false);
  }, [isOpen]);

  // Cari driver (debounce) saat mengetik di kolom driver.
  useEffect(() => {
    if (!isOpen) return;
    const term = driverQuery.trim();
    if (!term) {
      setDrivers([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingDrivers(true);
      try {
        const res = await driverApi.getList({
          search: term,
          limit: 10,
          is_active: "true",
        });
        setDrivers(Array.isArray(res.data) ? res.data : []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Gagal mencari driver:", err);
        setDrivers([]);
        toastError(getErrorMessage(err, "Gagal mencari driver."));
      } finally {
        setLoadingDrivers(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [driverQuery, isOpen]);

  // Tutup dropdown saat klik di luar.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const driverName = useMemo(
    () =>
      selectedDriver
        ? `${selectedDriver.first_name || ""} ${selectedDriver.last_name || ""}`.trim()
        : "",
    [selectedDriver],
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!selectedDriver) next.driver = "Pilih driver terlebih dahulu";
    if (!chargeName.trim()) next.chargeName = "Nama tagihan wajib diisi";
    if (!(Number(amount) > 0)) next.amount = "Nominal harus lebih dari 0";
    if (!reason.trim()) next.reason = "Alasan wajib diisi";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedDriver) return;

    setIsSubmitting(true);
    try {
      await financeApi.createAdditionalCharge({
        driver_id: selectedDriver.id,
        charge_name: chargeName.trim(),
        amount: Number(amount),
        reason: reason.trim(),
        payment_date: paymentDate || undefined,
      });
      toastSuccess(
        `Tagihan tambahan "${chargeName.trim()}" dibuat untuk ${driverName}`,
      );
      onCreated?.();
      onClose();
    } catch (err) {
      console.error("Gagal membuat tagihan tambahan:", err);
      toastError(getErrorMessage(err, "Gagal membuat tagihan tambahan."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title="Tambah Tagihan Tambahan"
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
          Tagihan tambahan dibebankan ke driver, misalnya ganti rugi kendaraan,
          kecelakaan, atau kehilangan STNK. Tagihan bisa dibayar penuh atau
          dicicil.
        </p>

        {/* Driver */}
        <div className="relative" ref={dropdownRef}>
          <Input
            label="Driver"
            required
            id="ac-driver"
            placeholder={
              selectedDriver
                ? `${driverName} (${selectedDriver.employee_id || "-"})`
                : "Cari nama atau NIK driver..."
            }
            value={driverQuery}
            onChange={(e) => {
              setDriverQuery(e.target.value);
              setSelectedDriver(null);
              setErrors((p) => ({ ...p, driver: "" }));
            }}
            onFocus={() => drivers.length > 0 && setShowDropdown(true)}
            error={errors.driver}
            autoComplete="off"
          />
          {loadingDrivers && (
            <p className="absolute right-3 top-9 text-xs text-slate-400">
              Mencari...
            </p>
          )}
          {showDropdown && drivers.length > 0 && (
            <div className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] shadow-lg">
              {drivers.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setSelectedDriver(d);
                    setDriverQuery("");
                    setShowDropdown(false);
                    setErrors((p) => ({ ...p, driver: "" }));
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Avatar
                    src={d.profile_photo || ""}
                    alt={d.first_name}
                    size="sm"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[#111418] dark:text-white truncate">
                      {`${d.first_name || ""} ${d.last_name || ""}`.trim()}
                    </span>
                    <span className="block text-xs text-slate-400 font-mono">
                      {d.employee_id || "-"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nama Tagihan */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {CHARGE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setChargeName(preset);
                  setErrors((p) => ({ ...p, chargeName: "" }));
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                  chargeName === preset
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-[#dbe0e6] dark:border-[#4b5563] text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <Input
            label="Nama Tagihan"
            required
            id="ac-name"
            placeholder="Contoh: Ganti Rugi Bumper Depan Lecet"
            value={chargeName}
            maxLength={255}
            onChange={(e) => {
              setChargeName(e.target.value);
              setErrors((p) => ({ ...p, chargeName: "" }));
            }}
            error={errors.chargeName}
          />
        </div>

        {/* Nominal + Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CurrencyInput
            id="ac-amount"
            label="Nominal"
            required
            placeholder="0"
            value={amount}
            onChange={(v) => {
              setAmount(v);
              setErrors((p) => ({ ...p, amount: "" }));
            }}
            error={errors.amount || undefined}
          />

          <Input
            label="Tanggal Tagihan"
            id="ac-date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>

        {/* Alasan */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="ac-reason"
            className="text-sm font-medium text-[#111418] dark:text-white"
          >
            Alasan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="ac-reason"
            rows={3}
            maxLength={500}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setErrors((p) => ({ ...p, reason: "" }));
            }}
            placeholder="Contoh: Bumper depan lecet saat parkir di gudang, biaya perbaikan Rp 1.500.000"
            className="w-full px-3 py-2 rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary resize-none"
          />
          <div className="flex justify-between items-center">
            {errors.reason ? (
              <p className="text-xs text-red-500">{errors.reason}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-slate-400">{reason.length}/500</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#e5e7eb] dark:border-[#2a3845]">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={isSubmitting ? "hourglass_empty" : "add_card"}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Buat Tagihan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

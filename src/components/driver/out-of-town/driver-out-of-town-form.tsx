"use client";

import { useState, useEffect, useCallback } from "react";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { driverApi } from "@/lib/api/driver";
import { outOfTownApi } from "@/lib/api/out-of-town";
import { toastError, toastSuccess } from "@/components/ui/toast-provider";
import type { DriverItem } from "@/lib/types/driver";

interface DriverOutOfTownFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  driverName: string;
  driverPhone: string;
}

interface VehicleOption {
  id: string;
  name: string;
  plate: string;
  label: string;
}

const emptyForm = {
  vehicleId: "",
  destination: "",
  departureDate: "",
  returnDate: "",
  reason: "",
};

export function DriverOutOfTownForm({
  isOpen,
  onClose,
  onSubmit,
}: DriverOutOfTownFormProps) {
  const [loading, setLoading] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [formData, setFormData] = useState(emptyForm);

  const loadVehicles = useCallback(async () => {
    setIsLoadingVehicles(true);
    try {
      const res = await driverApi.getMe();
      const driver: DriverItem | null = res?.data ?? null;
      const rentals = driver?.rentals || [];
      const active = rentals.filter((r) => r.status === "active");
      const source = active.length > 0 ? active : rentals;
      const options: VehicleOption[] = source
        .filter((r) => r.vehicle)
        .map((r) => {
          const name = `${r.vehicle!.merk} ${r.vehicle!.model}`.trim();
          const plate = r.vehicle!.license_plate || "-";
          return { id: r.vehicle!.id, name, plate, label: `${name} (${plate})` };
        });
      // Hilangkan duplikat kendaraan.
      const unique = Array.from(
        new Map(options.map((o) => [o.id, o])).values(),
      );
      setVehicles(unique);
      setFormData((prev) => ({
        ...prev,
        vehicleId: unique.some((o) => o.id === prev.vehicleId)
          ? prev.vehicleId
          : unique[0]?.id || "",
      }));
    } catch {
      setVehicles([]);
    } finally {
      setIsLoadingVehicles(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData(emptyForm);
      loadVehicles();
    }
  }, [isOpen, loadVehicles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId) {
      toastError("Pilih kendaraan terlebih dahulu");
      return;
    }
    setLoading(true);

    try {
      await outOfTownApi.createMy({
        vehicle_id: formData.vehicleId,
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
      toastError(
        err instanceof Error ? err.message : "Gagal mengirim pengajuan",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Form Pengajuan Luar Kota"
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <Select
          id="vehicle"
          label="Pilih Kendaraan"
          value={formData.vehicleId}
          onChange={(e) =>
            setFormData({ ...formData, vehicleId: e.target.value })
          }
          disabled={isLoadingVehicles || vehicles.length === 0}
          required
        >
          {isLoadingVehicles && <option value="">Memuat kendaraan...</option>}
          {!isLoadingVehicles && vehicles.length === 0 && (
            <option value="">Tidak ada kendaraan terdaftar</option>
          )}
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </Select>

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
            onChange={(e) =>
              setFormData({ ...formData, departureDate: e.target.value })
            }
            required
          />
          <DateInput
            id="returnDate"
            label="Tgl Kembali"
            value={formData.returnDate}
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

        {!isLoadingVehicles && vehicles.length === 0 && (
          <p className="text-xs text-rose-500">
            Anda belum memiliki kendaraan aktif. Hubungi admin untuk penugasan
            kendaraan.
          </p>
        )}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={loading || vehicles.length === 0}>
            {loading ? "Mengirim..." : "Ajukan Sekarang"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

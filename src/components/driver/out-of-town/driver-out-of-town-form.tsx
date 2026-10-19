"use client";

import { useState } from "react";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { OutOfTownRequest } from "@/components/monitoring/out-of-town/out-of-town-table-row";

interface DriverOutOfTownFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OutOfTownRequest) => void;
  driverName: string;
  driverPhone: string;
}

const formatDateInput = (dateStr: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export function DriverOutOfTownForm({
  isOpen,
  onClose,
  onSubmit,
  driverName,
  driverPhone,
}: DriverOutOfTownFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: "Toyota Avanza (B 1234 XYZ)",
    destination: "",
    departureDate: "",
    returnDate: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const [vehicleName, plateRaw] = formData.vehicle.split("(");
      const vehiclePlate = plateRaw ? plateRaw.replace(")", "") : "-";

      const newRequest: OutOfTownRequest = {
        id: Date.now().toString(),
        driverName: driverName,
        driverPhone: driverPhone,
        vehicleName: vehicleName.trim(),
        vehiclePlate: vehiclePlate.trim(),
        destination: formData.destination,
        departureDate: formatDateInput(formData.departureDate),
        returnDate: formatDateInput(formData.returnDate),
        reason: formData.reason,
        status: "pending",
        submittedAt: new Date().toLocaleString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      onSubmit(newRequest);
      setLoading(false);
      onClose();

      setFormData({
        vehicle: "Toyota Avanza (B 1234 XYZ)",
        destination: "",
        departureDate: "",
        returnDate: "",
        reason: "",
      });
    }, 800);
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
          value={formData.vehicle}
          onChange={(e) =>
            setFormData({ ...formData, vehicle: e.target.value })
          }
          required
        >
          <option value="Toyota Avanza (B 1234 XYZ)">
            Toyota Avanza (B 1234 XYZ)
          </option>
          <option value="Honda Brio (D 5678 ABC)">
            Honda Brio (D 5678 ABC)
          </option>
          <option value="Mitsubishi Xpander (F 9012 DEF)">
            Mitsubishi Xpander (F 9012 DEF)
          </option>
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

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Mengirim..." : "Ajukan Sekarang"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

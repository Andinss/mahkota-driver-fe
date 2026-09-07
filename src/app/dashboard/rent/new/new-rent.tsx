"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { useAuth } from "@/lib/auth-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import FinancialRental from "@/components/rent/new-rent/financial-rental";
import Period from "@/components/rent/new-rent/rental-period";
import SelectionForm from "@/components/rent/new-rent/selection";
import { DocumentsForm } from "@/components/rent/new-rent/upload-document";
import { rentalApi } from "@/lib/api/rentals";
import { HttpClientError } from "@/lib/api-http";
import { driverApi } from "@/lib/api/driver";
import { supervisorApi } from "@/lib/api/supervisor";
import { vehicleApi } from "@/lib/api/vehicle";
import type { DriverItem } from "@/lib/types/driver";
import type { VehicleItem } from "@/lib/types/vehicle";

interface FormErrors {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  dailyRate?: string;
  serverDriverId?: string;
  serverVehicleId?: string;
}

interface RentalData {
  rentalId?: string;
  vehicleId?: string;
  driverId?: string;
  driverType?: string;
  startDate: string;
  endDate: string;
  duration: number;
  dailyRate: number;
  documents?: File[];
  rentalDuration?: string;
  rentalService?: string;
}

interface SelectOption {
  label: string;
  value: string;
  image?: string;
}

const NewRentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [rentalData, setRentalData] = useState<RentalData>({
    startDate: "",
    endDate: "",
    duration: 0,
    dailyRate: 0,
    rentalDuration: "",
    rentalService: "",
  });
  const [formValues, setFormValues] = useState({
    vehicleId: "",
    driverId: "",
    startDate: "",
    endDate: "",
    dailyRate: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string>("");

  const [driverOptions, setDriverOptions] = useState<SelectOption[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<SelectOption[]>([]);

  const { user } = useAuth();
  const isSupervisor = user?.role?.code === "SUPERVISOR";

  useEffect(() => {
    setErrors({});
  }, []);

  useEffect(() => {
    const fetchDrivers = isSupervisor ? supervisorApi.getList() : driverApi.getList();
    fetchDrivers.then((res: any) => {
      const items = Array.isArray(res.data) ? res.data : [];
      const imageBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");
      setDriverOptions(
        items.map((d: DriverItem) => {
          const photo = d.profile_photo || "";
          const image = photo ? (photo.startsWith("http") ? photo : `${imageBase}/${photo.replace(/^\//, "")}`) : "";
          return {
            label: `${d.first_name} ${d.last_name}`,
            value: d.id,
            image,
          };
        }),
      );
    }).catch(() => {});

    vehicleApi.getList().then((res) => {
      const items = Array.isArray(res.data) ? res.data : [];
      setVehicleOptions(
        items.map((v: VehicleItem) => ({
          label: `${v.license_plate} - ${v.merk} ${v.model}`,
          value: v.id,
        })),
      );
    }).catch(() => {});
  }, [isSupervisor]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!rentalData.vehicleId) {
      newErrors.vehicleId = "Kendaraan wajib dipilih";
      isValid = false;
    }

    if (!rentalData.driverId) {
      newErrors.driverId = "Driver wajib dipilih";
      isValid = false;
    }

    if (!rentalData.startDate) {
      newErrors.startDate = "Tanggal mulai wajib diisi";
      isValid = false;
    }

    if (!rentalData.endDate) {
      newErrors.endDate = "Tanggal selesai wajib diisi";
      isValid = false;
    } else if (rentalData.startDate && new Date(rentalData.endDate) <= new Date(rentalData.startDate)) {
      newErrors.endDate = "Tanggal selesai harus setelah tanggal mulai";
      isValid = false;
    }

    if (!rentalData.dailyRate || rentalData.dailyRate <= 0) {
      newErrors.dailyRate = "Tarif harian harus lebih dari 0";
      isValid = false;
    }

    if (!rentalData.rentalDuration) {
      isValid = false;
    }

    if (!rentalData.rentalService) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const isFormInvalid = hasSubmitted && (
    !rentalData.vehicleId ||
    !rentalData.driverId ||
    !rentalData.startDate ||
    !rentalData.endDate ||
    !rentalData.dailyRate ||
    !rentalData.rentalDuration ||
    !rentalData.rentalService
  );

  // Load data when in edit mode
  useEffect(() => {
    if (idParam) {
      setMode("edit");
      rentalApi.getById(idParam).then((res) => {
        const rental = (res as any)?.data ?? (res as any);
        if (!rental?.id) { setMode("add"); return; }
        setRentalData({
          rentalId: rental.id,
          vehicleId: rental.vehicle_id,
          driverId: rental.driver_id,
          startDate: rental.start_date || "",
          endDate: rental.end_date || "",
          duration: rental.total_duration || 0,
          dailyRate: Number(rental.daily_rate) || 0,
          rentalDuration: rental.rental_duration || "",
          rentalService: rental.rental_service || "",
        });
        setFormValues({
          vehicleId: rental.vehicle_id || "",
          driverId: rental.driver_id || "",
          startDate: rental.start_date || "",
          endDate: rental.end_date || "",
          dailyRate: Number(rental.daily_rate) || 0,
        });
      }).catch(() => {
        setMode("add");
      });
    } else {
      setMode("add");
      setRentalData({
        startDate: "",
        endDate: "",
        duration: 0,
        dailyRate: 0,
        rentalDuration: "",
        rentalService: "",
      });
    }
  }, [idParam]);

  const handleSelectionChange = useCallback((data: {
    vehicleId?: string;
    driverId?: string;
    driverType?: string;
  }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
    }));
    setFormValues((prev) => ({
      ...prev,
      vehicleId: data.vehicleId ?? prev.vehicleId,
      driverId: data.driverId ?? prev.driverId,
    }));
  }, []);

  const handlePeriodChange = useCallback((data: {
    startDate: string;
    endDate: string;
    duration: number;
  }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
    }));
    setFormValues((prev) => ({
      ...prev,
      startDate: data.startDate,
      endDate: data.endDate,
    }));
  }, []);

  const handleFinancialChange = useCallback((data: {
    dailyRate: number;
  }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
    }));
    setFormValues((prev) => ({
      ...prev,
      dailyRate: data.dailyRate,
    }));
  }, []);

  const handleDocumentsChange = useCallback((data: { documents?: File[] }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const handleRentalTypeChange = useCallback((data: {
    rentalDuration?: string;
    rentalService?: string;
  }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const handleSubmit = () => {
    setHasSubmitted(true);

    if (!validateForm()) {
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setIsConfirmOpen(false);

    try {
      const totalDuration = rentalData.duration;
      const dailyRate = rentalData.dailyRate;

      const formData = new FormData();
      formData.append("driver_id", rentalData.driverId || "");
      formData.append("vehicle_id", rentalData.vehicleId || "");
      formData.append("start_date", rentalData.startDate);
      formData.append("end_date", rentalData.endDate);
      formData.append("total_duration", String(totalDuration));
      formData.append("daily_rate", String(dailyRate));
      formData.append("rental_duration", rentalData.rentalDuration || "harian");
      formData.append("rental_service", rentalData.rentalService || "lepas kunci");

      if (rentalData.documents && rentalData.documents.length > 0) {
        rentalData.documents.forEach((file) => {
          formData.append("document_contract", file);
        });
      }

      if (mode === "edit" && rentalData.rentalId) {
        await rentalApi.update(rentalData.rentalId, formData);
      } else {
        await rentalApi.create(formData);
      }

      setIsSubmitting(false);
      const action = mode === "edit" ? "updated" : "registered";
      const rentName = rentalData.vehicleId || "New Rental";
      router.push(`/dashboard/rent?success=${action}&rent=${encodeURIComponent(rentName)}`);
    } catch (err) {
      console.error("Failed to save rental:", err);
      setIsSubmitting(false);
      if (err instanceof HttpClientError) {
        const fieldErrors: Record<string, string[]> = err.errors || {};
        setServerErrors(fieldErrors);

        const newErrors: FormErrors = {};
        if (fieldErrors["driver_id"]?.[0]) {
          newErrors.serverDriverId = fieldErrors["driver_id"][0];
        }
        if (fieldErrors["vehicle_id"]?.[0]) {
          newErrors.serverVehicleId = fieldErrors["vehicle_id"][0];
        }
        setErrors((prev) => ({ ...prev, ...newErrors }));

        setGeneralError(err.message || "Gagal menyimpan rental. Silakan coba lagi.");
      } else {
        setGeneralError("Gagal menyimpan rental. Silakan coba lagi.");
      }
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/rent");
  };

  return (
    <PermissionGuard permission="rental.create">
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {mode === "add" ? "Tambah Sewa Baru" : "Edit Sewa"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mode === "add" ? "Lengkapi form di bawah untuk membuat sewa" : "Perbarui informasi sewa"}
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {generalError && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{generalError}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          <SelectionForm
            key={"sel-" + (rentalData.rentalId || "add")}
            onDataChange={handleSelectionChange}
            initialData={{
              vehicleId: rentalData.vehicleId,
              driverId: rentalData.driverId,
            }}
            error={hasSubmitted ? errors : undefined}
            driverOptions={driverOptions}
            vehicleOptions={vehicleOptions}
            serverErrors={serverErrors}
          />

          <Period
            key={"per-" + (rentalData.rentalId || "add")}
            onDataChange={handlePeriodChange}
            initialData={{
              startDate: rentalData.startDate,
              endDate: rentalData.endDate,
            }}
            error={hasSubmitted ? errors : undefined}
          />

          <FinancialRental
            key={"fin-" + (rentalData.rentalId || "add")}
            onDataChange={handleFinancialChange}
            initialData={{
              dailyRate: rentalData.dailyRate,
              rentalDuration: rentalData.rentalDuration,
              rentalService: rentalData.rentalService,
            }}
            onRentalTypeChange={handleRentalTypeChange}
            error={hasSubmitted ? errors : undefined}
          />

          <DocumentsForm onDataChange={handleDocumentsChange} />

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isFormInvalid}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                {isSubmitting ? "hourglass_empty" : "check_circle"}
              </span>
              {isSubmitting ? "Menyimpan..." : mode === "add" ? "Simpan Sewa" : "Update Sewa"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        title={mode === "add" ? "Konfirmasi Sewa" : "Konfirmasi Update"}
        message={
          mode === "add"
            ? `Apakah Anda yakin ingin membuat sewa ini? Pastikan semua informasi sudah benar.`
            : `Apakah Anda yakin ingin mengupdate sewa ini?`
        }
        confirmText={mode === "add" ? "Ya, Buat Sewa" : "Ya, Update Sewa"}
        cancelText="Kembali"
        variant="info"
      />
    </div>
    </PermissionGuard>
  );
};

export default NewRentPage;

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { confirmToast, toastError } from "@/components/ui/toast-provider";
import { VehicleMediaUpload } from "@/components/vehicle/register/vehicle-media-upload";
import { StatusSelect } from "@/components/vehicle/register/status-select";
import { VendorSelect } from "@/components/vehicle/register/vendor-select";
import type { VehicleStatus } from "@/lib/types/vehicle";
import {
  VehicleSpecificationsForm,
  VehicleFormData,
} from "@/components/vehicle/register/vehicle-specifications-form";
import { vehicleApi } from "@/lib/api/vehicle";
import type { VehicleItem } from "@/lib/types/vehicle";

export default function VehicleRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plateParam = searchParams.get("plate");

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [status, setStatus] = useState<VehicleStatus>("Available");
  const [vendorId, setVendorId] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<VehicleFormData> | undefined>();
  const [initialImageUrls, setInitialImageUrls] = useState<string[] | null | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);


  useEffect(() => {
    if (plateParam) {
      vehicleApi.getList({ search: plateParam, limit: 10 }).then((res) => {
        const items = Array.isArray(res.data) ? res.data : [];
        const vehicle = items.find(
          (v: VehicleItem) => v.license_plate === plateParam
        );
        if (vehicle) {
          setMode("edit");
          setEditingId(vehicle.id);
          setStatus(vehicle.status);
          setVendorId(vehicle.vendor_id || "");
          const year = vehicle.launching_year
            ? new Date(vehicle.launching_year).getFullYear().toString()
            : "";
          setInitialValues({
            make: vehicle.merk,
            model: vehicle.model,
            year,
            licensePlate: vehicle.license_plate,
            color: vehicle.color,
            vin: vehicle.vin_number,
            engineNumber: vehicle.engine_number,
            dailyRate: String(vehicle.daily_rate),
            pricingCategory: vehicle.pricing_category,
            imei: vehicle.imei,
            deviceName: vehicle.device_name,
          });
          const imageBase = (
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
          ).replace(/\/api\/?$/, "");
          const rawPhoto = vehicle.vehicle_photo;
          const photos = Array.isArray(rawPhoto) ? rawPhoto : (rawPhoto ? [rawPhoto] : []);
          setInitialImageUrls(
            photos.length > 0
              ? photos.map((url: string) =>
                  url.startsWith("http")
                    ? url
                    : `${imageBase}/${url.replace(/^\//, "")}`
                )
              : null
          );
        } else {
          setInitialImageUrls(null);
        }
      }).catch(() => {
        setMode("add");
        setInitialImageUrls(null);
      });
    } else {
      setMode("add");
      setEditingId(null);
      setInitialValues(undefined);
      setInitialImageUrls(null);
    }
  }, [plateParam]);

  const handleSubmit = async (data: VehicleFormData) => {
    const actionLabel = mode === "add" ? "register this new vehicle" : "update this vehicle";
    const actionTitle = mode === "add" ? "Confirm Registration" : "Confirm Update";
    const confirmLabel = mode === "add" ? "Yes, Complete Registration" : "Yes, Update Vehicle";
    const confirmed = await confirmToast({
      title: actionTitle,
      message: `Are you sure you want to ${actionLabel}? Please review all information carefully. This action cannot be undone.`,
      confirmText: confirmLabel,
      variant: "info",
    });
    if (confirmed) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("merk", data.make);
        formData.append("model", data.model);
        formData.append("launching_year", `${data.year}-01-01T00:00:00.000Z`);
        formData.append("license_plate", data.licensePlate);
        formData.append("color", data.color);
        formData.append("vin_number", data.vin);
        formData.append("engine_number", data.engineNumber);
        formData.append("daily_rate", data.dailyRate.replace(/\./g, ""));
        formData.append("pricing_category", data.pricingCategory);
        formData.append("status", status);
        formData.append("imei", data.imei);
        formData.append("device_name", data.deviceName);
        if (vendorId) formData.append("vendor_id", vendorId);

        imageFiles.forEach((file) => {
          formData.append("vehicle_photo", file);
        });

        if (mode === "edit" && editingId) {
          await vehicleApi.update(editingId, formData);
        } else {
          await vehicleApi.create(formData);
        }

        setIsSubmitting(false);
        const action = mode === "edit" ? "updated" : "registered";
        const vehicleName = `${data.make} ${data.model}`;
        router.push(`/dashboard/vehicles?success=${action}&vehicle=${encodeURIComponent(vehicleName)}`);
      } catch (err) {
        console.error("Failed to save vehicle:", err);
        setIsSubmitting(false);
        toastError("Failed to save vehicle. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/vehicles");
  };
  return (
    <PermissionGuard permission="vehicle.create">
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
                {mode === "add" ? "Tambah Kendaraan Baru" : "Edit Kendaraan"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mode === "add" ? "Lengkapi form di bawah untuk mendaftarkan kendaraan" : "Perbarui informasi kendaraan"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          <VehicleMediaUpload
            onImagesSelect={setImageFiles}
            initialImageUrls={initialImageUrls === undefined ? undefined : (initialImageUrls || [])}
            acceptedFormats={["JPG", "PNG"]}
            maxSizeMB={5}
          />

          <VendorSelect value={vendorId} onChange={setVendorId} />

          <VehicleSpecificationsForm
            mode={mode}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          />

          <StatusSelect value={status} onChange={setStatus} />

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Batal
            </button>
            <button
              onClick={() => {
                const form = document.getElementById("vehicleForm") as HTMLFormElement;
                if (form) form.requestSubmit();
              }}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                {isSubmitting ? "hourglass_empty" : "check_circle"}
              </span>
              {isSubmitting ? "Menyimpan..." : mode === "add" ? "Simpan Kendaraan" : "Update Kendaraan"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </PermissionGuard>
  );
}

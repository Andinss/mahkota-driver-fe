"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { confirmToast, toastError } from "@/components/ui/toast-provider";
import { VehicleMediaUpload } from "@/components/vehicle/register/vehicle-media-upload";
import { StatusSelect } from "@/components/vehicle/register/status-select";
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
        formData.append("status", status);

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
        router.push(`/dashboard/vehicle?success=${action}&vehicle=${encodeURIComponent(vehicleName)}`);
      } catch (err) {
        console.error("Failed to save vehicle:", err);
        setIsSubmitting(false);
        toastError("Failed to save vehicle. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/vehicle");
  };
  return (
    <PermissionGuard permission="vehicle.create">
    <div className="bg-white dark:bg-slate-900 rounded-xl m-7 shadow-sm border border-[#f0f2f4] dark:border-slate-800 overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[600px]">
        <div className="w-full md:w-1/3 bg-gray-50/50 dark:bg-slate-800/50 p-8 border-r border-[#f0f2f4] dark:border-slate-800 flex flex-col gap-8">
          <VehicleMediaUpload
            onImagesSelect={setImageFiles}
            initialImageUrls={initialImageUrls === undefined ? undefined : (initialImageUrls || [])}
            acceptedFormats={["JPG", "PNG"]}
            maxSizeMB={5}
          />
          <StatusSelect value={status} onChange={setStatus} />
        </div>

        <VehicleSpecificationsForm
          mode={mode}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>


    </div>
    </PermissionGuard>
  );
}

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color: string;
  vin: string;
  engineNumber: string;
  dailyRate: string;
}

type FormMode = "add" | "edit";

interface VehicleSpecificationsFormProps {
  mode?: FormMode;
  initialValues?: Partial<VehicleFormData>;
  onSubmit?: (data: VehicleFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function VehicleSpecificationsForm({
  mode = "add",
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: VehicleSpecificationsFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: VehicleFormData = {
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: formData.get("year") as string,
      licensePlate: formData.get("licensePlate") as string,
      color: formData.get("color") as string,
      vin: formData.get("vin") as string,
      engineNumber: formData.get("engineNumber") as string,
      dailyRate: formData.get("dailyRate") as string,
    };
    onSubmit?.(data);
  };

  const buttonText = isSubmitting
    ? "Saving..."
    : mode === "add"
      ? "Save Vehicle"
      : "Update Vehicle";

  return (
    <div className="w-full md:w-2/3 p-8 flex flex-col justify-between">
      <div>
        <h3 className="text-[#111418] dark:text-white text-lg font-bold mb-6">
          Vehicle Specifications
        </h3>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
          id="vehicleForm"
          onSubmit={handleSubmit}
        >
          <Input
            id="make"
            name="make"
            label="Make"
            placeholder="e.g. Toyota"
            defaultValue={initialValues?.make}
            required
          />

          <Input
            id="model"
            name="model"
            label="Model"
            placeholder="e.g. Camry"
            defaultValue={initialValues?.model}
            required
          />

          <Input
            id="year"
            name="year"
            label="Year"
            placeholder="2024"
            type="number"
            defaultValue={initialValues?.year}
            required
          />

          <Input
            id="licensePlate"
            name="licensePlate"
            label="License Plate"
            placeholder="B 1234 XYZ"
            className="uppercase"
            defaultValue={initialValues?.licensePlate}
            required
          />

          <Input
            id="color"
            name="color"
            label="Color"
            placeholder="e.g. Midnight Black"
            defaultValue={initialValues?.color}
            required
          />

          <Input
            id="vin"
            name="vin"
            label="VIN (Vehicle Identification Number)"
            placeholder="17-digit code"
            className="uppercase"
            defaultValue={initialValues?.vin}
            required
          />

          <Input
            id="engineNumber"
            name="engineNumber"
            label="Engine Number"
            placeholder="EN-XXXXXX"
            defaultValue={initialValues?.engineNumber}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-bold text-[#111418] dark:text-white"
              htmlFor="dailyRate"
            >
              Daily Rate
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#617589] dark:text-slate-400 text-sm">
                IDR
              </span>
              <input
                className="w-full border border-[#dbe0e6] dark:border-[#4b5563] dark:bg-[#1a2632] rounded-lg pl-12 pr-3 py-2 text-sm text-[#111418] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                placeholder="0"
                type="number"
                name="dailyRate"
                id="dailyRate"
                defaultValue={initialValues?.dailyRate}
                required
              />
            </div>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-end gap-4 mt-12 pt-6 border-t border-[#f0f2f4] dark:border-slate-800">
        <Link href="/dashboard/vehicle">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </Link>
        <Button
          variant="primary"
          type="submit"
          form="vehicleForm"
          disabled={isSubmitting}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

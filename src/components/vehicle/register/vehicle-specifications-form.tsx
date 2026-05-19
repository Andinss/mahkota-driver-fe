"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
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

interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  licensePlate?: string;
  color?: string;
  vin?: string;
  engineNumber?: string;
  dailyRate?: string;
}

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
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (): boolean => {
    const formData = new FormData(formRef.current || undefined);
    const newErrors: FormErrors = {};

    const make = formData.get("make") as string;
    const model = formData.get("model") as string;
    const year = formData.get("year") as string;
    const licensePlate = formData.get("licensePlate") as string;
    const color = formData.get("color") as string;
    const vin = formData.get("vin") as string;
    const engineNumber = formData.get("engineNumber") as string;
    const dailyRate = formData.get("dailyRate") as string;

    if (!make?.trim()) {
      newErrors.make = "Make is required";
    }

    if (!model?.trim()) {
      newErrors.model = "Model is required";
    }

    if (!year) {
      newErrors.year = "Year is required";
    } else {
      const yearNum = parseInt(year);
      const currentYear = new Date().getFullYear();
      if (yearNum < 1900 || yearNum > currentYear + 1) {
        newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
      }
    }

    if (!licensePlate?.trim()) {
      newErrors.licensePlate = "License plate is required";
    } else if (licensePlate.length < 4) {
      newErrors.licensePlate = "License plate must be at least 4 characters";
    }

    if (!color?.trim()) {
      newErrors.color = "Color is required";
    }

    if (!vin?.trim()) {
      newErrors.vin = "VIN is required";
    } else if (vin.length !== 17) {
      newErrors.vin = "VIN must be exactly 17 characters";
    }

    if (!engineNumber?.trim()) {
      newErrors.engineNumber = "Engine number is required";
    }

    if (!dailyRate) {
      newErrors.dailyRate = "Daily rate is required";
    } else if (parseFloat(dailyRate) <= 0) {
      newErrors.dailyRate = "Daily rate must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
          ref={formRef}
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
            error={errors.make}
          />

          <Input
            id="model"
            name="model"
            label="Model"
            placeholder="e.g. Camry"
            defaultValue={initialValues?.model}
            required
            error={errors.model}
          />

          <Input
            id="year"
            name="year"
            label="Year"
            placeholder="2024"
            type="number"
            defaultValue={initialValues?.year}
            required
            error={errors.year}
          />

          <Input
            id="licensePlate"
            name="licensePlate"
            label="License Plate"
            placeholder="B 1234 XYZ"
            className="uppercase"
            defaultValue={initialValues?.licensePlate}
            required
            error={errors.licensePlate}
          />

          <Input
            id="color"
            name="color"
            label="Color"
            placeholder="e.g. Midnight Black"
            defaultValue={initialValues?.color}
            required
            error={errors.color}
          />

          <Input
            id="vin"
            name="vin"
            label="VIN (Vehicle Identification Number)"
            placeholder="17-digit code"
            className="uppercase"
            defaultValue={initialValues?.vin}
            required
            error={errors.vin}
          />

          <Input
            id="engineNumber"
            name="engineNumber"
            label="Engine Number"
            placeholder="EN-XXXXXX"
            defaultValue={initialValues?.engineNumber}
            required
            error={errors.engineNumber}
          />

          <CurrencyInput
              id="dailyRate"
              name="dailyRate"
              label="Daily Rate"
              placeholder="0"
              defaultValue={initialValues?.dailyRate}
              required
              error={errors.dailyRate}
            />
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

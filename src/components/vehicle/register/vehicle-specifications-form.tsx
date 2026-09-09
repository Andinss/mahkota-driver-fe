"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";

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
}

export function VehicleSpecificationsForm({
  mode = "add",
  initialValues,
  onSubmit,
}: VehicleSpecificationsFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const sanitizeInput = (
    e: React.FormEvent<HTMLInputElement>,
    denyPattern: RegExp
  ) => {
    const input = e.currentTarget;
    const sanitized = input.value.replace(denyPattern, "");
    if (sanitized !== input.value) {
      input.value = sanitized;
    }
  };

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
    } else if (!/^[a-zA-Z\s'-]+$/.test(make.trim())) {
      newErrors.make =
        "Make can only contain letters, spaces, hyphens, and apostrophes";
    }

    if (!model?.trim()) {
      newErrors.model = "Model is required";
    } else if (!/^[a-zA-Z0-9\s'-]+$/.test(model.trim())) {
      newErrors.model =
        "Model can only contain letters, numbers, spaces, and hyphens";
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
    } else if (!/^[A-Za-z0-9\s]+$/.test(licensePlate.trim())) {
      newErrors.licensePlate =
        "License plate can only contain letters, numbers, and spaces";
    } else if (licensePlate.length < 4) {
      newErrors.licensePlate = "License plate must be at least 4 characters";
    }

    if (!color?.trim()) {
      newErrors.color = "Color is required";
    } else if (!/^[a-zA-Z\s]+$/.test(color.trim())) {
      newErrors.color = "Color can only contain letters and spaces";
    }

    if (!vin?.trim()) {
      newErrors.vin = "VIN is required";
    } else if (!/^[A-Za-z0-9]+$/.test(vin.trim())) {
      newErrors.vin = "VIN can only contain letters and numbers";
    } else if (vin.length !== 17) {
      newErrors.vin = "VIN must be exactly 17 characters";
    }

    if (!engineNumber?.trim()) {
      newErrors.engineNumber = "Engine number is required";
    } else if (!/^[A-Za-z0-9-]+$/.test(engineNumber.trim())) {
      newErrors.engineNumber =
        "Engine number can only contain letters, numbers, and hyphens";
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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">directions_car</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Spesifikasi Kendaraan
          </h3>
          <p className="text-xs text-slate-400">Masukkan detail informasi kendaraan</p>
        </div>
      </div>
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
          onInput={(e) => sanitizeInput(e, /[^a-zA-Z\s'-]/g)}
        />

        <Input
          id="model"
          name="model"
          label="Model"
          placeholder="e.g. Camry"
          defaultValue={initialValues?.model}
          required
          error={errors.model}
          onInput={(e) => sanitizeInput(e, /[^a-zA-Z0-9\s'-]/g)}
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
          onInput={(e) => sanitizeInput(e, /[^A-Za-z0-9\s]/g)}
        />

        <Input
          id="color"
          name="color"
          label="Color"
          placeholder="e.g. Midnight Black"
          defaultValue={initialValues?.color}
          required
          error={errors.color}
          onInput={(e) => sanitizeInput(e, /[^a-zA-Z\s]/g)}
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
          onInput={(e) => sanitizeInput(e, /[^A-Za-z0-9]/g)}
        />

        <Input
          id="engineNumber"
          name="engineNumber"
          label="Engine Number"
          placeholder="EN-XXXXXX"
          defaultValue={initialValues?.engineNumber}
          required
          error={errors.engineNumber}
          onInput={(e) => sanitizeInput(e, /[^A-Za-z0-9-]/g)}
        />

        <CurrencyInput
            id="dailyRate"
            name="dailyRate"
            label="Daily Rate"
            placeholder="0"
            value={initialValues?.dailyRate}
            required
            error={errors.dailyRate}
          />
      </form>
    </div>
  );
}

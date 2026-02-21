"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { VehicleMediaUpload } from "@/components/vehicle/register/vehicle-media-upload";
import {
  StatusSelect,
  VehicleStatus,
} from "@/components/vehicle/register/status-select";
import {
  VehicleSpecificationsForm,
  VehicleFormData,
} from "@/components/vehicle/register/vehicle-specifications-form";

// Mock vehicle data - ini nanti diganti dengan fetch dari API
const mockVehicles: Record<string, any> = {
  "B 1234 XYZ": {
    make: "Toyota",
    model: "Camry",
    year: "2022",
    licensePlate: "B 1234 XYZ",
    color: "Silver Metallic",
    vin: "MHFB123K123456",
    engineNumber: "1GD-FTV-8923",
    dailyRate: "1200000",
    status: "available" as VehicleStatus,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhTPXl3_1Wdm0vfEBBNfPz34KYWfTwgk92FN-NMeG529KFX1AoOCF0Xw2rshR7QRnMz9NgkYRdicFT07sEO_JcpauYoriHK8_eSj9MUtTrPLMI4nq7V4pt9RyqLSOQu_XxaNcKRLLvf44b5LKMrGoWz02DfFtOSgNNBrtbgDz2_LYHpPi7pBRiWXfYRAubew-O4Taz0RqtGQoSh-bX7L_yBXpuryAqsPZ-DbGjaGKz3blYbCu4VMUoQ2PH_N3-Ht0OueyUHdE1JCDb",
  },
  "B 5678 ABC": {
    make: "Honda",
    model: "CR-V",
    year: "2021",
    licensePlate: "B 5678 ABC",
    color: "White Pearl",
    vin: "MHFB456K789012",
    engineNumber: "1GD-FTV-4567",
    dailyRate: "1500000",
    status: "rented" as VehicleStatus,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhTPXl3_1Wdm0vfEBBNfPz34KYWfTwgk92FN-NMeG529KFX1AoOCF0Xw2rshR7QRnMz9NgkYRdicFT07sEO_JcpauYoriHK8_eSj9MUtTrPLMI4nq7V4pt9RyqLSOQu_XxaNcKRLLvf44b5LKMrGoWz02DfFtOSgNNBrtbgDz2_LYHpPi7pBRiWXfYRAubew-O4Taz0RqtGQoSh-bX7L_yBXpuryAqsPZ-DbGjaGKz3blYbCu4VMUoQ2PH_N3-Ht0OueyUHdE1JCDb",
  },
};

export default function VehicleRegisterPage() {
  const searchParams = useSearchParams();
  const plateParam = searchParams.get("plate");

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [status, setStatus] = useState<VehicleStatus>("available");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<VehicleFormData> | undefined>();
  const [initialImageUrl, setInitialImageUrl] = useState<string | undefined>();

  useEffect(() => {
    if (plateParam && mockVehicles[plateParam]) {
      // Jika ada parameter plate dan data ditemukan
      const vehicle = mockVehicles[plateParam];
      setMode("edit");
      setStatus(vehicle.status);
      setInitialValues({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        color: vehicle.color,
        vin: vehicle.vin,
        engineNumber: vehicle.engineNumber,
        dailyRate: vehicle.dailyRate,
      });
      setInitialImageUrl(vehicle.imageUrl);
    } else {
      // Mode add baru
      setMode("add");
      setInitialValues(undefined);
      setInitialImageUrl(undefined);
    }
  }, [plateParam]);

  const handleSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);

    console.log("Form data:", { ...data, status, imageFile, mode });

    // TODO: Integrate with API endpoint
    if (mode === "edit") {
      console.log("Updating vehicle:", plateParam);
    } else {
      console.log("Creating new vehicle");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    console.log("Form cancelled");
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl m-7 shadow-sm border border-[#f0f2f4] dark:border-slate-800 overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[600px]">
        <div className="w-full md:w-1/3 bg-gray-50/50 dark:bg-slate-800/50 p-8 border-r border-[#f0f2f4] dark:border-slate-800 flex flex-col gap-8">
          <VehicleMediaUpload
            onImageSelect={setImageFile}
            initialImageUrl={initialImageUrl}
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
  );
}

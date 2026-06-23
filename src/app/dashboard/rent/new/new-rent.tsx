"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import FinancialRental from "@/components/rent/new-rent/financial-rental";
import Period from "@/components/rent/new-rent/rental-period";
import SelectionForm from "@/components/rent/new-rent/selection";
import Summary from "@/components/rent/new-rent/summry";
import { DocumentsForm } from "@/components/rent/new-rent/upload-document";
import { rentalApi } from "@/lib/api/rentals";
import { driverApi } from "@/lib/api/driver";
import { vehicleApi } from "@/lib/api/vehicle";
import type { DriverItem } from "@/lib/types/driver";
import type { VehicleItem } from "@/lib/types/vehicle";

interface FormErrors {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  dailyRate?: string;
  depositAmount?: string;
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
  depositAmount: number;
  serviceFee: number;
  documents?: File[];
  methodPayment?: string;
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
    depositAmount: 0,
    serviceFee: 25000,
  });
  const [formValues, setFormValues] = useState({
    vehicleId: "",
    driverId: "",
    startDate: "",
    endDate: "",
    dailyRate: 0,
    depositAmount: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [driverOptions, setDriverOptions] = useState<SelectOption[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    setErrors({});
  }, []);

  useEffect(() => {
    driverApi.getList().then((res) => {
      const items = Array.isArray(res.data) ? res.data : [];
      const imageBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");
      setDriverOptions(
        items.map((d: DriverItem) => {
          const photo = d.profile_photo || "";
          const image = photo ? (photo.startsWith("http") ? photo : `${imageBase}/${photo.replace(/^\//, "")}`) : "";
          return {
            label: `${d.first_name} ${d.last_name}`,
            value: `${d.first_name} ${d.last_name}`,
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
          value: v.license_plate,
        })),
      );
    }).catch(() => {});
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!rentalData.vehicleId) {
      newErrors.vehicleId = "Vehicle is required";
      isValid = false;
    }

    if (!rentalData.driverId) {
      newErrors.driverId = "Driver is required";
      isValid = false;
    }

    if (!rentalData.startDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    if (!rentalData.endDate) {
      newErrors.endDate = "End date is required";
      isValid = false;
    }

    if (!rentalData.dailyRate || rentalData.dailyRate <= 0) {
      newErrors.dailyRate = "Daily rate is required";
      isValid = false;
    }

    if (!rentalData.depositAmount || rentalData.depositAmount <= 0) {
      newErrors.depositAmount = "Deposit amount is required";
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
    !rentalData.depositAmount
  );

  // Load data when in edit mode
  useEffect(() => {
    if (idParam) {
      setMode("edit");
      rentalApi.getList({ search: idParam, limit: 1 }).then((res) => {
        const items = Array.isArray(res.data) ? res.data : [];
        const rental = items.find((r) => r.id === idParam);
        if (!rental) { setMode("add"); return; }
        setRentalData({
          rentalId: rental.id,
          vehicleId: rental.car_model,
          driverId: rental.driver_active,
          startDate: rental.start_date || "",
          endDate: rental.end_date || "",
          duration: rental.total_duration || 0,
          dailyRate: Number(rental.daily_rate) || 0,
          depositAmount: Number(rental.deposit_amount) || 0,
          serviceFee: Number(rental.service_fee) || 25000,
          methodPayment: rental.method_payment,
        });
        setFormValues({
          vehicleId: rental.car_model || "",
          driverId: rental.driver_active || "",
          startDate: rental.start_date || "",
          endDate: rental.end_date || "",
          dailyRate: Number(rental.daily_rate) || 0,
          depositAmount: Number(rental.deposit_amount) || 0,
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
        depositAmount: 0,
        serviceFee: 25000,
      });
    }
  }, [idParam]);

  // Handler untuk Selection form
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

  // Handler untuk Period component
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

  // Handler untuk FinancialRental component
  const handleFinancialChange = useCallback((data: {
    dailyRate: number;
    depositAmount: number;
    methodPayment?: string;
  }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
    }));
    setFormValues((prev) => ({
      ...prev,
      dailyRate: data.dailyRate,
      depositAmount: data.depositAmount,
    }));
  }, []);

  // Handler untuk Documents form
  const handleDocumentsChange = useCallback((data: { documents?: File[] }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const handleConfirmRental = () => {
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
      const depositAmount = rentalData.depositAmount;
      const serviceFee = rentalData.serviceFee;
      const totalDailyRate = dailyRate * totalDuration;
      const totalRevenue = totalDailyRate + depositAmount + serviceFee;

      const formData = new FormData();
      formData.append("driver_active", rentalData.driverId || "");
      formData.append("car_model", rentalData.vehicleId || "");
      formData.append("start_date", rentalData.startDate);
      formData.append("end_date", rentalData.endDate);
      formData.append("total_duration", String(totalDuration));
      formData.append("daily_rate", String(dailyRate));
      formData.append("deposit_amount", String(depositAmount));
      formData.append("method_payment", rentalData.methodPayment || "Bank");
      formData.append("total_daily_rate", String(totalDailyRate));
      formData.append("security_deposit", String(depositAmount));
      formData.append("service_fee", String(serviceFee));
      formData.append("total_revenue", String(totalRevenue));

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
      alert("Failed to save rental. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/rent");
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Form Sections */}
        <div className="flex-1 space-y-8 pb-20">
          {/* Section 1: Selection */}
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
          />

          {/* Section 2: Period */}
          <Period
            key={"per-" + (rentalData.rentalId || "add")}
            onDataChange={handlePeriodChange}
            initialData={{
              startDate: rentalData.startDate,
              endDate: rentalData.endDate,
            }}
            error={hasSubmitted ? errors : undefined}
          />

          {/* Section 3: Financials */}
          <FinancialRental
            key={"fin-" + (rentalData.rentalId || "add")}
            onDataChange={handleFinancialChange}
            initialData={{
              dailyRate: rentalData.dailyRate,
              depositAmount: rentalData.depositAmount,
              methodPayment: rentalData.methodPayment,
            }}
            error={hasSubmitted ? errors : undefined}
          />

          {/* Section 4: Documentation */}
          <DocumentsForm onDataChange={handleDocumentsChange} />
        </div>

{/* Summary Sidebar */}
        <Summary
          rentalData={rentalData}
          onConfirm={handleConfirmRental}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          mode={mode}
          isDisabled={isFormInvalid}
        />
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        title={mode === "add" ? "Confirm Rental" : "Confirm Update"}
        message={
          mode === "add"
            ? `Are you sure you want to create this rental? Please review all information carefully. This action cannot be undone.`
            : `Are you sure you want to update this rental? Please review all information carefully.`
        }
        confirmText={
          mode === "add" ? "Yes, Create Rental" : "Yes, Update Rental"
        }
        cancelText="Review Again"
        variant="info"
      />
    </div>
  );
};

export default NewRentPage;

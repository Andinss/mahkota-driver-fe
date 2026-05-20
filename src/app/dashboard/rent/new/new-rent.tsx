"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import FinancialRental from "@/components/rent/new-rent/financial-rental";
import Period from "@/components/rent/new-rent/rental-period";
import SelectionForm from "@/components/rent/new-rent/selection";
import Summary from "@/components/rent/new-rent/summry";
import { DocumentsForm } from "@/components/rent/new-rent/upload-document";

interface FormErrors {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  dailyRate?: string;
  depositAmount?: string;
}

interface RentalData {
  transactionId?: string;
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
  paymentStatus?: string;
  deposit?: string;
  methodPayment?: string;
}

// MOCK DATA untuk edit
const mockRentals: Record<string, any> = {
  "RT-4022": {
    transactionId: "#RT-4022",
    vehicleId: "B 11234 XYZ",
    driverId: "889201",
    startDate: "2024-10-12",
    endDate: "2024-10-15",
    duration: 3,
    dailyRate: 850000,
    depositAmount: 500000,
    serviceFee: 25000,
    paymentStatus: "paid",
    deposit: "held",
    methodPayment: "Bank",
  },
  "RT-4023": {
    transactionId: "#RT-4023",
    vehicleId: "B 5678 ABC",
    driverId: "889205",
    startDate: "2024-10-14",
    endDate: "2024-10-20",
    duration: 6,
    dailyRate: 750000,
    depositAmount: 500000,
    serviceFee: 25000,
    paymentStatus: "partial",
    deposit: "pending",
    methodPayment: "Property Parent",
  },
  "RT-4024": {
    transactionId: "#RT-4024",
    vehicleId: "B 9910 DEF",
    driverId: "889312",
    startDate: "2024-10-01",
    endDate: "2024-10-10",
    duration: 9,
    dailyRate: 900000,
    depositAmount: 500000,
    serviceFee: 25000,
    paymentStatus: "late",
    deposit: "held",
    methodPayment: "Bank",
  },
  "RT-4025": {
    transactionId: "#RT-4025",
    vehicleId: "B 2233 GHI",
    driverId: "889410",
    startDate: "2024-10-15",
    endDate: "2024-10-16",
    duration: 1,
    dailyRate: 800000,
    depositAmount: 500000,
    serviceFee: 25000,
    paymentStatus: "unpaid",
    deposit: "waiting",
    methodPayment: "Own Yourself",
  },
};

const NewRentPage = () => {
  const searchParams = useSearchParams();
  const transactionParam = searchParams.get("transactionId");

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

  useEffect(() => {
    setErrors({});
  }, []);

  const handleInputChange = (
    field: keyof FormErrors,
    value: string | number,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (hasSubmitted && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
    if (transactionParam && mockRentals[transactionParam]) {
      const rental = mockRentals[transactionParam];
      setMode("edit");
      setRentalData({
        transactionId: rental.transactionId,
        vehicleId: rental.vehicleId,
        driverId: rental.driverId,
        startDate: rental.startDate,
        endDate: rental.endDate,
        duration: rental.duration,
        dailyRate: rental.dailyRate,
        depositAmount: rental.depositAmount,
        serviceFee: rental.serviceFee,
        paymentStatus: rental.paymentStatus,
        deposit: rental.deposit,
        methodPayment: rental.methodPayment,
      });
      setFormValues({
        vehicleId: rental.vehicleId,
        driverId: rental.driverId,
        startDate: rental.startDate,
        endDate: rental.endDate,
        dailyRate: rental.dailyRate,
        depositAmount: rental.depositAmount,
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
  }, [transactionParam]);

  // Handler untuk Selection form
  const handleSelectionChange = (data: {
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
  };

  // Handler untuk Period component
  const handlePeriodChange = (data: {
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
  };

  // Handler untuk FinancialRental component
  const handleFinancialChange = (data: {
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
  };

  // Handler untuk Documents form
  const handleDocumentsChange = (data: { documents?: File[] }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
    }));
  };

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

    console.log("Rental Data:", rentalData);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    const action = mode === "edit" ? "updated" : "registered";
    const rentName = rentalData.transactionId || "New Rental";

    window.location.href = `/dashboard/rent?success=${action}&rent=${encodeURIComponent(rentName)}`;
  };

  const handleCancel = () => {
    window.location.href = "/dashboard/rent";
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Form Sections */}
        <div className="flex-1 space-y-8 pb-20">
          {/* Section 1: Selection */}
          <SelectionForm
            onDataChange={handleSelectionChange}
            initialData={{
              vehicleId: rentalData.vehicleId,
              driverId: rentalData.driverId,
            }}
            error={hasSubmitted ? errors : undefined}
          />

          {/* Section 2: Period */}
          <Period
            onDataChange={handlePeriodChange}
            initialData={{
              startDate: rentalData.startDate,
              endDate: rentalData.endDate,
            }}
            error={hasSubmitted ? errors : undefined}
          />

          {/* Section 3: Financials */}
          <FinancialRental
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

"use client";

import { useState } from "react";
import FinancialRental from "@/components/rent/new-rent/financial-rental";
import Period from "@/components/rent/new-rent/rental-period";
import SelectionForm from "@/components/rent/new-rent/selection";
import Summary from "@/components/rent/new-rent/summry";
import { DocumentsForm } from "@/components/rent/new-rent/upload-document";

interface RentalData {
  // Selection data
  vehicleId?: string;
  driverType?: string;

  // Period data
  startDate: string;
  endDate: string;
  duration: number;

  // Financial data
  dailyRate: number;
  depositAmount: number;
  serviceFee: number;

  // Documents data
  documents?: File[];
}

const NewRentPage = () => {
  const [rentalData, setRentalData] = useState<RentalData>({
    startDate: "",
    endDate: "",
    duration: 0,
    dailyRate: 0,
    depositAmount: 0,
    serviceFee: 25000, // Default service fee
  });

  // Handler untuk Selection form
  const handleSelectionChange = (data: {
    vehicleId?: string;
    driverType?: string;
  }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
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
  };

  // Handler untuk FinancialRental component
  const handleFinancialChange = (data: {
    dailyRate: number;
    depositAmount: number;
  }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Handler untuk Documents form
  const handleDocumentsChange = (data: { documents?: File[] }) => {
    setRentalData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Handler untuk confirm rental
  const handleConfirmRental = () => {
    console.log("Rental Data:", rentalData);
    // Disini kamu bisa submit ke API
    // Contoh: await api.createRental(rentalData);
    alert("Rental confirmed! Check console for data.");
  };

  // Handler untuk cancel
  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel?")) {
      // Reset form atau redirect
      window.location.href = "/dashboard/rent";
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Form Sections */}
        <div className="flex-1 space-y-8 pb-20">
          {/* Section 1: Selection */}
          <SelectionForm onDataChange={handleSelectionChange} />

          {/* Section 2: Period */}
          <Period onDataChange={handlePeriodChange} />

          {/* Section 3: Financials */}
          <FinancialRental onDataChange={handleFinancialChange} />

          {/* Section 4: Documentation */}
          <DocumentsForm onDataChange={handleDocumentsChange} />
        </div>

        {/* Summary Sidebar - Perbaikan ada di sini! */}
        <Summary
          rentalData={rentalData}
          onConfirm={handleConfirmRental}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default NewRentPage;

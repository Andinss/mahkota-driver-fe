"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog } from "@/components/ui/alert";
import { MonitoringHeader } from "@/components/monitoring/detail/monitoring-header";
import { VehicleDetailsCard } from "@/components/monitoring/detail/vehicle-details-card";
import { LocationMapCard } from "@/components/monitoring/detail/location-map-card";
import { CustomerDetailsCard } from "@/components/monitoring/detail/customer-details-card";
import { WorkflowStepper } from "@/components/monitoring/detail/workflow-stepper";
import { FieldReportForm } from "@/components/monitoring/detail/field-report-form";

export default function MonitoringDetailPage() {
  const router = useRouter();
  
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("success");

  // Data vehicle
  const vehicleData = {
    name: "Toyota Avanza - Silver",
    year: "2022",
    transmission: "Automatic",
    plateNumber: "B 1234 XYZ",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf3zaxX4Qrs9l4Dz9RuQmSvvRUpeD5vSoh7vqaqCy8dxljPHLvleEW7WJRoz1RAUtow0_vTOCrBne0ORi878U5E0f3bGEl-96bAwKvFbPMB8ZbNjADQk7HdV2kVLwCtrJJaBdo0s6mwkKhNucqXbZ7q4kMKPzTpEOHbmLSzQCPPRvwSEMvZFEKJFWB-x1IKiuA-wcN_G--P1qpQQb7F-gh9eecxYnwckrtuL6GycKakuS-L74H_LTBT71LzsGdjOvELVwVix-uT_Bt",
    odometerOut: 45200,
    fuelLevel: 75,
    type: "Rental"
  };

  // Data location
  const locationData = {
    address: "Km 45, Jagorawi Toll Road",
    mapUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxNi056p95RvlzbO3YggriPN8RBX10PMM71mEKmlHf8nTI8eqWBduKhAOHKi468TzmLr1reUaIcnuOEIfJUb8kTaDQXOeaIEncGEevY_yXE4FGaRS6aoZNBJ1SHaFJaiVirut1UG82xBtm1Q5dHKzMIUjgABDuEGk1igMKcxzq25m-iR4geN2uMMJMZva9qtbY3TpM9bnXgy0XnGvribe8DwloBKeSorH0po0kjRZDBVwdXnBO4uOtMhSWpxLb9ZjmCdKwWF_x5znD",
    reportedIssue: "Engine overheated and stopped working. Smoke coming from the hood."
  };

  // Data customer
  const customerData = {
    name: "John Doe",
    initials: "JD",
    contractNumber: "CTR-9921",
    phoneNumber: "+6281234567890"
  };

  const handleNavigateToSite = () => {
    router.push("/dashboard/monitoring/navigation");
  };

  const handleStartRetrieval = () => {
    console.log("Start retrieval clicked");
  };

  const handleSaveDraft = (data: any) => {
    console.log("Save draft:", data);
    setAlertTitle("Draft Saved");
    setAlertMessage("Field report draft has been saved successfully.");
    setAlertType("success");
    setIsAlertOpen(true);
  };

  const handleSubmitReport = (data: any) => {
    console.log("Submit report:", data);
    setAlertTitle("Report Submitted");
    setAlertMessage("Field report has been submitted successfully.");
    setAlertType("success");
    setIsAlertOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <MonitoringHeader
          title="Emergency Breakdown"
          location={locationData.address}
          buttonText="Navigate to Site"
          buttonIcon="navigation"
          onButtonClick={handleNavigateToSite}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Span 4 */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <VehicleDetailsCard vehicle={vehicleData} />
            <LocationMapCard location={locationData} />
            <CustomerDetailsCard customer={customerData} />
          </div>

          {/* Right Column - Span 8 */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <WorkflowStepper onStartRetrieval={handleStartRetrieval} />
            <FieldReportForm 
              onSaveDraft={handleSaveDraft}
              onSubmitReport={handleSubmitReport}
            />
          </div>
        </div>
      </div>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        confirmText="OK"
        autoCloseDelay={3000}
      />
    </div>
  );
}
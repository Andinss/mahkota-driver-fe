"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertDialog } from "@/components/ui/alert";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { MonitoringHeader } from "@/components/monitoring/detail/monitoring-header";
import { VehicleDetailsCard } from "@/components/monitoring/detail/vehicle-details-card";
import { LocationMapCard } from "@/components/monitoring/detail/location-map-card";
import { CustomerDetailsCard } from "@/components/monitoring/detail/customer-details-card";
import { WorkflowStepper } from "@/components/monitoring/detail/workflow-stepper";
import { FieldReportForm } from "@/components/monitoring/detail/field-report-form";

interface TaskDetail {
  id: string;
  vehicle: {
    name: string;
    year: string;
    transmission: string;
    plateNumber: string;
    imageUrl: string;
    odometerOut: number;
    fuelLevel: number;
    type: string;
  };
  location: {
    address: string;
    mapUrl: string;
    reportedIssue: string;
  };
  customer: {
    name: string;
    initials: string;
    contractNumber: string;
    phoneNumber: string;
  };
}

export default function MonitoringDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("success");

  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call: GET /tasks/:id
    // tasksApi.getById(taskId).then(...)
    setTimeout(() => {
      setTaskDetail({
        id: taskId || "unknown",
        vehicle: {
          name: "Toyota Avanza - Silver",
          year: "2022",
          transmission: "Automatic",
          plateNumber: "B 1234 XYZ",
          imageUrl: "",
          odometerOut: 45200,
          fuelLevel: 75,
          type: "Rental",
        },
        location: {
          address: "Km 45, Jagorawi Toll Road",
          mapUrl: "",
          reportedIssue: "Engine overheated and stopped working. Smoke coming from the hood.",
        },
        customer: {
          name: "John Doe",
          initials: "JD",
          contractNumber: "CTR-9921",
          phoneNumber: "+6281234567890",
        },
      });
      setLoading(false);
    }, 300);
  }, [taskId]);

  const handleNavigateToSite = () => {
    router.push("/dashboard/monitoring/real-time");
  };

  const handleStartRetrieval = () => {
    setAlertTitle("Retrieval Started");
    setAlertMessage("Retrieval process has been initiated.");
    setAlertType("success");
    setIsAlertOpen(true);
  };

  const handleSaveDraft = (data: any) => {
    setAlertTitle("Draft Saved");
    setAlertMessage("Field report draft has been saved successfully.");
    setAlertType("success");
    setIsAlertOpen(true);
  };

  const handleSubmitReport = (data: any) => {
    setAlertTitle("Report Submitted");
    setAlertMessage("Field report has been submitted successfully.");
    setAlertType("success");
    setIsAlertOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-slate-400 text-sm">Loading task details...</div>
      </div>
    );
  }

  if (!taskDetail) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-slate-400 text-sm">Task not found</div>
      </div>
    );
  }

  return (
    <PermissionGuard permission="driver.read.all" fallbackPermission="driver.read.own">
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <MonitoringHeader
          title="Emergency Breakdown"
          location={taskDetail.location.address}
          buttonText="View on Map"
          buttonIcon="map"
          onButtonClick={handleNavigateToSite}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <VehicleDetailsCard vehicle={taskDetail.vehicle} />
            <LocationMapCard location={taskDetail.location} />
            <CustomerDetailsCard customer={taskDetail.customer} />
          </div>

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
    </PermissionGuard>
  );
}

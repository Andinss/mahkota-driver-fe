"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toastSuccess } from "@/components/ui/toast-provider";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { MonitoringHeader } from "@/components/monitoring/detail/monitoring-header";
import { VehicleDetailsCard } from "@/components/monitoring/detail/vehicle-details-card";
import { LocationMapCard } from "@/components/monitoring/detail/location-map-card";
import { CustomerDetailsCard } from "@/components/monitoring/detail/customer-details-card";
import { WorkflowStepper } from "@/components/monitoring/detail/workflow-stepper";
import { FieldReportForm } from "@/components/monitoring/detail/field-report-form";
import { monitoringApi } from "@/lib/api/monitoring";

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


  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }

    monitoringApi.getTaskById(taskId)
      .then((res) => {
        if (res.success && res.data) {
          setTaskDetail(res.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [taskId]);

  const handleNavigateToSite = () => {
    router.push("/dashboard/monitoring/real-time");
  };

  const handleStartRetrieval = () => {
    toastSuccess("Retrieval process has been initiated.");
  };

  const handleSaveDraft = (data: any) => {
    toastSuccess("Field report draft has been saved successfully.");
  };

  const handleSubmitReport = (data: any) => {
    toastSuccess("Field report has been submitted successfully.");
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


    </div>
    </PermissionGuard>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import {
  VehicleHeader,
  VehicleHeaderData,
} from "@/components/vehicle/detail/vehicle-header";
import { TabNavigation } from "@/components/vehicle/detail/tab-navigation";
import { TechnicalSpecs } from "@/components/vehicle/detail/technical-specs";
import { RegistrationDetails } from "@/components/vehicle/detail/registration-details";
import { RentalPricing } from "@/components/vehicle/detail/rental-pricing";
import {
  RentalHistoryFilters,
  RentalFilters,
} from "@/components/vehicle/detail/rental-history-filters";
import { RentalHistoryTable } from "@/components/vehicle/detail/rental-history-table";
import { ModalExport, ExportOptions, ExportColumn } from "@/components/ui/export";
import { vehicleApi } from "@/lib/api/vehicle";
import { rentalApi } from "@/lib/api/rentals";
import type { VehicleItem } from "@/lib/types/vehicle";
import type { RentalTransaction } from "@/lib/types/rentals";
import { toastInfo, toastError } from "@/components/ui/toast-provider";

const statusMap: Record<string, string> = {
  Available: "ACTIVE",
  Reserved: "ACTIVE",
  rented: "RENTED",
  Maintenance: "MAINTENANCE",
  retrieved: "RETRIEVED",
};

const VehicleDetail = () => {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<"information" | "rental">("information");
  const [currentFilters, setCurrentFilters] = useState<RentalFilters>({
    dateRange: "",
    driver: "",
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleItem | null>(null);
  const [vehicleRentals, setVehicleRentals] = useState<RentalTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (vehicleId) {
      setIsLoading(true);

      const fetchVehicle = async () => {
        try {
          const res = await vehicleApi.getDetail(vehicleId);
          const item = (res as any)?.data ?? (res as any);
          if (item?.merk) {
            setVehicle(item);
            return;
          }
        } catch {
          // fallback
        }
        try {
          const res = await vehicleApi.getById(vehicleId);
          const item = (res as any)?.data ?? (res as any);
          if (item?.merk) setVehicle(item);
          else setVehicle(null);
        } catch {
          setVehicle(null);
        }
      };

      const fetchRentals = async () => {
        try {
          const res = await rentalApi.getList({ limit: 1000 });
          const rentals = (res as any)?.data ?? [];
          const filtered = rentals.filter((r: RentalTransaction) => r.vehicle_id === vehicleId);
          setVehicleRentals(filtered);
        } catch {
          // ignore
        }
      };

      fetchVehicle().then(fetchRentals).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [vehicleId]);

  const imageBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");
  const rawPhoto = vehicle?.vehicle_photo
    ? Array.isArray(vehicle.vehicle_photo)
      ? vehicle.vehicle_photo[0]
      : vehicle.vehicle_photo
    : "";
  const vehiclePhoto = rawPhoto
    ? rawPhoto.startsWith("http")
      ? rawPhoto
      : `${imageBase}/${rawPhoto.replace(/^\//, "")}`
    : "";

  const vehicleData: VehicleHeaderData = vehicle ? {
    plate: vehicle.license_plate || "-",
    name: `${vehicle.merk || ""} ${vehicle.model || ""}`.trim() || "Unknown Vehicle",
    status: statusMap[vehicle.status] || vehicle.status,
    totalRentals: "-",
    avgUtilization: "-",
    maintenance: vehicle.status === "Maintenance" ? "Required" : "None",
    imageUrl: vehiclePhoto,
    imageAlt: `${vehicle.license_plate || ""} ${vehicle.merk || ""}`.trim() || "Vehicle",
  } : {
    plate: "-",
    name: "Loading...",
    status: "ACTIVE",
    totalRentals: "-",
    avgUtilization: "-",
    maintenance: "None",
    imageUrl: "",
    imageAlt: "",
  };

  const membershipNames =
    (vehicle?.memberships || []).map((m) => m.name).join(", ") || "-";

  const technicalSpecs = vehicle ? [
    { label: "Merk", value: vehicle.merk },
    { label: "Model", value: vehicle.model },
    { label: "Color", value: vehicle.color },
    { label: "Launching Year", value: vehicle.launching_year ? new Date(vehicle.launching_year).getFullYear().toString() : "-" },
    { label: "Kategori Membership", value: membershipNames },
  ] : [];

  const registrationDetails = vehicle ? [
    { label: "Vendor", value: vehicle.vendor?.name || "-" },
    { label: "License Plate", value: vehicle.license_plate || "-" },
    { label: "VIN Number", value: vehicle.vin_number || "-" },
    { label: "Engine Number", value: vehicle.engine_number || "-" },
    { label: "Status", value: vehicle.status || "-" },
  ] : [];

  const rentalPricing = vehicle ? {
    baseRate: `Rp ${Number(vehicle.daily_rate || 0).toLocaleString("id-ID")}`,
    features: [
      { text: `Status: ${vehicle.status}` },
      { text: `Membership: ${membershipNames}` },
    ],
  } : { baseRate: "-", features: [] };

  const rentalHistory = vehicleRentals.map((r) => ({
    dateRange: `${new Date(r.start_date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })} - ${new Date(r.end_date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}`,
    tripDuration: `${r.total_duration} days`,
    driverName: r.driver ? `${r.driver.first_name} ${r.driver.last_name}` : "-",
    dailyRate: `Rp ${Number(r.daily_rate).toLocaleString("id-ID")}`,
    status: "AKTIF" as const,
  }));

  const rentalHistoryColumns: ExportColumn[] = [
    { id: "rentalPeriod", label: "Date Range", defaultChecked: true },
    { id: "duration", label: "Trip Duration", defaultChecked: true },
    { id: "driverName", label: "Driver Name", defaultChecked: true },
    { id: "dailyRate", label: "Daily Rate", defaultChecked: true },
    { id: "status", label: "Status", defaultChecked: true },
  ];

  const handleFilterChange = (filters: RentalFilters) => {
    setCurrentFilters(filters);
  };

  const handleClearFilters = () => {
    setCurrentFilters({ dateRange: "", driver: "" });
  };

const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleExportConfirm = async (options: ExportOptions) => {
    const params: Record<string, string | number | undefined> = {
      format: options.format,
      columns: options.columns.join(","),
      type: options.type,
    };
    if (vehicleId) {
      params.vehicle_id = vehicleId;
    }
    if (options.type === "filtered") {
      if (options.dateRange?.start) params.start_date = options.dateRange.start;
      if (options.dateRange?.end) params.end_date = options.dateRange.end;
    }
    try {
      await rentalApi.exportData(params);
      toastInfo(`Exporting rental history as ${options.format}`);
    } catch {
      toastError("Failed to export rental history. Please try again.");
    }
    setIsExportModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="m-7 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="m-7 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Vehicle not found</p>
      </div>
    );
  }

  return (
    <PermissionGuard permission="vehicle.read">
    <div className="m-7">
      <VehicleHeader data={vehicleData} />

      <div className="bg-white dark:bg-slate-900 mt-5 rounded-xl border border-[#e5e7eb] dark:border-slate-800 shadow-sm overflow-hidden">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "information" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
              <TechnicalSpecs specs={technicalSpecs} />
              <RegistrationDetails details={registrationDetails} />
              <RentalPricing
                baseRate={rentalPricing.baseRate}
                features={rentalPricing.features}
              />
            </div>
          ) : (
            <div className="space-y-6">
<RentalHistoryFilters
                 onFilterChange={handleFilterChange}
                 onClearFilters={handleClearFilters}
                 onExport={handleExport}
               />
              <RentalHistoryTable rentals={rentalHistory} />
            </div>
          )}
        </div>
      </div>

      <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportConfirm}
        totalRows={rentalHistory.length}
        title="Export Rental History"
        description="Generate rental history reports."
        columns={rentalHistoryColumns}
      />
    </div>
    </PermissionGuard>
  );
};

export default VehicleDetail;

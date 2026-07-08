"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AlertDialog } from "@/components/ui/alert";
import { VehicleStatsCard } from "@/components/vehicle/dashboard/vehicle-stats-card";
import { VehicleTable } from "@/components/vehicle/dashboard/vehicle-table";
import { SearchFilters } from "@/components/search-filters";
import { PageHeader } from "@/components/page-header";
import { VehiclePagination } from "@/components/vehicle/dashboard/vehicle-pagination";
import { ExportOptions } from "@/components/ui/export";
import { vehicleApi } from "@/lib/api/vehicle";
import type { VehicleItem, VehicleSummary } from "@/lib/types/vehicle";
import { useAuth } from "@/lib/auth-context";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { canAccess } from "@/lib/can-access";

type VehicleStatus = "available" | "rented" | "maintenance";

interface VehicleDisplay {
  id?: string;
  name: string;
  year: number;
  transmission: string;
  plate: string;
  type: string;
  rate: string;
  status: VehicleStatus;
  image: string;
  imageAlt: string;
}

export default function DashboardVehiclePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleDisplay[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<VehicleSummary | null>(null);
  const itemsPerPage = 10;

  // State Confirm Dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // State Alert Dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const imageBase = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  ).replace(/\/api\/?$/, "");

  const fetchSummary = useCallback(async () => {
    try {
      const res = await vehicleApi.getSummary();
      setSummary(res.data);
    } catch {
      // non-critical
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    if (!canAccess(user?.permissions, 'vehicle.read')) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await vehicleApi.getList({ page: currentPage, limit: itemsPerPage });
      const items = Array.isArray(res.data) ? res.data : [];
      const mapped: VehicleDisplay[] = items.map((item: VehicleItem) => {
        const name = `${item.merk || ""} ${item.model || ""}`.trim() || "Unknown";
        const rawPhoto = item.vehicle_photo;
        const photoUrl = Array.isArray(rawPhoto) ? rawPhoto[0] : rawPhoto;
        const image = photoUrl
          ? photoUrl.startsWith("http")
            ? photoUrl
            : `${imageBase}/${photoUrl.replace(/^\//, "")}`
          : "";
        const year = item.launching_year ? new Date(item.launching_year).getFullYear() : 0;
        const statusMap: Record<string, VehicleStatus> = {
          Available: "available",
          Maintenance: "maintenance",
          Service: "rented",
          Reserved: "available",
          rented: "rented",
          retrieved: "maintenance",
        };
        return {
          id: item.id,
          name,
          year,
          transmission: "Automatic",
          plate: item.license_plate,
          type: "Sedan",
          rate: `Rp ${Number(item.daily_rate || 0).toLocaleString("id-ID")}`,
          status: statusMap[item.status] || "available",
          image,
          imageAlt: `${name} side view`,
        };
      });
      setVehicles(mapped);
      if (res.meta) {
        setTotalResults(res.meta.total);
        setTotalPages(res.meta.totalPages);
      } else {
        setTotalPages(1);
        setTotalResults(mapped.length);
      }
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, user]);

  useEffect(() => {
    const success = searchParams.get("success");
    const vehicle = searchParams.get("vehicle");

    if (success && vehicle) {
      const action = success === "updated" ? "Update" : "Registration";
      setAlertTitle(`${action} Successful`);
      setAlertMessage(`Vehicle ${decodeURIComponent(vehicle)} has been ${success} successfully.`);
      setAlertType("success");
      setIsAlertOpen(true);
      window.history.replaceState({}, "", "/dashboard/vehicle");
    }

    fetchVehicles();
  }, [searchParams, fetchVehicles]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleDeleteClick = (vehicle: any) => {
    const full = vehicles.find((v) => v.plate === vehicle.plate);
    setSelectedVehicle(full || vehicle);
    setIsConfirmOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!selectedVehicle) return;
    try {
      const id = selectedVehicle.id || vehicles.find((v) => v.plate === selectedVehicle.plate)?.id;
      if (!id) throw new Error("Vehicle ID not found");
      await vehicleApi.delete(id);
      setIsConfirmOpen(false);
      setAlertTitle("Delete Successful");
      setAlertMessage(`Vehicle ${selectedVehicle.name} (${selectedVehicle.plate}) has been deleted successfully.`);
      setAlertType("success");
      setIsAlertOpen(true);
      setSelectedVehicle(null);
      fetchVehicles();
      fetchSummary();
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
      setIsConfirmOpen(false);
      setAlertTitle("Delete Failed");
      setAlertMessage("Failed to delete vehicle. Please try again.");
      setAlertType("error");
      setIsAlertOpen(true);
    }
  };

  const handleExport = async (options?: ExportOptions) => {
    if (!options) return;
    const params: Record<string, string | number | undefined> = {
      format: options.format,
      columns: options.columns.join(","),
      type: options.type,
    };
    if (options.type === "filtered") {
      if (options.dateRange?.start) params.start_date = options.dateRange.start;
      if (options.dateRange?.end) params.end_date = options.dateRange.end;
    }
    await vehicleApi.exportData(params);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <PermissionGuard permission="vehicle.read">
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <PageHeader
          title="Vehicle List Overview"
          description="Manage your fleet, add new vehicles, and track their status."
          buttonText={canAccess(user?.permissions, "vehicle.create") ? "Add New Vehicle" : undefined}
          buttonHref={canAccess(user?.permissions, "vehicle.create") ? "/dashboard/vehicle/register" : undefined}
        />
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <VehicleStatsCard
            title="Total Vehicles"
            value={(summary?.total_vehicles ?? 0).toString()}
            icon="local_taxi"
            iconColor="text-primary"
            trend={{
              value: `Rented: ${summary?.rented ?? 0} | Available: ${summary?.available ?? 0}`,
              color: "text-green-600",
              icon: "trending_up",
            }}
          />
          <VehicleStatsCard
            title="Rented"
            value={(summary?.rented ?? 0).toString()}
            icon="key"
            iconColor="text-blue-500"
            trend={{
              value: `${((summary?.rented ?? 0) / (summary?.total_vehicles || 1) * 100).toFixed(0)}% of fleet`,
              color: "text-green-600",
              icon: "trending_up",
            }}
          />
          <VehicleStatsCard
            title="Available"
            value={(summary?.available ?? 0).toString()}
            icon="check_circle"
            iconColor="text-green-500"
            trend={{
              value: `${((summary?.available ?? 0) / (summary?.total_vehicles || 1) * 100).toFixed(0)}% of fleet`,
              color: "text-red-600",
              icon: "trending_down",
            }}
          />
          <VehicleStatsCard
            title="Maintenance"
            value={(summary?.maintenance ?? 0).toString()}
            icon="settings"
            iconColor="text-orange-500"
            trend={{
              value: `Service: ${summary?.service ?? 0}`,
              color: "text-gray-500",
              icon: "equal",
            }}
          />
          <VehicleStatsCard
            title="Retrieved"
            value={(summary?.retrieved ?? 0).toString()}
            icon="assignment_return"
            iconColor="text-purple-500"
            trend={{
              value: "Pending inspection",
              color: "text-green-600",
              icon: "history",
            }}
          />
        </section>

        <SearchFilters />
        <section className="xl:col-span-2">
          <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] shadow-sm overflow-hidden">
            {/* Vehicle Table */}
            <VehicleTable 
            vehicles={vehicles}
            onDelete={handleDeleteClick} 
            onExport={handleExport}
            />
            <VehiclePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              resultsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </div>
      {/* Confirm Dialog untuk Delete */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete ${selectedVehicle?.name} (${selectedVehicle?.plate})? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        confirmText="OK"
      />
    </div>
    </PermissionGuard>
  );
}

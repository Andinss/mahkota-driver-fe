"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { confirmToast, toastSuccess, toastError } from "@/components/ui/toast-provider";
import { VehicleStatsCard } from "@/components/vehicle/dashboard/vehicle-stats-card";
import { VehicleTable } from "@/components/vehicle/dashboard/vehicle-table";
import { SearchFilters } from "@/components/search-filters";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/ui/pagination";
import { ExportOptions } from "@/components/ui/export";
import { vehicleApi } from "@/lib/api/vehicle";
import type { VehicleItem, VehicleSummary, VehicleStatus } from "@/lib/types/vehicle";
import { useAuth } from "@/lib/auth-context";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { canAccess } from "@/lib/can-access";

interface VehicleDisplay {
  id?: string;
  name: string;
  year: number;
  plate: string;
  rate: string;
  costPrice: string;
  membership: string;
  status: VehicleStatus;
  isActive?: boolean;
  image: string;
  imageAlt: string;
  vendorName: string;
  deviceName: string;
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
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const toastShownRef = useRef(false);



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
        return {
          id: item.id,
          name,
          year,
          plate: item.license_plate,
          costPrice: `Rp ${Number(item.cost_price || 0).toLocaleString("id-ID")}`,
          rate: `Rp ${Number(item.daily_rate || 0).toLocaleString("id-ID")}`,
          membership: (item.memberships || []).map((m) => m.name).join(", "),
          status: item.status || "Available",
          isActive: item.is_active !== false,
          image,
          imageAlt: `${name} side view`,
          vendorName: item.vendor?.name || "-",
          deviceName: item.device_name || (item.imei ? item.imei : "-"),
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
  }, [currentPage, itemsPerPage, user]);

  useEffect(() => {
    const success = searchParams.get("success");
    const vehicle = searchParams.get("vehicle");

    if (success && vehicle && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Update" : "Registration";
      toastSuccess(`${action} Successful: Vehicle ${decodeURIComponent(vehicle)} has been ${success} successfully.`);
      window.history.replaceState({}, "", "/dashboard/vehicles");
    }

    fetchVehicles();
  }, [searchParams, fetchVehicles]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleDeleteClick = async (vehicle: any) => {
    const full = vehicles.find((v) => v.plate === vehicle.plate);
    const target = full || vehicle;
    const confirmed = await confirmToast({
      title: "Delete Vehicle",
      message: `Are you sure you want to delete ${target.name} (${target.plate})? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      variant: "danger",
    });
    if (confirmed) {
      try {
        const id = target.id || vehicles.find((v) => v.plate === target.plate)?.id;
        if (!id) throw new Error("Vehicle ID not found");
        await vehicleApi.delete(id);
        toastSuccess(`Vehicle ${target.name} (${target.plate}) has been deleted successfully.`);
        fetchVehicles();
        fetchSummary();
      } catch (err) {
        console.error("Failed to delete vehicle:", err);
        toastError("Failed to delete vehicle. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (vehicle: any) => {
    const isActive = vehicle.isActive !== false;
    const newStatus = !isActive;
    const action = isActive ? "deactivate" : "activate";

    const confirmed = await confirmToast({
      title: isActive ? "Mark as Inactive" : "Mark as Active",
      message: `Are you sure you want to ${action} ${vehicle.name} (${vehicle.plate})? ${
        isActive
          ? "This vehicle will not be available for rental."
          : "This vehicle will be available for rental again."
      }`,
      confirmText: `Yes, ${isActive ? "Deactivate" : "Activate"}`,
      cancelText: "Cancel",
      variant: isActive ? "danger" : "info",
    });

    if (!confirmed) return;

    try {
      const id = vehicle.id || vehicles.find((v) => v.plate === vehicle.plate)?.id;
      if (!id) throw new Error("Vehicle ID not found");

      await vehicleApi.updateStatus(id, newStatus);
      toastSuccess(
        `Vehicle ${vehicle.name} (${vehicle.plate}) has been ${action}d successfully.`,
      );
      fetchVehicles();
      fetchSummary();
    } catch (err: any) {
      console.error("Failed to update vehicle status:", err);
      toastError(err?.message || "Failed to update vehicle status.");
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


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <PermissionGuard permission="vehicle.read">
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <PageHeader
          title="Vehicle List Overview"
          description="Kelola armada, tambah kendaraan baru, dan lacak statusnya."
          buttonText={canAccess(user?.permissions, "vehicle.create") ? "Add New Vehicle" : undefined}
          buttonHref={canAccess(user?.permissions, "vehicle.create") ? "/dashboard/vehicles/register" : undefined}
        />
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <VehicleStatsCard
            title="Total Vehicles"
            value={(summary?.total_vehicles ?? 0).toString()}
            icon="local_taxi"
            iconColor="text-primary"
            trend={{
              value: `Fleet overview`,
              color: "text-slate-500",
              icon: "info",
            }}
          />
          <VehicleStatsCard
            title="Rented"
            value={(summary?.rented ?? 0).toString()}
            icon="key"
            iconColor="text-blue-500"
            trend={{
              value: `${((summary?.rented ?? 0) / (summary?.total_vehicles || 1) * 100).toFixed(0)}% of fleet`,
              color: "text-blue-500",
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
              color: "text-green-500",
              icon: "trending_up",
            }}
          />
          <VehicleStatsCard
            title="Reserved"
            value={(summary?.reserved ?? summary?.status_breakdown?.Reserved ?? 0).toString()}
            icon="bookmark"
            iconColor="text-purple-500"
            trend={{
              value: "Booked units",
              color: "text-purple-500",
              icon: "event",
            }}
          />
          <VehicleStatsCard
            title="Maintenance"
            value={(summary?.maintenance ?? 0).toString()}
            icon="settings"
            iconColor="text-orange-500"
            trend={{
              value: "Units under repair",
              color: "text-orange-500",
              icon: "build",
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
            onToggleStatus={handleToggleStatus} 
            onExport={handleExport}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              resultsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onPageSizeChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
            />
          </div>
        </section>
      </div>

    </div>
    </PermissionGuard>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Suspense } from "react";
import { DriverStatsCard } from "@/components/driver/dashboard/driver-stats-card";
import {
  DriverTableFilters,
  DriverFilters,
} from "@/components/driver/dashboard/driver-table-filters";
import { DriverTable } from "@/components/driver/dashboard/driver-table";
import { DriverPagination } from "@/components/driver/dashboard/driver-pagination";
import type { Driver } from "@/components/driver/dashboard/driver-table-row";
import { PageHeader } from "@/components/page-header";
import { useRouter } from "next/navigation";
import type { ExportOptions } from "@/components/ui/export";
import { driverApi } from "@/lib/api/driver";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";

export default function DriverPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<DriverFilters>({
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 10;

  const fetchDrivers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (filters.search) params.search = filters.search;

      const res = await driverApi.getList(params);
      const items = Array.isArray(res.data) ? res.data : [];
      const imageBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      ).replace(/\/api\/?$/, "");
      const mapped: Driver[] = items.map((item: Record<string, any>) => {
        const photo = item.profile_photo || "";
        const profilePhoto = photo
          ? photo.startsWith("http")
            ? photo
            : `${imageBase}/${photo.replace(/^\//, "")}`
          : "";
        return {
          id: item.id || item.employee_id || "",
          name: [item.first_name, item.last_name].filter(Boolean).join(" ") || item.name || "",
          profilePhoto,
          employeeId: item.employee_id || "",
          phoneNumber: item.phone || "",
          email: item.email || "",
        };
      });
      setDrivers(mapped);
      setTotalPages(1);
      setTotalResults(mapped.length);
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
      setDrivers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters.search]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleFilterChange = (newFilters: DriverFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExport = (options?: ExportOptions) => {
    if (!options) return;
    console.log("Export options from driver page:", options);
    alert(
      `Exporting driver data as ${options.format} with ${options.type} data`,
    );
  };

  const handleDetails = (driver: Driver) => {
    console.log("Details:", driver);
    router.push(`/dashboard/driver/detail`);
  };

  const handleDeleteDriver = async (driverId: string) => {
    try {
      await driverApi.delete(driverId);
      fetchDrivers();
    } catch {
      alert("Failed to delete driver");
    }
  };

  return (
    <div className="m-8">
      <PageHeader
        title="Driver List Overview"
        description="Manage your drivers, track their performance, and monitor their status."
        buttonText={canAccess(user?.permissions, "driver.create") ? "Add New Driver" : undefined}
        buttonHref={canAccess(user?.permissions, "driver.create") ? "/dashboard/driver/register" : undefined}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 mb-8">
        <DriverStatsCard
          title="Total Drivers"
          value={totalResults.toString()}
          icon="groups"
          iconColor="text-primary"
          trend={{
            icon: "trending_up",
            text: "All registered drivers",
            textColor: "text-emerald-500",
          }}
        />
        <DriverStatsCard
          title="Active"
          icon="check_circle"
          iconColor="text-emerald-500"
          value="2"
          trend={{
            icon: "fiber_manual_record",
            text: "On current trips",
            textColor: "text-emerald-500",
          }}
        />
        <DriverStatsCard
          title="On Leave"
          icon="event_busy"
          iconColor="text-amber-500"
          value="1"
          trend={{
            icon: "info",
            text: "Temporarily unavailable",
            textColor: "text-slate-400",
          }}
        />
        <DriverStatsCard
          title="Inactive"
          icon="person_off"
          iconColor="text-rose-500"
          value="2"
          trend={{
            icon: "warning",
            text: "Needs review",
            textColor: "text-rose-500",
          }}
        />
      </div>

      <Suspense
        fallback={
          <div className="rounded-xl border p-4 text-center">
            Loading filters...
          </div>
        }
      >
        <DriverTableFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </Suspense>
      <div className="bg-white mt-5 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            Loading drivers...
          </div>
        ) : (
          <>
            <DriverTable
              drivers={drivers}
              onDeleteDriver={handleDeleteDriver}
              onExport={handleExport}
              onDetailsDriver={handleDetails}
            />
            <div className="border-t border-slate-200 dark:border-slate-800">
              <DriverPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                resultsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

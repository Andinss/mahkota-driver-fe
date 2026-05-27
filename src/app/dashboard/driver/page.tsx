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
import type { DriverItem } from "@/lib/types/driver";

export default function DriverPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<DriverFilters>({
    search: "",
    performance: "Performance: All",
    status: "All Statuses",
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
      if (filters.status && filters.status !== "All Statuses") params.status = filters.status;

      const res = await driverApi.getList(params);
      const mapped: Driver[] = res.data.map((item: DriverItem) => ({
        name: item.name,
        imageUrl: item.imageUrl,
        joinedDate: item.joinedDate,
        employeeId: item.employeeId,
        phoneNumber: item.phoneNumber,
        licenseType: item.licenseType,
        totalTrips: item.totalTrips,
        status: item.status,
      }));
      setDrivers(mapped);
      setTotalPages(res.meta.totalPages);
      setTotalResults(res.meta.total);
    } catch {
      setDrivers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters.search, filters.status]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const activeDrivers = drivers.filter((d) => d.status === "Active").length;
  const onLeaveDrivers = drivers.filter((d) => d.status === "On Leave").length;
  const inactiveDrivers = drivers.filter((d) => d.status === "Inactive").length;

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
    alert(`Exporting driver data as ${options.format} with ${options.type} data`);
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
        buttonText="Add New Driver"
        buttonHref="/dashboard/driver/register"
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
          value={activeDrivers.toString()}
          icon="check_circle"
          iconColor="text-emerald-500"
          trend={{
            icon: "fiber_manual_record",
            text: "On current trips",
            textColor: "text-emerald-500",
          }}
        />
        <DriverStatsCard
          title="On Leave"
          value={onLeaveDrivers.toString()}
          icon="event_busy"
          iconColor="text-amber-500"
          trend={{
            icon: "info",
            text: "Temporarily unavailable",
            textColor: "text-slate-400",
          }}
        />
        <DriverStatsCard
          title="Inactive"
          value={inactiveDrivers.toString()}
          icon="person_off"
          iconColor="text-rose-500"
          trend={{
            icon: "warning",
            text: "Needs review",
            textColor: "text-rose-500",
          }}
        />
      </div>

      <Suspense fallback={<div className="rounded-xl border p-4 text-center">Loading filters...</div>}>
        <DriverTableFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </Suspense>
      <div className="bg-white mt-5 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading drivers...</div>
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

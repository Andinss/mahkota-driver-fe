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
import { supervisorApi } from "@/lib/api/supervisor";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { PermissionGuard } from "@/components/auth-guard-permission";

export default function DriverPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<DriverFilters>({
    search: "",
  });
  const [driverCount, setDriverCount] = useState<{ count: number; max: number; remaining: number } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 10;

  const isSupervisor = user?.role?.code === "SUPERVISOR";

  const fetchDrivers = useCallback(async () => {
    if (!canAccess(user?.permissions, 'driver.read.all') && !canAccess(user?.permissions, 'driver.read.own')) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      let items: Record<string, any>[] = [];

      if (isSupervisor) {
        const res = await supervisorApi.getList();
        items = Array.isArray((res as any).data) ? (res as any).data : [];
      } else {
        const params: Record<string, string | number | undefined> = {
          page: currentPage,
          limit: itemsPerPage,
        };
        if (filters.search) params.search = filters.search;
        const res = await driverApi.getList(params);
        items = Array.isArray(res.data) ? res.data : [];
      }

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
  }, [currentPage, filters.search, isSupervisor]);

  const fetchCount = useCallback(async () => {
    if (!isSupervisor) return;
    try {
      const res = await supervisorApi.getCount();
      setDriverCount((res as any).data);
    } catch {}
  }, [isSupervisor]);

  useEffect(() => {
    fetchDrivers();
    fetchCount();
  }, [fetchDrivers, fetchCount]);

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
    alert(
      `Exporting driver data as ${options.format} with ${options.type} data`,
    );
  };

  const handleDetails = (driver: Driver) => {
    router.push(`/dashboard/driver/detail`);
  };

  const handleDeleteDriver = async (driverId: string) => {
    try {
      if (isSupervisor) {
        await supervisorApi.delete(driverId);
      } else {
        await driverApi.delete(driverId);
      }
      fetchDrivers();
      fetchCount();
    } catch {
      alert("Failed to delete driver");
    }
  };

  return (
    <PermissionGuard permission="driver.read.all" fallbackPermission="driver.read.own">
    <div className="m-8">
      <PageHeader
        title={isSupervisor ? "My Drivers" : "Driver List Overview"}
        description={isSupervisor ? "Manage your assigned drivers" : "Manage your drivers, track their performance, and monitor their status."}
        buttonText={canAccess(user?.permissions, "driver.create") ? "Add New Driver" : undefined}
        buttonHref={canAccess(user?.permissions, "driver.create") ? "/dashboard/driver/register" : undefined}
      />

      {isSupervisor && driverCount && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Driver Quota: {driverCount.count}/{driverCount.max}
              </span>
              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                ({driverCount.remaining} remaining)
              </span>
            </div>
            <div className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  driverCount.remaining === 0
                    ? "bg-red-500"
                    : driverCount.remaining <= 3
                    ? "bg-amber-500"
                    : "bg-primary"
                }`}
                style={{ width: `${(driverCount.count / driverCount.max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 mb-8">
        <DriverStatsCard
          title={isSupervisor ? "My Drivers" : "Total Drivers"}
          value={totalResults.toString()}
          icon="groups"
          iconColor="text-primary"
          trend={{
            icon: "trending_up",
            text: isSupervisor ? "Drivers under your supervision" : "All registered drivers",
            textColor: "text-emerald-500",
          }}
        />
        <DriverStatsCard
          title="Active"
          icon="check_circle"
          iconColor="text-emerald-500"
          value="0"
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
          value="0"
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
          value="0"
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
    </PermissionGuard>
  );
}

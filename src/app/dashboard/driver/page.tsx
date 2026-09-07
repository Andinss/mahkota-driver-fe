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
import type { DriverSummary } from "@/lib/types/driver";
import { supervisorApi } from "@/lib/api/supervisor";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { HttpClientError } from "@/lib/api-http";
import { toastError } from "@/components/ui/toast-provider";

export default function DriverPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<DriverFilters>({
    search: "",
  });
  const [driverCount, setDriverCount] = useState<{ count: number; max: number; remaining: number } | null>(null);
  const [summary, setSummary] = useState<DriverSummary | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 10;

  const hasReadAll = canAccess(user?.permissions, 'driver.read.all');
  const hasReadOwn = canAccess(user?.permissions, 'driver.read.own');

  const fetchDrivers = useCallback(async () => {
    if (!hasReadAll && !hasReadOwn) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      let items: Record<string, any>[] = [];
      let meta: { total: number; totalPages: number } | null = null;

      if (!hasReadAll && hasReadOwn) {
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
        if (res.meta) {
          meta = { total: res.meta.total, totalPages: res.meta.totalPages };
        }
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
          saldo: item.saldo ? Number(item.saldo.balance) : 0,
        };
      });
      setDrivers(mapped);
      if (meta) {
        setTotalResults(meta.total);
        setTotalPages(meta.totalPages);
      } else {
        setTotalResults(mapped.length);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Failed to fetch drivers:", err);
      const msg = err instanceof HttpClientError ? err.message : "Failed to load driver data.";
      toastError(msg);
      setDrivers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters.search, hasReadAll, hasReadOwn]);

  const fetchCount = useCallback(async () => {
    if (hasReadAll || !hasReadOwn) return;
    try {
      const res = await supervisorApi.getCount();
      setDriverCount((res as any).data);
    } catch (err: any) {
      console.error("Failed to fetch driver count:", err);
    }
  }, [hasReadAll, hasReadOwn]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await driverApi.getSummary();
      setSummary(res.data);
    } catch (err: any) {
      console.error("Failed to fetch driver summary:", err);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
    fetchCount();
    fetchSummary();
  }, [fetchDrivers, fetchCount, fetchSummary]);

  const handleFilterChange = (newFilters: DriverFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExport = async (options?: ExportOptions) => {
    if (!options) return;
    try {
      const params: Record<string, string | number | undefined> = {
        format: options.format,
        columns: options.columns.join(","),
        type: options.type,
      };
      if (options.type === "filtered") {
        if (filters.search) params.search = filters.search;
        if (options.dateRange?.start) params.start_date = options.dateRange.start;
        if (options.dateRange?.end) params.end_date = options.dateRange.end;
      }
      await driverApi.exportData(params);
    } catch (err: any) {
      const msg = err instanceof HttpClientError ? err.message : "Failed to export driver data.";
      toastError(msg);
    }
  };

  const handleDetails = (driver: Driver) => {
    router.push(`/dashboard/driver/detail?id=${driver.id}`);
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (!hasReadAll && hasReadOwn) {
      await supervisorApi.delete(driverId);
    } else {
      await driverApi.delete(driverId);
    }
    await fetchDrivers();
    await fetchCount();
  };

  return (
    <>
    <PermissionGuard permission="driver.read.all" fallbackPermission="driver.read.own">
    <div className="m-8">
      <PageHeader
        title={!hasReadAll && hasReadOwn ? "My Drivers" : "Driver List Overview"}
        description={!hasReadAll && hasReadOwn ? "Manage your assigned drivers" : "Manage your drivers, track their performance, and monitor their status."}
        buttonText={canAccess(user?.permissions, "driver.create") ? "Add New Driver" : undefined}
        buttonHref={canAccess(user?.permissions, "driver.create") ? "/dashboard/driver/register" : undefined}
      />

      {!hasReadAll && hasReadOwn && driverCount && (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 mb-8">
        <DriverStatsCard
          title={!hasReadAll && hasReadOwn ? "My Drivers" : "Total Drivers"}
          value={(summary?.total_drivers ?? totalResults).toString()}
          icon="groups"
          iconColor="text-primary"
          trend={{
            icon: "trending_up",
            text: summary ? `Male: ${summary.gender_breakdown?.Male ?? 0} | Female: ${summary.gender_breakdown?.Female ?? 0}` : (hasReadOwn ? "Drivers under your supervision" : "All registered drivers"),
            textColor: "text-emerald-500",
          }}
        />
        <DriverStatsCard
          title="Saldo Overview"
          icon="account_balance_wallet"
          iconColor="text-blue-500"
          value={drivers.reduce((sum, d) => sum + (d.saldo ?? 0), 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
          trend={{
            icon: "wallet",
            text: `Across ${drivers.length} displayed drivers`,
            textColor: "text-slate-400",
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
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
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

    </>
  );
}

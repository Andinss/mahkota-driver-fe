"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { toastError } from "@/components/ui/toast-provider";
import { getErrorMessage } from "@/lib/utils/error-message";
import {
  monitoringApi,
  type GpsTrackingRecord,
  getDriverName,
  getVendorName,
} from "@/lib/api/monitoring";
import { Pagination } from "@/components/ui/pagination";
import { MonitoringFilters } from "@/components/monitoring/dashboard/filters-search";
import { MonitoringTable } from "@/components/monitoring/dashboard/monitoring-table";

export default function MonitoringPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const hasAccess = canAccess(user?.permissions, "monitoring.read");
  // Supervisor hanya melihat armada yang disewa driver miliknya.
  const isSupervisor =
    canAccess(user?.permissions, "driver.read.own") &&
    !canAccess(user?.permissions, "driver.read.all");

  const [records, setRecords] = useState<GpsTrackingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (isLoading) return;
    if (!hasAccess) {
      toastError("Anda tidak memiliki izin untuk mengakses halaman ini.");
      router.replace("/dashboard");
    }
  }, [isLoading, hasAccess, router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await monitoringApi
        .getList({ limit: 1000, scope: isSupervisor ? "own" : undefined })
        .catch((err: unknown) => {
          console.error("Gagal memuat data monitoring:", err);
          toastError(getErrorMessage(err, "Gagal memuat data monitoring."));
          return { success: false, data: [] };
        });
      if (res.success && Array.isArray(res.data)) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat data monitoring:", err);
      setRecords([]);
      toastError(getErrorMessage(err, "Gagal memuat data monitoring."));
    } finally {
      setLoading(false);
    }
  }, [isSupervisor]);

  useEffect(() => {
    if (hasAccess && !isLoading) {
      fetchData();
    }
  }, [hasAccess, isLoading, fetchData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      const status = (r.Car_Status || "").toLowerCase();
      const matchesStatus =
        !statusFilter ||
        status === statusFilter ||
        (statusFilter === "moving" && status === "moving") ||
        (statusFilter === "idle" &&
          (status === "idle" || status === "parking")) ||
        (statusFilter === "emergency" && status === "emergency");
      const matchesSearch =
        !q ||
        (r.VehicleNumber || "").toLowerCase().includes(q) ||
        (r.GpsLocation || "").toLowerCase().includes(q) ||
        (r.VehicleId || "").toLowerCase().includes(q) ||
        (r.VehicleType || "").toLowerCase().includes(q) ||
        getDriverName(r).toLowerCase().includes(q) ||
        getVendorName(r).toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [records, search, statusFilter]);

  const handleEngineChanged = useCallback(
    (vehicleId: string, engineStatus: "on" | "off") => {
      setRecords((prev) =>
        prev.map((r) =>
          r.vehicle?.id === vehicleId ||
          r.VehicleId === vehicleId ||
          r.id === vehicleId
            ? { ...r, Engine: engineStatus }
            : r,
        ),
      );
    },
    [],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const emergencyCount = records.filter(
    (r) => (r.Car_Status || "").toLowerCase() === "emergency",
  ).length;
  const movingCount = records.filter(
    (r) => (r.Car_Status || "").toLowerCase() === "moving",
  ).length;
  const idleCount = records.filter((r) =>
    ["idle", "parking", "stopped", ""].includes(
      (r.Car_Status || "").toLowerCase(),
    ),
  ).length;

  return (
    <div className="flex-1 overflow-y-auto">
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="material-symbols-outlined text-xl animate-spin">
              progress_activity
            </span>
            <span className="text-sm font-medium">Memuat data armada...</span>
          </div>
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
          <PageHeader
            title="Monitoring"
            description="Daftar lokasi armada real-time dari GPS tracking."
            buttonText="Lihat Peta"
            buttonHref="/dashboard/monitorings/real-time"
            buttonIcon="map"
          />

          {/* Stats — 3 kolom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Darurat */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-red-50 dark:bg-red-900/20">
                  <span className="material-symbols-outlined text-2xl text-red-500">
                    warning
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {emergencyCount}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Darurat</p>
                </div>
              </div>
            </div>

            {/* Bergerak */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-900/20">
                  <span className="material-symbols-outlined text-2xl text-blue-500">
                    directions_car
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {movingCount}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Bergerak</p>
                </div>
              </div>
            </div>

            {/* Idle */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-2xl text-slate-500 dark:text-slate-400">
                    schedule
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {idleCount}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Idle</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <MonitoringFilters
            searchValue={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            statusValue={statusFilter}
            onStatusChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          />

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <MonitoringTable
              records={paged}
              totalResults={filtered.length}
              onEngineChanged={handleEngineChanged}
            />

            {filtered.length > 0 && (
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                totalResults={filtered.length}
                resultsPerPage={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

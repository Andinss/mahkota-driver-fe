"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { useRouter } from "next/navigation";
import { toastError } from "@/components/ui/toast-provider";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { monitoringApi } from "@/lib/api/monitoring";
import type { FleetLocation } from "@/lib/types/monitoring";
import type { MonitoringTask } from "@/lib/api/monitoring";
import { MonitoringTable, mergeData, type MergedVehicle } from "@/components/monitoring/task-list/monitoring-table";
import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export default function MonitoringPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const hasAccess = canAccess(user?.permissions, "monitoring.read");

  const [tasks, setTasks] = useState<MonitoringTask[]>([]);
  const [locations, setLocations] = useState<FleetLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (isLoading) return;
    if (!hasAccess) {
      toastError("Anda tidak memiliki izin untuk mengakses halaman ini.");
      router.replace("/dashboard");
    }
  }, [isLoading, hasAccess]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRes, locRes] = await Promise.all([
        monitoringApi.getTasks().catch(() => ({ success: false, data: [] })),
        monitoringApi
          .getFleetLocations()
          .catch(() => ({ success: false, data: [] })),
      ]);
      if (taskRes.success && Array.isArray(taskRes.data)) {
        setTasks(taskRes.data);
      }
      if (locRes.success && Array.isArray(locRes.data)) {
        setLocations(locRes.data);
      }
    } catch {
      setTasks([]);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasAccess && !isLoading) {
      fetchData();
    }
  }, [hasAccess, isLoading, fetchData]);

  const merged = useMemo(() => mergeData(tasks, locations), [tasks, locations]);

  const filtered = useMemo(() => {
    if (!search.trim()) return merged;
    const q = search.toLowerCase();
    return merged.filter(
      (v) =>
        v.vehicleName.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q),
    );
  }, [merged, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const emergencyCount = merged.filter(
    (v) => v.fleetStatus === "emergency",
  ).length;
  const movingCount = merged.filter((v) => v.fleetStatus === "moving").length;
  const idleCount = merged.filter((v) => v.fleetStatus === "idle").length;

  return (
    <>
      {isLoading || !hasAccess ? null : (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <PageHeader
                title="Monitoring List Overview"
                description="Pantau status seluruh armada secara real-time."
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-500 text-2xl">
                      warning
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {emergencyCount}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Darurat
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-500 text-2xl">
                      directions_car
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {movingCount}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Bergerak
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500 text-2xl">
                      pause_circle
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {idleCount}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">Idle</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Cari kendaraan, plat, atau lokasi..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        close
                      </span>
                    </button>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {filtered.length} dari {merged.length} kendaraan
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-500 text-xl">
                      monitoring
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 dark:text-white text-base">
                      Status Armada
                    </h2>
                    <p className="text-xs text-slate-400">
                      {merged.length} kendaraan terpantau
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/dashboard/monitoring/real-time")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all text-sm"
                >
                  <span className="material-symbols-outlined text-lg">map</span>
                  Lihat Peta
                </button>
              </div>
              <MonitoringTable
                vehicles={paged}
                loading={loading}
                onRefresh={fetchData}
              />
              {!loading && filtered.length > 0 && (
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
        </div>
      )}
    </>
  );
}

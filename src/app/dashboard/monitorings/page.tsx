"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { toastError } from "@/components/ui/toast-provider";
import { monitoringApi, type GpsTrackingRecord } from "@/lib/api/monitoring";
import { Pagination } from "@/components/ui/pagination";
import { EngineSwitch } from "@/components/ui/engine-switch";
import { MonitoringFilters } from "@/components/monitoring/dashboard/filters-search";

const statusLabel: Record<string, string> = {
  emergency: "Darurat",
  moving: "Bergerak",
  idle: "Idle",
  stopped: "Berhenti",
  parking: "Parkir",
};

const statusClass: Record<string, string> = {
  emergency: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  moving: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  idle: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  stopped: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  parking: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

// Dummy display data (FE only) — diganti join BE nanti
const DUMMY_VEHICLES: Record<
  string,
  { vehicle_name: string; vendor: string }
> = {
  "veh-001": { vehicle_name: "Toyota Avanza 1.3 G", vendor: "Nusantara Rental" },
  "veh-002": { vehicle_name: "Honda Brio Satya", vendor: "Mitra Jaya Trans" },
  "veh-003": { vehicle_name: "Suzuki Ertiga GX", vendor: "Bali Fleet Service" },
  "veh-004": { vehicle_name: "Mitsubishi Xpander", vendor: "Nusantara Rental" },
  "veh-005": { vehicle_name: "Daihatsu Xenia", vendor: "Sinar Motor" },
  "veh-006": { vehicle_name: "Toyota Innova Zenix", vendor: "Mitra Jaya Trans" },
};

const FALLBACK_VEHICLE = {
  vehicle_name: "Kendaraan Armada",
  vendor: "Vendor Umum",
};

const resolveVehicleDisplay = (r: GpsTrackingRecord) => {
  const byId = DUMMY_VEHICLES[r.VehicleId];
  if (byId) return byId;
  const byPlate = DUMMY_VEHICLES[r.VehicleNumber];
  if (byPlate) return byPlate;
  return FALLBACK_VEHICLE;
};

export default function MonitoringPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const hasAccess = canAccess(user?.permissions, "monitoring.read");

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
        .getList({ limit: 1000 })
        .catch(() => ({ success: false, data: [] }));
      if (res.success && Array.isArray(res.data)) {
        setRecords(res.data);
      }
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
        (statusFilter === "idle" && (status === "idle" || status === "parking")) ||
        (statusFilter === "emergency" && status === "emergency");
      const matchesSearch =
        !q ||
        (r.VehicleNumber || "").toLowerCase().includes(q) ||
        (r.GpsLocation || "").toLowerCase().includes(q) ||
        (r.VehicleId || "").toLowerCase().includes(q) ||
        (r.VehicleType || "").toLowerCase().includes(q) ||
        resolveVehicleDisplay(r).vehicle_name.toLowerCase().includes(q) ||
        resolveVehicleDisplay(r).vendor.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [records, search, statusFilter]);

  const handleEngineChanged = useCallback(
    (vehicleId: string, engineStatus: "on" | "off") => {
      setRecords((prev) =>
        prev.map((r) =>
          r.VehicleId === vehicleId ? { ...r, Engine: engineStatus } : r,
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
  const idleCount = records.filter(
    (r) =>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
          <PageHeader
            title="Monitoring"
            description="Daftar lokasi armada real-time dari GPS tracking."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "emergency", label: "Darurat", value: emergencyCount, icon: "warning", iconBg: "bg-red-50 dark:bg-red-900/20", iconColor: "text-red-500" },
              { key: "moving", label: "Bergerak", value: movingCount, icon: "directions_car", iconBg: "bg-blue-50 dark:bg-blue-900/20", iconColor: "text-blue-500" },
              { key: "idle", label: "Idle", value: idleCount, icon: "schedule", iconBg: "bg-slate-100 dark:bg-slate-800", iconColor: "text-slate-500 dark:text-slate-400" },
            ].map((s) => (
              <div
                key={s.key}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                    <span className={`material-symbols-outlined text-2xl ${s.iconColor}`}>{s.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                    <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500 text-xl">satellite_alt</span>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-white text-base">
                    Lokasi Armada
                  </h2>
                  <p className="text-xs text-slate-400">{filtered.length} kendaraan tercatat</p>
                </div>
              </div>
              <Link href="/dashboard/monitorings/real-time">
                <Button icon="map">
                  Lihat Peta
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-4 whitespace-nowrap">Nama Mobil</th>
                    <th className="px-4 py-4 whitespace-nowrap">Plat</th>
                    <th className="px-4 py-4 whitespace-nowrap">Vendor</th>
                    <th className="px-4 py-4 whitespace-nowrap">Lokasi</th>
                    <th className="px-4 py-4 whitespace-nowrap">Koordinat</th>
                    <th className="px-4 py-4 whitespace-nowrap">Waktu (UTC)</th>
                    <th className="px-4 py-4 whitespace-nowrap">Status</th>
                    <th className="px-4 py-4 whitespace-nowrap">Kecepatan</th>
                    <th className="px-4 py-4 whitespace-nowrap">Arah</th>
                    <th className="px-4 py-4 whitespace-nowrap">Odometer</th>
                    <th className="px-4 py-4 whitespace-nowrap">Tipe</th>
                    <th className="px-4 py-4 whitespace-nowrap">Alarm</th>
                    <th className="px-4 py-4 whitespace-nowrap">Mesin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {paged.map((r) => {
                    const status = (r.Car_Status || "").toLowerCase();
                    const engineOn = r.Engine === "on";
                    const display = resolveVehicleDisplay(r);
                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {display.vehicle_name}
                          </p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            {r.VehicleNumber || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
                            <span className="material-symbols-outlined text-sm">
                              business
                            </span>
                            {display.vendor}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-lg">
                              location_on
                            </span>
                            <span className="text-slate-600 dark:text-slate-400 truncate max-w-[180px]">
                              {r.GpsLocation || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {r.Lat && r.Lon ? `${r.Lat}, ${r.Lon}` : "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                          {r.DatetimeUTC || "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              statusClass[status] || statusClass.idle
                            }`}
                          >
                            {statusLabel[status] || r.Car_Status || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {r.Speed ? `${r.Speed} km/h` : "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {r.Direction ? `${r.Direction}°` : "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {r.Odometer || "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                            {r.VehicleType || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                          {r.Alarm && r.Alarm !== "none" ? r.Alarm : "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <EngineSwitch
                              key={`${r.VehicleId}-${r.Engine}`}
                              vehicleId={r.VehicleId}
                              engineStatus={engineOn ? "on" : "off"}
                              onChanged={(next) =>
                                handleEngineChanged(r.VehicleId, next)
                              }
                            />
                            <span
                              className={`text-xs font-bold ${
                                engineOn
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-slate-400 dark:text-slate-500"
                              }`}
                            >
                              {engineOn ? "ON" : "OFF"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {paged.length === 0 && (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block">
                    location_off
                  </span>
                  <p className="text-slate-400 text-sm font-medium">
                    Tidak ada data ditemukan
                  </p>
                </div>
              )}
            </div>

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

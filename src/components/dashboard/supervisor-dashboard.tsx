"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/card";
import { Card } from "@/components/ui/card";
import { QuickAction } from "@/components/dashboard/quick-action";
import { supervisorApi } from "@/lib/api/supervisor";
import { outOfTownApi } from "@/lib/api/out-of-town";
import { toastError } from "@/components/ui/toast-provider";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { DriverItem, DriverSummary } from "@/lib/types/driver";
import type { OutOfTownItem, OutOfTownStats } from "@/lib/types/out-of-town";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
);

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const EMPTY_SUMMARY: DriverSummary = {
  total_drivers: 0,
  active_drivers: 0,
  inactive_drivers: 0,
  gender_breakdown: {},
};

const EMPTY_STATS: OutOfTownStats = {
  pending: 0,
  approved: 0,
  rejected: 0,
  total: 0,
};

/** Dashboard khusus supervisor: fokus ke driver miliknya & izin keluar kota. */
export function SupervisorDashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState<DriverSummary>(EMPTY_SUMMARY);
  const [quota, setQuota] = useState({ count: 0, max: 10, remaining: 10 });
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [outOfTownStats, setOutOfTownStats] =
    useState<OutOfTownStats>(EMPTY_STATS);
  const [outOfTownRequests, setOutOfTownRequests] = useState<OutOfTownItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      await Promise.allSettled([
        supervisorApi
          .getSummary()
          .then((r) => {
            if (!cancelled) setSummary(r.data ?? EMPTY_SUMMARY);
          })
          .catch((err) => {
            toastError(getErrorMessage(err, "Gagal memuat ringkasan driver."));
          }),
        supervisorApi
          .getCount()
          .then((r) => {
            if (!cancelled) setQuota(r.data);
          })
          .catch((err) => {
            toastError(getErrorMessage(err, "Gagal memuat kuota driver."));
          }),
        supervisorApi
          .getList({ is_active: "all" })
          .then((r) => {
            if (!cancelled) setDrivers(Array.isArray(r.data) ? r.data : []);
          })
          .catch((err) => {
            toastError(getErrorMessage(err, "Gagal memuat daftar driver."));
          }),
        outOfTownApi
          .stats()
          .then((r) => {
            if (!cancelled) setOutOfTownStats(r.data ?? EMPTY_STATS);
          })
          .catch((err) => {
            toastError(
              getErrorMessage(err, "Gagal memuat statistik izin keluar kota."),
            );
          }),
        outOfTownApi
          .list()
          .then((r) => {
            if (!cancelled) {
              setOutOfTownRequests(Array.isArray(r.data) ? r.data : []);
            }
          })
          .catch((err) => {
            toastError(
              getErrorMessage(err, "Gagal memuat pengajuan izin keluar kota."),
            );
          }),
      ]);
      if (!cancelled) setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const { newDriversPerMonth, outOfTownPerMonth } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const driverCounts = Array<number>(12).fill(0);
    const outOfTownCounts = Array<number>(12).fill(0);

    drivers.forEach((driver) => {
      if (!driver.created_at) return;
      const date = new Date(driver.created_at);
      if (date.getFullYear() === currentYear) {
        driverCounts[date.getMonth()] += 1;
      }
    });

    outOfTownRequests.forEach((request) => {
      if (!request.created_at) return;
      const date = new Date(request.created_at);
      if (date.getFullYear() === currentYear) {
        outOfTownCounts[date.getMonth()] += 1;
      }
    });

    return {
      newDriversPerMonth: driverCounts,
      outOfTownPerMonth: outOfTownCounts,
    };
  }, [drivers, outOfTownRequests]);

  const totalNewDrivers = newDriversPerMonth.reduce((sum, v) => sum + v, 0);
  const totalOutOfTown = outOfTownPerMonth.reduce((sum, v) => sum + v, 0);

  const chartData = {
    labels: MONTH_LABELS,
    datasets: [
      {
        label: "Driver baru",
        data: newDriversPerMonth,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Izin keluar kota",
        data: outOfTownPerMonth,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "#f59e0b",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderWidth: 0,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: "#e2e8f0" },
        ticks: { color: "#94a3b8", font: { size: 13 } },
        border: { color: "#e2e8f0" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e2e8f0" },
        ticks: {
          color: "#94a3b8",
          font: { size: 12 },
          precision: 0,
        },
        border: { color: "#e2e8f0" },
      },
    },
  };

  if (loading) {
    return (
      <div className="p-7 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 dark:text-slate-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-7 space-y-8">
      {/* Summary Cards — hanya data milik supervisor */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Driver Saya"
          value={summary.total_drivers.toLocaleString("id-ID")}
          subtitle={`dari ${quota.max}`}
          icon="groups"
          iconColor="text-indigo-500"
        />
        <StatCard
          title="Driver Aktif"
          value={summary.active_drivers.toLocaleString("id-ID")}
          icon="check_circle"
          iconColor="text-emerald-500"
        />
        <StatCard
          title="Driver Nonaktif"
          value={summary.inactive_drivers.toLocaleString("id-ID")}
          icon="person_off"
          iconColor="text-red-500"
        />
        <StatCard
          title="Izin Keluar Kota"
          value={outOfTownStats.pending.toLocaleString("id-ID")}
          subtitle="pending"
          icon="travel_explore"
          iconColor="text-amber-500"
        />
      </section>

      {/* Chart aktivitas + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-6">
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">
                Aktivitas Supervisor
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Driver baru & pengajuan izin keluar kota per bulan
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-400">
                Tahun {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <div className="w-full h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-500">
                Driver baru: {totalNewDrivers}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-500">
                Izin keluar kota: {totalOutOfTown}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 h-full">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-5">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
            <QuickAction
              icon="person_add"
              title="Tambah Driver"
              description="Daftarkan driver baru"
              variant="indigo"
              onClick={() => router.push("/dashboard/drivers/register")}
            />
            <QuickAction
              icon="car_rental"
              title="Rental Baru"
              description="Buat kontrak sewa"
              variant="amber"
              onClick={() => router.push("/dashboard/rentals/new")}
            />
            <QuickAction
              icon="travel_explore"
              title="Izin Keluar Kota"
              description="Review pengajuan driver"
              variant="primary"
              onClick={() => router.push("/dashboard/monitorings/out-of-town")}
            />
            <QuickAction
              icon="map"
              title="Lihat Peta"
              description="Pantau armada real-time"
              variant="indigo"
              onClick={() => router.push("/dashboard/monitorings/real-time")}
            />
            <QuickAction
              icon="badge"
              title="Driver Saya"
              description="Lihat & kelola driver"
              variant="slate"
              onClick={() => router.push("/dashboard/drivers")}
            />
          </div>
        </Card>
      </div>

      <footer className="pb-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>© 2026 Mahkota Drive. All rights reserved.</p>
      </footer>
    </div>
  );
}

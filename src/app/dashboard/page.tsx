"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/card";
import { Card } from "@/components/ui/card";
import { QuickAction } from "@/components/dashboard/quick-action";
import { financeApi } from "@/lib/api/finances";
import { rentalApi } from "@/lib/api/rentals";
import { vehicleApi } from "@/lib/api/vehicle";
import { driverApi } from "@/lib/api/driver";
import { usersApi } from "@/lib/api/users";
import type { MonthlyFinanceItem } from "@/lib/types/finances";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

export default function DashboardPage() {
  const router = useRouter();
  const [financeAmount, setFinanceAmount] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyFinanceItem[]>([]);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRentals, setTotalRentals] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      financeApi
        .getSummary()
        .then((r) => {
          setFinanceAmount(r.data.total_amount_received);
        })
        .catch(() => {}),
      financeApi
        .getMonthlySummary()
        .then((r) => {
          setMonthlyData(r.data.months);
        })
        .catch(() => {}),
      rentalApi
        .getSummary()
        .then((r) => {
          setTotalRentals(r.data.total_rentals);
        })
        .catch(() => {}),
      vehicleApi
        .getSummary()
        .then((r) => {
          setTotalVehicles(r.data.total_vehicles);
        })
        .catch(() => {}),
      driverApi
        .getSummary()
        .then((r) => {
          setTotalDrivers(r.data.total_drivers);
        })
        .catch(() => {}),
      usersApi
        .getSummary()
        .then((r) => {
          setTotalUsers(r.data.total_users);
        })
        .catch(() => {}),
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const monthlyTotals = monthlyData.map((d) => d.total);
  const totalFinance = monthlyTotals.reduce((sum, v) => sum + v, 0);

  const chartData = {
    labels: MONTH_LABELS,
    datasets: [
      {
        label: "Finance",
        data: monthlyTotals,
        borderColor: "#137fec",
        backgroundColor: "rgba(19, 127, 236, 0.1)",
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: "#137fec",
        pointBorderColor: "#fff",
        pointBorderWidth: 3,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "none",
        borderWidth: 0,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx: any) => formatCurrency(ctx.parsed.y || 0),
        },
      },
    },
    scales: {
      x: {
        grid: { color: "#e2e8f0" },
        ticks: { color: "#94a3b8", font: { size: 13 } },
        border: { color: "#e2e8f0" },
      },
      y: {
        grid: { color: "#e2e8f0" },
        ticks: {
          color: "#94a3b8",
          font: { size: 12 },
          callback: (v: any) =>
            v >= 1000000
              ? `Rp${(v / 1000000).toFixed(1)}M`
              : v >= 1000
                ? `Rp${(v / 1000).toFixed(0)}K`
                : `Rp${v}`,
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
      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Drivers"
          value={totalDrivers.toLocaleString("id-ID")}
          icon="groups"
          iconColor="text-indigo-500"
        />
        <StatCard
          title="Total Users"
          value={totalUsers.toLocaleString("id-ID")}
          icon="person"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Total Vehicles"
          value={totalVehicles.toLocaleString("id-ID")}
          icon="local_taxi"
          iconColor="text-amber-500"
        />
        <StatCard
          title="Total Rentals"
          value={totalRentals.toLocaleString("id-ID")}
          icon="key"
          iconColor="text-emerald-500"
        />
      </section>

      {/* Revenue Chart + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">
                Revenue Overview
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Total revenue from finance
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalFinance)}
              </p>
              <p className="text-xs text-slate-400">Total finance {new Date().getFullYear()}</p>
            </div>
          </div>

          <div className="w-full h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-500">
                Finance: {formatCurrency(totalFinance)}
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
              title="Add New User"
              description="Register manually"
              variant="primary"
              onClick={() => router.push("/dashboard/users/new")}
            />
            <QuickAction
              icon="car_rental"
              title="New Rental"
              description="Create rental contract"
              variant="amber"
              onClick={() => router.push("/dashboard/rent/new")}
            />
            <QuickAction
              icon="person_add"
              title="Add Driver"
              description="Register new driver"
              variant="indigo"
              onClick={() => router.push("/dashboard/driver/register")}
            />
            <QuickAction
              icon="local_taxi"
              title="Add Vehicle"
              description="Register new vehicle"
              variant="slate"
              onClick={() => router.push("/dashboard/vehicle/register")}
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

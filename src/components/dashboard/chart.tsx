"use client";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { QuickAction } from "./quick-action";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface ChartCardProps {
  financeByMethod?: ChartData[];
  rentalByMethod?: ChartData[];
}

const COLORS = ["#137fec", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

export const ChartCard = ({ financeByMethod = [], rentalByMethod = [] }: ChartCardProps) => {
  const router = useRouter();

  const chartData = financeByMethod.length > 0
    ? financeByMethod
    : [
        { name: "Cash", value: 0, fill: COLORS[0] },
        { name: "Transfer", value: 0, fill: COLORS[1] },
        { name: "E-Wallet", value: 0, fill: COLORS[2] },
      ];

  const rentalChartData = rentalByMethod.length > 0
    ? rentalByMethod
    : [];

  const hasRentalData = rentalChartData.length > 0;

  const financeBarData = {
    labels: chartData.map((d) => d.name),
    datasets: [
      {
        label: "Finance Amount",
        data: chartData.map((d) => d.value),
        borderColor: chartData.map((d) => d.fill || COLORS[0]),
        backgroundColor: chartData.map((d) => {
          const c = d.fill || COLORS[0];
          return c + "1a";
        }),
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: chartData.map((d) => d.fill || COLORS[0]),
        pointBorderColor: "#fff",
        pointBorderWidth: 3,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const rentalBarData = {
    labels: rentalChartData.map((d) => d.name),
    datasets: [
      {
        label: "Rental Revenue",
        data: rentalChartData.map((d) => d.value),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 3,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barOptions = {
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
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { color: "#e2e8f0" },
        ticks: { color: "#94a3b8", font: { size: 12 } },
        border: { color: "#e2e8f0" },
      },
      y: {
        grid: { color: "#e2e8f0" },
        ticks: {
          color: "#94a3b8",
          font: { size: 12 },
          callback: (v: any) =>
            v >= 1000000
              ? `${(v / 1000000).toFixed(1)}M`
              : v >= 1000
                ? `${(v / 1000).toFixed(0)}K`
                : v.toString(),
        },
        border: { color: "#e2e8f0" },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-5">
      {/* Chart Section */}
      <Card className="xl:col-span-2 flex flex-col p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">
              Revenue Overview
            </h3>
            <span className="text-slate-500 dark:text-slate-400 text-sm">
              Amount received by payment method
            </span>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[280px]">
          <Line data={financeBarData} options={barOptions} />
        </div>

        {hasRentalData && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Rental Revenue by Payment Method
            </h4>
            <div className="flex-1 w-full min-h-[200px]">
              <Line data={rentalBarData} options={barOptions} />
            </div>
          </div>
        )}
      </Card>

      {/* Quick Actions Section */}
      <div className="xl:col-span-1 flex flex-col gap-4">
        <Card className="p-6 h-full">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-5">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
            <QuickAction
              icon="payments"
              title="Finance Entry"
              description="Record payment"
              variant="primary"
              onClick={() => router.push("/dashboard/finances/payment")}
            />
            <QuickAction
              icon="add_car"
              title="New Rental"
              description="Create rental contract"
              variant="amber"
              onClick={() => router.push("/dashboard/rentals/new")}
            />
            <QuickAction
              icon="person_add"
              title="Add Driver"
              description="Register new driver"
              variant="indigo"
              onClick={() => router.push("/dashboard/drivers/register")}
            />
            <QuickAction
              icon="local_taxi"
              title="Add Vehicle"
              description="Register new vehicle"
              variant="slate"
              onClick={() => router.push("/dashboard/vehicles/register")}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

"use client";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { QuickAction } from "./quick-action";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickFormatter={(v) =>
                  v >= 1000000
                    ? `${(v / 1000000).toFixed(1)}M`
                    : v >= 1000
                    ? `${(v / 1000).toFixed(0)}K`
                    : v.toString()
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [
                  `Rp ${(Number(value) || 0).toLocaleString("id-ID")}`,
                  "Amount",
                ]}
              />
              <Legend />
              <Bar
                dataKey="value"
                name="Finance Amount"
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              >
                {chartData.map((_, index) => (
                  <rect key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {hasRentalData && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Rental Revenue by Payment Method
            </h4>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={rentalChartData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickFormatter={(v) =>
                      v >= 1000000
                        ? `${(v / 1000000).toFixed(1)}M`
                        : v >= 1000
                        ? `${(v / 1000).toFixed(0)}K`
                        : v.toString()
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [
                      `Rp ${(Number(value) || 0).toLocaleString("id-ID")}`,
                      "Revenue",
                    ]}
                  />
                  <Bar
                    dataKey="value"
                    name="Rental Revenue"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={60}
                    fill="#10b981"
                  />
                </BarChart>
              </ResponsiveContainer>
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
              onClick={() => router.push("/dashboard/finance/payment")}
            />
            <QuickAction
              icon="add_car"
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
    </div>
  );
};

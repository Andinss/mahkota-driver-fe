import { VehicleStatsCard } from "@/components/vehicle/dashboard/vehicle-stats-card";
import { VehicleHealthChart } from "@/components/vehicle/dashboard/vehicle-health-chart";
import { MaintenanceTrendsChart } from "@/components/vehicle/dashboard/maintenance-trends-chart";
import { StatusUpdatesTimeline } from "@/components/vehicle/dashboard/status-updates-timeline";
import { RentalHistoryTable } from "@/components/vehicle/dashboard/rental-history-table";
import { Breadcrumbs } from "@/components/vehicle/management/breadcrumbs";

export default function DashboardVehiclePage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "#" },
            { label: "Vehicles", href: "/dashboard/vehicle" },
          ]}
        />
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <VehicleStatsCard
            title="Total Vehicles"
            value="124"
            icon="local_taxi"
            iconColor="text-primary"
            trend={{
              value: "+2% from last month",
              color: "text-green-600",
              icon: "trending_up",
            }}
          />
          <VehicleStatsCard
            title="Rented"
            value="85"
            icon="key"
            iconColor="text-blue-500"
            trend={{
              value: "+5% peak hours",
              color: "text-green-600",
              icon: "trending_up",
            }}
          />
          <VehicleStatsCard
            title="Available"
            value="22"
            icon="check_circle"
            iconColor="text-green-500"
            trend={{
              value: "-3% decrease",
              color: "text-red-600",
              icon: "trending_down",
            }}
          />
          <VehicleStatsCard
            title="Maintenance"
            value="12"
            icon="settings"
            iconColor="text-orange-500"
            trend={{
              value: "Stable status",
              color: "text-gray-500",
              icon: "equal",
            }}
          />
          <VehicleStatsCard
            title="Retrieved"
            value="5"
            icon="assignment_return"
            iconColor="text-purple-500"
            trend={{
              value: "Pending inspection",
              color: "text-green-600",
              icon: "history",
            }}
          />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <VehicleHealthChart />
          <MaintenanceTrendsChart />
        </section>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-1">
            <StatusUpdatesTimeline />
          </section>
          <section className="xl:col-span-2">
            <RentalHistoryTable />
          </section>
        </div>
      </div>
    </div>
  );
}

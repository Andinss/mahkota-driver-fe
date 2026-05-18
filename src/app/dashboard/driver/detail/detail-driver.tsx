"use client";

import { useState } from "react";
import {
  DriverHeader,
  DriverHeaderData,
} from "@/components/driver/detail/driver-header";
import { DriverStatsCard } from "@/components/driver/detail/driver-stats-card";
import {
  TabNavigation,
  TabValue,
} from "@/components/driver/detail/tab-navigation";
import {
  VehicleHistoryFilters,
  VehicleHistoryFilters as FilterType,
} from "@/components/driver/detail/vehicle-history-filters";
import { VehicleHistoryTable } from "@/components/driver/detail/vehicle-history-table";
import { VehicleHistoryPagination } from "@/components/driver/detail/vehicle-history-pagination";
import { VehicleHistory } from "@/components/driver/detail/vehicle-history-table-row";
import { DriverOverview } from "@/components/driver/detail/overview";

// Mock data
const mockDriver: DriverHeaderData = {
  name: "Marcus Wright",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD-qYfFL3In7JL4maoOxB8QqNbOANCIYNhsY-l1AGrUUadhZ0roktjb5ib4cNoakVh_oO__7Z4RZhjXwWeAzcra7WLVqKA8KiZ6Hyl_FqEE5p19pJCWIFFe-6P_hDEvf_LZnm0vUD03dfgzwIMZ0zZhy3YHHoX-gZ5gY90BD8zmSeBpJoQ6y0ivDnU6ckC0HAMrzAvJ2BVNqeSZVYnlBxyWLH8LzYWuXuRhMaAgU0M_pozCE96pLx3mDrVtr1TGEBz19KoRro9nKAo",
  employeeId: "MD-0042",
  totalTrips: 128,
  joinedDate: "Joined June 2023",
  status: "Active",
};

const mockVehicles: VehicleHistory[] = [
  {
    name: "Toyota Camry Hybrid",
    plateNumber: "B 1234 ABC",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCc9FSWkfM3spshnei9tUEoPe6HLeukSzhvhA3FzIwqC0QcA4IWzHDDWfgHeC1Dd7LEQmKfC71RVrq6iE8St-GS4AlQwE_oMR3WJW7xRC4yA8dJU7Ie1zbRZN57Yw-tpHj5VfROLu1GveQ0X2_YKGfFSjPCxupwGPeQZMCwlCIvxjC-yjlJ-OyM6_QSbkU5XWMU_n_Zte-2FDrlZsCiCOq_TRMdcjW0M5lxfhZM2AZCKWQ6O4lnsfGe4FGuubSdQLhfPVp_aTHyn9U",
    period: "Apr 2024 - Present",
    activeDuration: "2 months active",
    totalDistance: "4,250 km",
    fuelEfficiency: "18.5 km/L",
    fuelEfficiencyLabel: "Optimal",
    fuelEfficiencyColor: "text-emerald-500",
    maintenanceCount: 0,
    maintenanceIcon: "check_circle",
    maintenanceColor: "text-emerald-500",
    status: "Current",
  },
  {
    name: "Hiace Luxury",
    plateNumber: "B 7788 XYZ",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCc9FSWkfM3spshnei9tUEoPe6HLeukSzhvhA3FzIwqC0QcA4IWzHDDWfgHeC1Dd7LEQmKfC71RVrq6iE8St-GS4AlQwE_oMR3WJW7xRC4yA8dJU7Ie1zbRZN57Yw-tpHj5VfROLu1GveQ0X2_YKGfFSjPCxupwGPeQZMCwlCIvxjC-yjlJ-OyM6_QSbkU5XWMU_n_Zte-2FDrlZsCiCOq_TRMdcjW0M5lxfhZM2AZCKWQ6O4lnsfGe4FGuubSdQLhfPVp_aTHyn9U",
    period: "Jan 2024 - Mar 2024",
    activeDuration: "3 months active",
    totalDistance: "12,180 km",
    fuelEfficiency: "12.2 km/L",
    fuelEfficiencyLabel: "Moderate",
    fuelEfficiencyColor: "text-amber-500",
    maintenanceCount: 2,
    maintenanceIcon: "report_problem",
    maintenanceColor: "text-amber-500",
    status: "Previous",
  },
  {
    name: "Honda Civic RS",
    plateNumber: "B 3321 TUV",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCc9FSWkfM3spshnei9tUEoPe6HLeukSzhvhA3FzIwqC0QcA4IWzHDDWfgHeC1Dd7LEQmKfC71RVrq6iE8St-GS4AlQwE_oMR3WJW7xRC4yA8dJU7Ie1zbRZN57Yw-tpHj5VfROLu1GveQ0X2_YKGfFSjPCxupwGPeQZMCwlCIvxjC-yjlJ-OyM6_QSbkU5XWMU_n_Zte-2FDrlZsCiCOq_TRMdcjW0M5lxfhZM2AZCKWQ6O4lnsfGe4FGuubSdQLhfPVp_aTHyn9U",
    period: "Jun 2023 - Dec 2023",
    activeDuration: "6 months active",
    totalDistance: "28,500 km",
    fuelEfficiency: "14.8 km/L",
    fuelEfficiencyLabel: "Optimal",
    fuelEfficiencyColor: "text-emerald-500",
    maintenanceCount: 5,
    maintenanceIcon: "warning",
    maintenanceColor: "text-red-500",
    status: "Previous",
  },
];

const DriverDetailPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("overview");
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    status: "All Status",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

   // Filter vehicles based on search and status
  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch = filters.search === "" || 
      vehicle.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      vehicle.plateNumber.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === "All Status" || 
      vehicle.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalResults = filteredVehicles.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

   const handleExport = (options?: any) => {
    if (!options) return;
    console.log("Export options from driver detail:", options);
    alert(`Exporting vehicle history as ${options.format} with ${options.type} data`);
  };

  return (
    <div className="p-7">
      <DriverHeader driver={mockDriver} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <DriverStatsCard
          title="Performance Rating"
          value="4.8/5"
          icon="star"
          iconBgColor="bg-amber-50 dark:bg-amber-900/20"
          iconColor="text-amber-500"
          badge="+0.2 from last month"
          badgeColor="text-emerald-500"
        />
        <DriverStatsCard
          title="Total Earnings"
          value="$12,450.00"
          icon="payments"
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-500"
          badge="Total YTD"
          badgeColor="text-slate-400"
        />
        <DriverStatsCard
          title="License Validity"
          value="Sep 2026"
          icon="assignment_ind"
          iconBgColor="bg-emerald-50 dark:bg-emerald-900/20"
          iconColor="text-emerald-500"
          badge="Validated"
          badgeColor="text-emerald-500 italic"
        />
        <DriverStatsCard
          title="End date contract"
          value="Dec 2025"
          icon="event_available"
          iconBgColor="bg-red-50 dark:bg-red-900/20"
          iconColor="text-red-500"
          badge="18 Months left"
          badgeColor="text-slate-400"
        />
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && <DriverOverview />}

      {activeTab === "vehicle-history" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <VehicleHistoryFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            totalRows={totalResults}
          />
          <VehicleHistoryTable vehicles={currentVehicles} />
          <VehicleHistoryPagination
            totalVehicles={totalResults}
            currentPage={1}
          />
        </div>
      )}
    </div>
  );
};

export default DriverDetailPage;

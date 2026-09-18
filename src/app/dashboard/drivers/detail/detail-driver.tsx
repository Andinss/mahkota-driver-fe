"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { DepositHistoryList } from "@/components/driver/detail/deposit-history-list";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { driverApi } from "@/lib/api/driver";
import { rentalApi } from "@/lib/api/rentals";
import { financeApi } from "@/lib/api/finances";
import { HttpClientError } from "@/lib/api-http";
import type { DriverItem } from "@/lib/types/driver";
import type { RentalTransaction } from "@/lib/types/rentals";
import type { HistorySetoran } from "@/lib/types/history";
import type { FinanceItem } from "@/lib/types/finances";
import { toastError, toastInfo } from "@/components/ui/toast-provider";
import type { ExportOptions } from "@/components/ui/export";

const mapFinanceToHistory = (f: FinanceItem): HistorySetoran => ({
  id: f.id,
  payment_date: f.payment_date,
  reference_number: f.reference_number,
  payment_method: f.payment_method,
  amount_received: f.paid_amount ?? f.amount_received ?? 0,
  finance_type: f.finance_type ?? f.status ?? "pending",
  notes: f.notes || undefined,
  rental_number: f.rentals?.[0]?.rental_number,
});

const DetailDriverPage = () => {
  const searchParams = useSearchParams();
  const driverId = searchParams.get("id");

  const [driver, setDriver] = useState<DriverItem | null>(null);
  const [currentRental, setCurrentRental] = useState<RentalTransaction | null>(null);
  const [driverRentals, setDriverRentals] = useState<RentalTransaction[]>([]);
  const [depositHistory, setDepositHistory] = useState<HistorySetoran[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");
  const buildUrl = (path: string) => path ? (path.startsWith("http") ? path : `${imageBase}/${path.replace(/^\//, "")}`) : "";

  useEffect(() => {
    if (!driverId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const fetchDriver = async () => {
      try {
        const res = await driverApi.getById(driverId);
        const item = res.data ?? (res as unknown as DriverItem);
        if (item?.employee_id) {
          setDriver(item);
          return;
        }
      } catch (err) {
        const msg = err instanceof HttpClientError ? err.message : "Failed to load driver data.";
        toastError(msg);
        setDriver(null);
        return;
      }

      try {
        const res = await driverApi.getDetail(driverId);
        const item = res.data ?? (res as unknown as DriverItem);
        if (item?.employee_id) {
          setDriver(item);
        } else {
          setDriver(null);
          toastError("Driver data is empty or invalid.");
        }
      } catch (err) {
        const msg = err instanceof HttpClientError ? err.message : "Failed to load driver details.";
        toastError(msg);
        setDriver(null);
      }
    };

    const fetchRental = async () => {
      try {
        const res = await rentalApi.getList({ limit: 1000 });
        const rentals = res.data ?? [];
        const driverRentalsList = rentals
          .filter((r: RentalTransaction) => r.driver_id === driverId)
          .sort((a: RentalTransaction, b: RentalTransaction) => new Date(b.created_at || b.start_date).getTime() - new Date(a.created_at || a.start_date).getTime());

        setDriverRentals(driverRentalsList);

        if (driverRentalsList.length > 0) {
          setCurrentRental(driverRentalsList[0]);
        }
      } catch (err) {
        console.error("Failed to load rental data:", err);
      }
    };

    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await financeApi.getList({ driver_id: driverId, limit: 1000 });
        setDepositHistory(res.data.map(mapFinanceToHistory));
      } catch (err) {
        console.error("Failed to load deposit history:", err instanceof Error ? err.message : err);
        setDepositHistory([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchDriver().then(fetchRental).finally(() => setIsLoading(false));
    fetchHistory();
  }, [driverId]);

  const driverHeader: DriverHeaderData = driver ? {
    name: `${driver.first_name || ""} ${driver.last_name || ""}`.trim() || "-",
    imageUrl: buildUrl(driver.profile_photo || ""),
    employeeId: driver.employee_id || "-",
    totalTrips: 0,
    joinedDate: driver.created_at
      ? new Date(driver.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long" })
      : "-",
    status: "Active",
  } : {
    name: "-",
    imageUrl: "",
    employeeId: "-",
    totalTrips: 0,
    joinedDate: "-",
    status: "Active",
  };

  const [activeTab, setActiveTab] = useState<TabValue>("overview");
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    status: "All Status",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const vehicleHistoryList: VehicleHistory[] = driverRentals.map((r, index) => ({
    name: r.vehicle ? `${r.vehicle.merk} ${r.vehicle.model}` : "-",
    plateNumber: r.vehicle?.license_plate || "-",
    imageUrl: "",
    period: `${new Date(r.start_date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })} - ${new Date(r.end_date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}`,
    activeDuration: `${r.total_duration} days`,
    totalDistance: "-",
    fuelEfficiency: "-",
    fuelEfficiencyLabel: "",
    fuelEfficiencyColor: "text-slate-400",
    maintenanceCount: 0,
    maintenanceIcon: "build",
    maintenanceColor: "text-slate-400",
    status: index === 0 ? "Current" : "Previous",
  }));

  const filteredVehicles = vehicleHistoryList.filter((vehicle) => {
    const matchesSearch = filters.search === "" || 
      vehicle.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      vehicle.plateNumber.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === "All Status" || 
      vehicle.status.toLowerCase() === filters.status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalResults = filteredVehicles.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleExport = async (options?: ExportOptions) => {
    if (!options) return;
    const params: Record<string, string | number | undefined> = {
      format: options.format,
      columns: options.columns.join(","),
      type: options.type,
    };
    if (driverId) {
      params.driver_id = driverId;
    }
    if (options.type === "filtered") {
      if (options.dateRange?.start) params.start_date = options.dateRange.start;
      if (options.dateRange?.end) params.end_date = options.dateRange.end;
    }
    try {
      await rentalApi.exportData(params);
      toastInfo(`Exporting vehicle history as ${options.format}`);
    } catch (err) {
      const msg = err instanceof HttpClientError ? err.message : "Failed to export vehicle history.";
      toastError(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="p-7 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Loading driver details...</p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-7 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Driver not found</p>
      </div>
    );
  }

  return (
    <>
    <PermissionGuard permission="driver.read.all" fallbackPermission="driver.read.own">
    <div className="p-7">
      <DriverHeader driver={driverHeader} />

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
          value="Rp 12.450.000"
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

      {activeTab === "overview" && <DriverOverview driver={driver} buildUrl={buildUrl} rental={currentRental} />}

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

      {activeTab === "deposit-history" && (
        <div>
          {isLoadingHistory ? (
            <div className="py-20 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Loading deposit history...
            </div>
          ) : (
            <DepositHistoryList history={depositHistory} />
          )}
        </div>
      )}
    </div>
    </PermissionGuard>
    </>
  );
};

export default DetailDriverPage;
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  DriverHeader,
  DriverHeaderData,
} from "@/components/drivers/detail/driver-header";
import { DriverStatsCard } from "@/components/drivers/detail/driver-stats-card";
import {
  TabNavigation,
  TabValue,
} from "@/components/drivers/detail/tab-navigation";
import {
  VehicleHistoryList,
  type VehicleHistory,
} from "@/components/drivers/detail/vehicle-history-list";
import { DriverOverview } from "@/components/drivers/detail/overview";
import { SupervisorCard } from "@/components/drivers/detail/supervisor-card";
import { DepositHistoryList } from "@/components/drivers/detail/deposit-history-list";
import { KoinHistoryList } from "@/components/drivers/detail/koin-history-list";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { driverApi } from "@/lib/api/driver";
import { supervisorApi } from "@/lib/api/supervisor";
import { rentalApi } from "@/lib/api/rentals";
import { financeApi } from "@/lib/api/finances";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import type { DriverItem, DriverStats } from "@/lib/types/driver";
import type { RentalTransaction } from "@/lib/types/rentals";
import type { HistorySetoran } from "@/lib/types/history";
import type { FinanceItem } from "@/lib/types/finances";
import { toastError } from "@/components/ui/toast-provider";
import { getErrorMessage } from "@/lib/utils/error-message";

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

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const DetailDriverPage = () => {
  const searchParams = useSearchParams();
  const driverId = searchParams.get("id");
  const { user } = useAuth();
  // Supervisor hanya punya driver.read.own → pakai endpoint /supervisor/drivers.
  const isSupervisor =
    canAccess(user?.permissions, "driver.read.own") &&
    !canAccess(user?.permissions, "driver.read.all");
  const canAssignSupervisor = canAccess(
    user?.permissions,
    "driver.assign_supervisor",
  );

  const [driver, setDriver] = useState<DriverItem | null>(null);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [currentRental, setCurrentRental] = useState<RentalTransaction | null>(
    null,
  );
  const [driverRentals, setDriverRentals] = useState<RentalTransaction[]>([]);
  const [depositHistory, setDepositHistory] = useState<HistorySetoran[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageBase = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  ).replace(/\/api\/?$/, "");
  const buildUrl = (path: string) =>
    path
      ? path.startsWith("http")
        ? path
        : `${imageBase}/${path.replace(/^\//, "")}`
      : "";

  useEffect(() => {
    if (!driverId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const fetchDriver = async () => {
      if (isSupervisor) {
        try {
          const res = await supervisorApi.getById(driverId);
          const item = res.data;
          if (item?.employee_id) {
            setDriver(item);
          } else {
            setDriver(null);
            toastError("Data driver tidak ditemukan atau tidak lengkap.");
          }
        } catch (err) {
          const msg = getErrorMessage(
            err,
            "Gagal memuat data driver. Silakan coba lagi.",
          );
          toastError(msg);
          setDriver(null);
        }
        return;
      }

      try {
        const res = await driverApi.getById(driverId);
        const item = res.data ?? (res as unknown as DriverItem);
        if (item?.employee_id) {
          setDriver(item);
          return;
        }
      } catch (err) {
        const msg = getErrorMessage(
          err,
          "Gagal memuat data driver. Silakan coba lagi.",
        );
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
          toastError("Data driver tidak ditemukan atau tidak lengkap.");
        }
      } catch (err) {
        const msg = getErrorMessage(
          err,
          "Gagal memuat detail driver. Silakan coba lagi.",
        );
        toastError(msg);
        setDriver(null);
      }
    };

    const fetchStats = async () => {
      if (isSupervisor) {
        setStats(null);
        return;
      }
      try {
        const res = await driverApi.getStats(driverId);
        setStats(res.data ?? null);
      } catch (err) {
        console.error("Failed to load driver stats:", err);
        setStats(null);
      }
    };

    const fetchRental = async () => {
      try {
        const res = await rentalApi.getList({ limit: 1000 });
        const rentals = res.data ?? [];
        const driverRentalsList = rentals
          .filter((r: RentalTransaction) => r.driver_id === driverId)
          .sort(
            (a: RentalTransaction, b: RentalTransaction) =>
              new Date(b.created_at || b.start_date).getTime() -
              new Date(a.created_at || a.start_date).getTime(),
          );

        setDriverRentals(driverRentalsList);

        if (driverRentalsList.length > 0) {
          setCurrentRental(driverRentalsList[0]);
        }
      } catch (err) {
        console.error("Failed to load rental data:", err);
        setDriverRentals([]);
        toastError(getErrorMessage(err, "Gagal memuat riwayat sewa driver."));
      }
    };

    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await financeApi.getList({
          driver_id: driverId,
          limit: 1000,
        });
        setDepositHistory(res.data.map(mapFinanceToHistory));
      } catch (err) {
        console.error(
          "Failed to load deposit history:",
          err instanceof Error ? err.message : err,
        );
        setDepositHistory([]);
        toastError(
          getErrorMessage(err, "Gagal memuat riwayat setoran driver."),
        );
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchDriver()
      .then(fetchRental)
      .finally(() => setIsLoading(false));
    fetchStats();
    fetchHistory();
  }, [driverId, isSupervisor]);

  const driverHeader: DriverHeaderData = driver
    ? {
        name:
          `${driver.first_name || ""} ${driver.last_name || ""}`.trim() || "-",
        imageUrl: buildUrl(driver.profile_photo || ""),
        employeeId: driver.employee_id || "-",
        totalTrips: stats?.total_trips ?? 0,
        joinedDate: driver.created_at
          ? new Date(driver.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
            })
          : "-",
        status: driver.is_active !== false ? "Active" : "Inactive",
      }
    : {
        name: "-",
        imageUrl: "",
        employeeId: "-",
        totalTrips: 0,
        joinedDate: "-",
        status: "Active",
      };

  const [activeTab, setActiveTab] = useState<TabValue>("overview");

  const vehicleHistoryList: VehicleHistory[] = useMemo(
    () =>
      driverRentals.map((r) => ({
        id: r.id,
        vehicleId: r.vehicle_id || r.vehicle?.id || "",
        name: r.vehicle ? `${r.vehicle.merk} ${r.vehicle.model}` : "-",
        plateNumber: r.vehicle?.license_plate || "-",
        rentalNumber: r.rental_number || "-",
        period: `${new Date(r.start_date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })} - ${new Date(r.end_date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}`,
        totalDuration: r.total_duration || 0,
        dailyRate: r.daily_rate || 0,
        rentalDuration: r.rental_duration || "-",
        rentalService: r.rental_service || "-",
        vendorName: r.vehicle?.vendor?.name || "-",
        createdAt: r.created_at || "",
        documentContract: r.document_contract || undefined,
        status:
          new Date(r.end_date) > new Date()
            ? ("Current" as const)
            : ("Previous" as const),
      })),
    [driverRentals],
  );

  // Persentase keterlambatan sebagai "rate" (izin telat approved / total izin).
  const lateRateText = (() => {
    if (!stats || stats.late_payment_count === 0) return "0";
    return `${stats.late_payment_approved}`;
  })();

  if (isLoading) {
    return (
      <div className="p-7 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Memuat detail driver...</p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-7 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Driver tidak ditemukan</p>
      </div>
    );
  }

  return (
    <>
      <PermissionGuard
        permission="driver.read.all"
        fallbackPermission="driver.read.own"
      >
        <div className="p-7">
          <DriverHeader driver={driverHeader} />

          <SupervisorCard
            driver={driver}
            canAssign={canAssignSupervisor}
            onChanged={(updated) => setDriver(updated)}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Perjalanan */}
            <DriverStatsCard
              title="Total Perjalanan"
              value={stats ? String(stats.total_trips) : "—"}
              icon="route"
              iconBgColor="bg-emerald-50 dark:bg-emerald-900/20"
              iconColor="text-emerald-500"
              badge={
                stats
                  ? stats.active_trips > 0
                    ? `${stats.active_trips} aktif`
                    : "Tidak ada yang aktif"
                  : undefined
              }
              badgeColor="text-emerald-500"
            />

            {/* Total Pendapatan */}
            <DriverStatsCard
              title="Total Pendapatan"
              value={stats ? formatRupiah(stats.total_earnings) : "—"}
              icon="payments"
              iconBgColor="bg-blue-50 dark:bg-blue-900/20"
              iconColor="text-blue-500"
              badge="Sejak bergabung"
              badgeColor="text-slate-400"
            />

            {/* Saldo Koin */}
            <DriverStatsCard
              title="Saldo Koin"
              value={stats ? formatRupiah(stats.koin_balance) : "—"}
              icon="account_balance_wallet"
              iconBgColor="bg-amber-50 dark:bg-amber-900/20"
              iconColor="text-amber-500"
              badge={stats ? "Saldo saat ini" : undefined}
              badgeColor="text-slate-400"
            />

            {/* Izin Telat */}
            <DriverStatsCard
              title="Izin Telat"
              value={stats ? lateRateText : "—"}
              icon="schedule"
              iconBgColor="bg-rose-50 dark:bg-rose-900/20"
              iconColor="text-rose-500"
              badge={
                stats
                  ? stats.late_payment_pending > 0
                    ? `${stats.late_payment_pending} menunggu`
                    : `${stats.late_payment_count} total`
                  : undefined
              }
              badgeColor={
                stats && stats.late_payment_pending > 0
                  ? "text-amber-500"
                  : "text-slate-400"
              }
            />
          </div>

          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "overview" && (
            <DriverOverview
              driver={driver}
              buildUrl={buildUrl}
              rental={currentRental}
            />
          )}

          {activeTab === "vehicle-history" && (
            <VehicleHistoryList vehicles={vehicleHistoryList} />
          )}

          {activeTab === "deposit-history" && (
            <div>
              {isLoadingHistory ? (
                <div className="py-20 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  Memuat riwayat pembayaran harian...
                </div>
              ) : (
                <DepositHistoryList history={depositHistory} />
              )}
            </div>
          )}

          {activeTab === "koin-history" && driverId && (
            <KoinHistoryList driverId={driverId} />
          )}
        </div>
      </PermissionGuard>
    </>
  );
};

export default DetailDriverPage;

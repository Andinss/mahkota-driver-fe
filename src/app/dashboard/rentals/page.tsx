"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  confirmToast,
  toastSuccess,
  toastError,
} from "@/components/ui/toast-provider";
import { PageHeader } from "@/components/page-header";
import { RentalCard } from "@/components/rent/dashboard/card";
import { FiltersSearch } from "@/components/rent/dashboard/filters-search";
import { RentalTable } from "@/components/rent/dashboard/rent-table";
import { Pagination } from "@/components/ui/pagination";
import { ExportOptions } from "@/components/ui/export";
import { useSearchParams } from "next/navigation";
import { rentalApi } from "@/lib/api/rentals";
import { HttpClientError } from "@/lib/api-http";
import type { RentalTransaction, RentalSummary } from "@/lib/types/rentals";
import { useAuth } from "@/lib/auth-context";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { canAccess } from "@/lib/can-access";

interface RentalDisplay {
  id: string;
  transactionId: string;
  driver: { name: string; id: string; avatar?: string };
  vehicle: { name: string; id: string };
  vehicleId?: string;
  vehicleEngineStatus?: "on" | "off";
  rentalPeriod: { start: string; end: string; duration: number };
  rentalDuration?: string;
  rentalService?: string;
}

const imageBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

const buildPhotoUrl = (path?: string) =>
  path
    ? path.startsWith("http")
      ? path
      : `${imageBase}/${path.replace(/^\//, "")}`
    : "";

const formatDateShort = (d?: string) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const mapToDisplay = (item: RentalTransaction): RentalDisplay => ({
  id: item.id,
  transactionId: item.rental_number || `#${item.id?.slice(0, 8).toUpperCase()}`,
  driver: {
    name: item.driver
      ? `${item.driver.first_name} ${item.driver.last_name}`
      : "-",
    id: item.driver?.employee_id || item.driver_id?.slice(0, 8) || "-",
    avatar: buildPhotoUrl(item.driver?.profile_photo) || undefined,
  },
  vehicle: {
    name: item.vehicle ? `${item.vehicle.merk} ${item.vehicle.model}` : "-",
    id: item.vehicle?.license_plate || item.vehicle_id?.slice(0, 8) || "-",
  },
  vehicleId: item.vehicle_id,
  vehicleEngineStatus: item.vehicle?.engine_status === "on" ? "on" : "off",
  rentalPeriod: {
    start: formatDateShort(item.start_date),
    end: formatDateShort(item.end_date),
    duration: item.total_duration || 0,
  },
  rentalDuration: item.rental_duration,
  rentalService: item.rental_service,
});

export default function RentalManagementPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const handleExport = async (options?: ExportOptions) => {
    if (!options) return;
    const params: Record<string, string | number | undefined> = {
      format: options.format,
      columns: options.columns.join(","),
      type: options.type,
    };
    if (options.type === "filtered") {
      if (options.dateRange?.start) params.start_date = options.dateRange.start;
      if (options.dateRange?.end) params.end_date = options.dateRange.end;
    }
    await rentalApi.exportData(params);
  };

  // Data state
  const [rentals, setRentals] = useState<RentalDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<RentalSummary | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [rentalDuration, setRentalDuration] = useState("");
  const [rentalService, setRentalService] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const toastShownRef = useRef(false);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await rentalApi.getSummary();
      setSummary(res.data);
    } catch {
      // non-critical
    }
  }, []);

  // Tampilkan alert jika ada succes param di url
  useEffect(() => {
    const success = searchParams.get("success");
    const rent = searchParams.get("rent");

    if (success && rent && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Update" : "Registration";
      toastSuccess(
        `${action} Successful: Rent ${decodeURIComponent(rent)} has been ${success} successfully.`,
      );

      // Hapus query params dari URL agar alert tidak muncul lagi saat refresh
      window.history.replaceState({}, "", "/dashboard/rentals");
    }
  }, [searchParams]);

  const fetchRentals = useCallback(async () => {
    if (!canAccess(user?.permissions, "rental.read")) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await rentalApi.getList({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        rental_duration: rentalDuration || undefined,
        rental_service: rentalService || undefined,
      });
      const items = Array.isArray(res.data) ? res.data : [];
      const mapped = items.map(mapToDisplay);
      setRentals(mapped);
      if (res.meta) {
        setTotalResults(res.meta.total);
        setTotalPages(res.meta.totalPages);
      } else {
        setTotalResults(mapped.length);
        setTotalPages(1);
      }
    } catch {
      setRentals([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, user, debouncedSearch, rentalDuration, rentalService]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handler Delete
  const handleDeleteClick = async (rental: RentalDisplay) => {
    const confirmed = await confirmToast({
      title: "Delete Rental",
      message: `Are you sure you want to delete ${rental.transactionId}? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      variant: "danger",
    });
    if (confirmed) {
      try {
        await rentalApi.delete(rental.id);
        toastSuccess(
          `Rent ${rental.transactionId} has been deleted successfully`,
        );
        fetchRentals();
        fetchSummary();
      } catch (err) {
        toastError(
          err instanceof HttpClientError
            ? err.message
            : "Failed to delete rental. Please try again.",
        );
      }
    }
  };

  return (
    <PermissionGuard permission="rental.read">
      <div className="p-8 space-y-8">
        <PageHeader
          title="Rentals List Overview"
          description="Monitor active rentals, handle pending and late payments, and review daily completed transactions."
          buttonText={
            canAccess(user?.permissions, "rental.create")
              ? "Add New Rentals"
              : undefined
          }
          buttonHref={
            canAccess(user?.permissions, "rental.create")
              ? "/dashboard/rentals/new"
              : undefined
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RentalCard
            title="Total Rentals"
            value={(summary?.total_rentals ?? rentals.length).toString()}
            icon="key"
            iconColor="text-primary"
            trend={{
              value: summary
                ? "Seluruh transaksi sewa"
                : "Viewing current page",
              color: "text-green-600",
              icon: "trending_up",
            }}
          />

          <RentalCard
            title="Rata-Rata Harian"
            value={
              summary
                ? `Rp ${Math.round(summary.avg_daily_rate).toLocaleString("id-ID")}`
                : "-"
            }
            icon="payments"
            iconColor="text-emerald-600"
            trend={{
              value: "Berdasarkan semua data sewa",
              color: "text-emerald-600",
              icon: "trending_up",
            }}
          />

          <RentalCard
            title="Lepas Kunci"
            value={(summary
              ? summary.lepas_kunci
              : rentals.filter((r) => r.rentalService === "lepas kunci").length
            ).toString()}
            icon="no_crash"
            iconColor="text-blue-600"
            trend={{
              value: "Rental tanpa supir",
              color: "text-blue-600",
              icon: "info",
            }}
          />

          <RentalCard
            title="Pakai Supir"
            value={(summary
              ? summary.pakai_supir
              : rentals.filter((r) => r.rentalService === "pakai supir").length
            ).toString()}
            icon="person"
            iconColor="text-purple-600"
            trend={{
              value: "Rental dengan supir",
              color: "text-purple-600",
              icon: "info",
            }}
          />
        </div>

        <FiltersSearch
          searchValue={searchValue}
          rentalDuration={rentalDuration}
          rentalService={rentalService}
          onSearchChange={(v) => setSearchValue(v)}
          onRentalDurationChange={(v) => {
            setRentalDuration(v);
            setCurrentPage(1);
          }}
          onRentalServiceChange={(v) => {
            setRentalService(v);
            setCurrentPage(1);
          }}
        />

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              Loading rentals...
            </div>
          ) : (
            <>
              <RentalTable
                rentals={rentals}
                onExport={handleExport}
                onDelete={handleDeleteClick}
              />
              <div className="border-t border-slate-200 dark:border-slate-800">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={totalResults}
                  resultsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onPageSizeChange={(size) => {
                    setItemsPerPage(size);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </PermissionGuard>
  );
}

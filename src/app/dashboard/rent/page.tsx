"use client";

import { useEffect, useState, useCallback } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { RentalCard } from "@/components/rent/dashboard/card";
import { FiltersSearch } from "@/components/rent/dashboard/filters-search";
import { RentPagination } from "@/components/rent/dashboard/rent-pagination";
import { RentalTable } from "@/components/rent/dashboard/rent-table";
import { ExportOptions } from "@/components/ui/export";
import { AlertDialog } from "@/components/ui/alert";
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
  deposit: string;
  paymentStatus: string;
  methodPayment?: string;
  saldoDeducted?: number;
  rentalDuration?: string;
  rentalService?: string;
}

const imageBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");

const buildPhotoUrl = (path?: string) =>
  path
    ? path.startsWith("http") ? path : `${imageBase}/${path.replace(/^\//, "")}`
    : "";

const formatDateShort = (d?: string) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const mapToDisplay = (item: RentalTransaction): RentalDisplay => ({
  id: item.id,
  transactionId: item.rental_number || `#${item.id?.slice(0, 8).toUpperCase()}`,
  driver: {
    name: item.driver ? `${item.driver.first_name} ${item.driver.last_name}` : "-",
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
  deposit: item.deposit_amount > 0 ? `Rp ${Number(item.deposit_amount).toLocaleString("id-ID")}` : "Rp 0",
  paymentStatus: item.payment_status || "unpaid",
  methodPayment: item.method_payment,
  saldoDeducted: Number(item.saldo_deducted) || 0,
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
  // State Confirm dialog Delete
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<RentalDisplay | null>(null);

  const  [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const  [alertMessage, setAlertMessage] = useState("");
  const  [alertType, setAlertType] = useState<"success" | "error">("success");

  // Data state
  const [rentals, setRentals] = useState<RentalDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<RentalSummary | null>(null);
  const itemsPerPage = 10;

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

    if (success && rent) {
      const action = success === "updated" ? "Update" : "Registration";
      setAlertTitle(`${action} Successful`);
      setAlertMessage(`Rent ${decodeURIComponent(rent)} has been ${success} successfully.`);
      setAlertType("success");
      setIsAlertOpen(true);

      // Hapus query params dari URL agar alert tidak muncul lagi saat refresh
      window.history.replaceState({}, "", "/dashboard/rent");
    }

  }, [searchParams]);

  const fetchRentals = useCallback(async () => {
    if (!canAccess(user?.permissions, 'rental.read')) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await rentalApi.getList({ page: currentPage, limit: itemsPerPage });
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
  }, [currentPage, user]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const activeRentals = summary?.total_rentals ?? rentals.filter(
    (r) => r.paymentStatus === "paid",
  ).length;
  const pendingPayments = summary ? 0 : rentals.filter(
    (r) => r.paymentStatus === "partial" || r.paymentStatus === "unpaid",
  ).length;
  const latePayments = summary ? 0 : rentals.filter(
    (r) => r.paymentStatus === "late",
  ).length;
  const completedToday = summary ? 0 : rentals.filter(
    (r) => r.rentalPeriod.end === new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  ).length;

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

  const handleStatusChange = async (rental: RentalDisplay, status: string) => {
    try {
      await rentalApi.updatePaymentStatus(rental.id, status);
      setAlertTitle("Payment Status Updated");
      setAlertMessage(`Payment status for ${rental.transactionId} changed to ${status.replace(/_/g, " ")}.`);
      setAlertType("success");
      setIsAlertOpen(true);
      fetchRentals();
    } catch (err) {
      setAlertTitle("Update Failed");
      setAlertMessage(err instanceof HttpClientError ? err.message : "Failed to update payment status. Please try again.");
      setAlertType("error");
      setIsAlertOpen(true);
    }
  };

// Handler Delete
   const handleDeleteClick = (rental: RentalDisplay) => {
    setSelectedRental(rental);
    setIsConfirmDeleteOpen(true);
  };

   const handleConfirmDelete = async () => {
    if (!selectedRental) return;
    try {
      await rentalApi.delete(selectedRental.id);
      setIsConfirmDeleteOpen(false);
      setAlertTitle("Delete Successful");
      setAlertMessage(`Rent ${selectedRental?.transactionId} has been deleted successfully`);
      setAlertType("success");
      setIsAlertOpen(true);
      setSelectedRental(null);
      fetchRentals();
      fetchSummary();
    } catch (err) {
      setIsConfirmDeleteOpen(false);
      setAlertTitle("Delete Failed");
      setAlertMessage(err instanceof HttpClientError ? err.message : "Failed to delete rental. Please try again.");
      setAlertType("error");
      setIsAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  }


  return (
    <PermissionGuard permission="rental.read">
    <div className="p-8 space-y-8">
      <PageHeader
        title="Rentals List Overview"
        description="Monitor active rentals, handle pending and late payments, and review daily completed transactions."
        buttonText={canAccess(user?.permissions, "rental.create") ? "Add New Rentals" : undefined}
        buttonHref={canAccess(user?.permissions, "rental.create") ? "/dashboard/rent/new" : undefined}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RentalCard
          title="Total Rentals"
          value={(summary?.total_rentals ?? rentals.length).toString()}
          icon="key"
          iconColor="text-primary"
          trend={{
            value: summary ? `Revenue: Rp ${(summary.total_revenue / 1000000).toFixed(1)}M` : "Viewing current page",
            color: "text-green-600",
            icon: "trending_up",
          }}
        />

        <RentalCard
          title="Total Revenue"
          value={`Rp ${(summary?.total_revenue ?? 0).toLocaleString("id-ID")}`}
          icon="payments"
          iconColor="text-emerald-600"
          trend={{
            value: summary ? `Avg rate: Rp ${Math.round(summary.avg_daily_rate).toLocaleString("id-ID")}/day` : "-",
            color: "text-emerald-600",
            icon: "trending_up",
          }}
        />

        <RentalCard
          title="Total Deposit"
          value={`Rp ${(summary?.total_deposit_amount ?? 0).toLocaleString("id-ID")}`}
          icon="account_balance"
          iconColor="text-blue-600"
          trend={{
            value: summary ? `Service fee: Rp ${(summary.total_service_fee / 1000000).toFixed(1)}M` : "-",
            color: "text-blue-600",
            icon: "info",
          }}
        />

        <RentalCard
          title="Security Deposit"
          value={`Rp ${(summary?.total_deposit ?? 0).toLocaleString("id-ID")}`}
          icon="verified"
          iconColor="text-amber-600"
          trend={{
            value: summary ? `${summary.amount_by_method?.Bank ? 'Bank: Rp' + (summary.amount_by_method.Bank / 1000000).toFixed(1) + 'M' : ''}` : "-",
            color: "text-amber-600",
            icon: "info",
          }}
        />
      </div>

      <FiltersSearch />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading rentals...</div>
        ) : (
          <>
            <RentalTable
              rentals={rentals}
              onExport={handleExport}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
            />
            <div className="border-t border-slate-200 dark:border-slate-800">
              <RentPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                resultsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>

          {/* Confirm dialog delete */}
          <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Rental"
        message={`Are you sure you want to delete ${selectedRental?.transactionId}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        confirmText="OK"
      />

    </div>
    </PermissionGuard>
  );
}

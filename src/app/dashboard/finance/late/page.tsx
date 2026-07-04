"use client";

import { CardDriver } from "@/components/finance/late-payment/card-driver";
import { StatsCard } from "@/components/finance/late-payment/card-stats";
import { AlertDialog } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { rentalApi } from "@/lib/api/rentals";
import React, { useState, useEffect, useCallback } from "react";

function formatTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHrs < 24) return `${diffHrs} hrs ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function formatCurrency(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

interface LateRentalItem {
  id: string;
  rental_number: string;
  driver_id: string;
  driver_name: string;
  driver_photo: string;
  vehicle_name: string;
  plate: string;
  end_date: string;
  total_revenue: number;
  days_late: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function LatePaymentPage() {
  const [rentals, setRentals] = useState<LateRentalItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rentalApi.getList({ limit: 1000 });
      const items = Array.isArray(res.data) ? res.data : [];
      const now = new Date();
      const late = items
        .filter((r) => r.payment_status === "late")
        .map((r) => ({
          id: r.id,
          rental_number: r.rental_number || r.id.slice(0, 8).toUpperCase(),
          driver_id: r.driver_id,
          driver_name: r.driver ? `${r.driver.first_name} ${r.driver.last_name}` : "-",
          driver_photo: r.driver?.profile_photo || "",
          vehicle_name: r.vehicle
            ? `${r.vehicle.merk} ${r.vehicle.model}`
            : "-",
          plate: r.vehicle?.license_plate || "-",
          end_date: r.end_date,
          total_revenue: Number(r.total_revenue),
          days_late: Math.max(
            0,
            Math.floor(
              (now.getTime() - new Date(r.end_date).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          ),
        }));
      setRentals(late);
    } catch {
      setRentals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (rentals.length > 0 && !selectedId) {
      setSelectedId(rentals[0].id);
    }
  }, [rentals, selectedId]);

  const currentItem =
    rentals.find((r) => r.id === selectedId) || rentals[0];

  const handleMarkPaid = async () => {
    if (!currentItem) return;
    try {
      await rentalApi.updatePaymentStatus(currentItem.id, "paid");
      setAlertTitle("Berhasil");
      setAlertMessage(`${currentItem.rental_number} berhasil ditandai Lunas.`);
      setAlertType("success");
      setIsAlertOpen(true);
      setSelectedId("");
      fetchData();
    } catch {
      setAlertTitle("Gagal");
      setAlertMessage("Gagal memperbarui status pembayaran.");
      setAlertType("error");
      setIsAlertOpen(true);
    }
  };

  const totalLate = rentals.length;
  const totalAmount = rentals.reduce((s, r) => s + Number(r.total_revenue), 0);
  const avgDaysLate = totalLate > 0 ? Math.round(rentals.reduce((s, r) => s + r.days_late, 0) / totalLate) : 0;

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Total Late Payments"
          value={String(totalLate)}
          icon="warning"
          iconColor="text-red-600"
          trend={{
            icon: "arrow_upward",
            value: `${totalLate} rental(s)`,
            trendColor: "text-red-700",
            bgColor: "bg-red-100 dark:bg-red-900/30",
          }}
        />
        <StatsCard
          title="Total Outstanding"
          value={formatCurrency(totalAmount)}
          icon="payments"
          iconColor="text-amber-600"
          trend={{
            icon: "info",
            value: "Belum dibayar",
            trendColor: "text-amber-700",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          }}
        />
        <StatsCard
          title="Rata-rata Keterlambatan"
          value={`${avgDaysLate} hari`}
          icon="schedule"
          iconColor="text-blue-600"
          trend={{
            icon: "calendar_today",
            value: `${totalLate} transaksi`,
            trendColor: "text-blue-700",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
          }}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-320px)] min-h-[600px]">
        <div className="w-full lg:w-4/12 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
          {loading ? (
            <div className="text-center text-slate-400 py-8">Loading...</div>
          ) : rentals.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              No late payments found.
            </div>
          ) : (
            rentals.map((rental) => (
              <CardDriver
                key={rental.id}
                id={rental.driver_id}
                name={rental.driver_name}
                imageUrl={rental.driver_photo}
                amount={formatCurrency(rental.total_revenue)}
                time={formatTime(rental.end_date)}
                status="Late"
                isSelected={selectedId === rental.id}
                onClick={() => setSelectedId(rental.id)}
              />
            ))
          )}
        </div>

        {currentItem ? (
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-500">
                  {currentItem.driver_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {currentItem.driver_name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    ID: {currentItem.driver_id.slice(0, 8)}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                Late Payment
              </span>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    receipt_long
                  </span>
                  Rental Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight mb-1">
                      Vehicle
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {currentItem.vehicle_name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {currentItem.plate}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight mb-1">
                      Rental #
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {currentItem.rental_number}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 uppercase font-bold tracking-tight mb-1">
                      Due Date
                    </p>
                    <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                      {formatDate(currentItem.end_date)}
                    </p>
                    <p className="text-[11px] text-rose-500 font-medium">
                      {currentItem.days_late} day
                      {currentItem.days_late > 1 ? "s" : ""} late
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-[11px] text-primary uppercase font-bold tracking-tight mb-1">
                      Total Amount
                    </p>
                    <p className="text-lg font-black text-primary">
                      {formatCurrency(currentItem.total_revenue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end gap-3">
              <Button icon="check" onClick={handleMarkPaid}>
                Mark as Paid
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-400">
            Select a driver to view details
          </div>
        )}
      </div>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        confirmText="OK"
        autoCloseDelay={3000}
      />
    </div>
  );
}

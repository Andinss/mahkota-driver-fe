"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { DriverOutOfTownCard } from "@/components/driver/out-of-town/driver-out-of-town-card";
import { DriverOutOfTownForm } from "@/components/driver/out-of-town/driver-out-of-town-form";
import type { OutOfTownRequest } from "@/components/monitoring/out-of-town/out-of-town-table-row";
import { useAuth } from "@/lib/auth-context";
import { outOfTownApi } from "@/lib/api/out-of-town";
import type { OutOfTownItem, OutOfTownStats } from "@/lib/types/out-of-town";
import { toastError } from "@/components/ui/toast-provider";
import { formatDateOnly, formatDateTime } from "@/lib/utils/format";

/** Ubah data backend (snake_case) ke bentuk tampilan komponen. */
const toView = (item: OutOfTownItem): OutOfTownRequest => ({
  id: item.id,
  driverName: item.driver_name || "-",
  driverPhone: item.driver_phone || "-",
  vehiclePlate: item.vehicle_plate || "-",
  vehicleName: item.vehicle_name || "-",
  destination: item.destination,
  departureDate: formatDateOnly(item.departure_date),
  returnDate: formatDateOnly(item.return_date),
  reason: item.reason || "-",
  status: item.status,
  submittedAt: formatDateTime(item.created_at),
});

export default function DriverOutOfTownPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<OutOfTownRequest[]>([]);
  const [stats, setStats] = useState<OutOfTownStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.driver_id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        outOfTownApi.listMine(),
        outOfTownApi.stats(),
      ]);
      setRequests((listRes?.data || []).map(toView));
      if (statsRes?.data) setStats(statsRes.data);
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Gagal memuat pengajuan",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.driver_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        !search ||
        r.destination.toLowerCase().includes(search.toLowerCase()) ||
        r.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
        r.vehiclePlate.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const handleSubmit = () => {
    fetchData();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Custom Header */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#111418] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Pengajuan Luar Kota
            </h1>
            <p className="text-[#617589] dark:text-[#94a3b8] text-base font-normal">
              Ajukan izin perjalanan armada Anda dan pantau status
              persetujuannya.
            </p>
          </div>
          <Button icon="add" onClick={() => setIsFormOpen(true)}>
            Ajukan Baru
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 dark:bg-amber-900/20">
                <span className="material-symbols-outlined text-2xl text-amber-500">
                  schedule
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.pending}
                </p>
                <p className="text-xs text-slate-400 font-medium">Menunggu</p>
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-900/20">
                <span className="material-symbols-outlined text-2xl text-emerald-500">
                  check_circle
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.approved}
                </p>
                <p className="text-xs text-slate-400 font-medium">Disetujui</p>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-rose-50 dark:bg-rose-900/20">
                <span className="material-symbols-outlined text-2xl text-rose-500">
                  cancel
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.rejected}
                </p>
                <p className="text-xs text-slate-400 font-medium">Ditolak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchInput
              className="flex-1"
              placeholder="Cari tujuan atau kendaraan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-3">
              <Select
                id="filter-status"
                label=""
                className="min-w-[160px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </Select>
            </div>
          </div>
        </div>

        {/* List Pengajuan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) => (
            <DriverOutOfTownCard key={req.id} request={req} />
          ))}
          {filteredRequests.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span
                className={`material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 ${
                  isLoading ? "animate-spin" : ""
                }`}
              >
                {isLoading ? "hourglass_empty" : "search_off"}
              </span>
              <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                {isLoading
                  ? "Memuat pengajuan..."
                  : "Tidak ada pengajuan ditemukan"}
              </p>
              {!isLoading && (
                <p className="text-sm text-slate-400">
                  Coba ubah kata kunci atau filter Anda
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      <DriverOutOfTownForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

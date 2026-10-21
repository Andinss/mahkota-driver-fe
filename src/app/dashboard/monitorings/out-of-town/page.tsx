"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { Pagination } from "@/components/ui/pagination";
import { OutOfTownFilters } from "@/components/monitoring/out-of-town/out-of-town-filters";
import { OutOfTownTable } from "@/components/monitoring/out-of-town/out-of-town-table";
import { OutOfTownDetailModal } from "@/components/monitoring/out-of-town/out-of-town-detail-modal";
import type { OutOfTownRequest } from "@/components/monitoring/out-of-town/out-of-town-table-row";
import { outOfTownApi } from "@/lib/api/out-of-town";
import type { OutOfTownItem, OutOfTownStats } from "@/lib/types/out-of-town";
import { outOfTownKeys } from "@/lib/query-keys";
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
  adminNote: item.admin_note,
  feeAmount: item.fee_amount ? Number(item.fee_amount) : null,
});

export default function OutOfTownPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRequest, setSelectedRequest] =
    useState<OutOfTownRequest | null>(null);

  const listQuery = useQuery({
    queryKey: outOfTownKeys.list(),
    queryFn: async () => {
      const res = await outOfTownApi.list();
      const items: OutOfTownItem[] = Array.isArray(res?.data) ? res.data : [];
      return items.map(toView);
    },
  });

  const statsQuery = useQuery({
    queryKey: outOfTownKeys.stats(),
    queryFn: async () => {
      const res = await outOfTownApi.stats();
      return res?.data;
    },
  });

  const requests: OutOfTownRequest[] = useMemo(
    () => listQuery.data ?? [],
    [listQuery.data],
  );
  const stats: OutOfTownStats = statsQuery.data ?? {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  };
  const isLoading = listQuery.isLoading;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      const matchesStatus = !statusFilter || r.status === statusFilter;
      const matchesSearch =
        !q ||
        r.driverName.toLowerCase().includes(q) ||
        r.vehiclePlate.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [requests, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleStatusChange = () => {
    queryClient.invalidateQueries({ queryKey: outOfTownKeys.all });
  };

  return (
    <PermissionGuard permission="monitoring.read">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
          <PageHeader
            title="Pengajuan Keluar Wilayah"
            description="Kelola pengajuan driver untuk keluar wilayah operasional."
          />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                key: "pending",
                label: "Pending",
                value: stats.pending,
                icon: "schedule",
                iconBg: "bg-amber-50 dark:bg-amber-900/20",
                iconColor: "text-amber-500",
              },
              {
                key: "approved",
                label: "Approved",
                value: stats.approved,
                icon: "check_circle",
                iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
                iconColor: "text-emerald-500",
              },
              {
                key: "rejected",
                label: "Rejected",
                value: stats.rejected,
                icon: "cancel",
                iconBg: "bg-rose-50 dark:bg-rose-900/20",
                iconColor: "text-rose-500",
              },
            ].map((s) => (
              <div
                key={s.key}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${s.iconColor}`}
                    >
                      {s.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {s.value}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {s.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <OutOfTownFilters
            searchValue={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            statusValue={statusFilter}
            onStatusChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          />

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block animate-spin">
                  hourglass_empty
                </span>
                <p className="text-slate-400 text-sm font-medium">
                  Memuat pengajuan...
                </p>
              </div>
            ) : (
              <>
                <OutOfTownTable
                  requests={paged}
                  onSelect={setSelectedRequest}
                  totalCount={requests.length}
                  onResetFilter={() => {
                    setSearch("");
                    setStatusFilter("");
                    setPage(1);
                  }}
                />
                {filtered.length > 0 && (
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    totalResults={filtered.length}
                    resultsPerPage={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setPage(1);
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal Detail */}
        <OutOfTownDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusChange={handleStatusChange}
        />
      </div>
    </PermissionGuard>
  );
}

"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { Pagination } from "@/components/ui/pagination";
import { OutOfTownFilters } from "@/components/monitoring/out-of-town/out-of-town-filters";
import { OutOfTownTable } from "@/components/monitoring/out-of-town/out-of-town-table";
import { OutOfTownDetailModal } from "@/components/monitoring/out-of-town/out-of-town-detail-modal";
import type {
  OutOfTownRequest,
  OutOfTownStatus,
} from "@/components/monitoring/out-of-town/out-of-town-table-row";

/* Dummy data */
const dummyRequests: OutOfTownRequest[] = [
  {
    id: "1",
    driverName: "Rina Wulandari",
    driverPhone: "0812-3456-7890",
    vehiclePlate: "B 1234 XYZ",
    vehicleName: "Toyota Avanza",
    destination: "Bandung",
    departureDate: "25 Okt 2026",
    returnDate: "28 Okt 2026",
    reason: "Mengantar customer ke Bandung",
    status: "pending",
    submittedAt: "23 Okt 2026, 09:15",
  },
  {
    id: "2",
    driverName: "Budi Santoso",
    driverPhone: "0813-9876-5432",
    vehiclePlate: "D 5678 ABC",
    vehicleName: "Honda Brio",
    destination: "Surabaya",
    departureDate: "26 Okt 2026",
    returnDate: "30 Okt 2026",
    reason: "Perjalanan dinas",
    status: "approved",
    submittedAt: "22 Okt 2026, 14:30",
  },
  {
    id: "3",
    driverName: "Dini Andini",
    driverPhone: "0857-1234-5678",
    vehiclePlate: "F 9012 DEF",
    vehicleName: "Mitsubishi Xpander",
    destination: "Yogyakarta",
    departureDate: "27 Okt 2026",
    returnDate: "29 Okt 2026",
    reason: "Acara keluarga",
    status: "rejected",
    submittedAt: "21 Okt 2026, 10:00",
  },
  {
    id: "4",
    driverName: "Arief Pratama",
    driverPhone: "0856-2419-2369",
    vehiclePlate: "B 3344 GHI",
    vehicleName: "Toyota Innova",
    destination: "Semarang",
    departureDate: "28 Okt 2026",
    returnDate: "31 Okt 2026",
    reason: "Pengiriman barang",
    status: "pending",
    submittedAt: "23 Okt 2026, 11:45",
  },
  {
    id: "5",
    driverName: "Nauval Annabil",
    driverPhone: "0821-1111-2222",
    vehiclePlate: "L 5566 JKL",
    vehicleName: "Daihatsu Xenia",
    destination: "Malang",
    departureDate: "29 Okt 2026",
    returnDate: "01 Nov 2026",
    reason: "Liburan bersama keluarga",
    status: "approved",
    submittedAt: "22 Okt 2026, 16:20",
  },
  {
    id: "6",
    driverName: "Nabila Maulida",
    driverPhone: "0812-3333-4444",
    vehiclePlate: "B 7788 MNO",
    vehicleName: "Suzuki Ertiga",
    destination: "Solo",
    departureDate: "30 Okt 2026",
    returnDate: "02 Nov 2026",
    reason: "Menghadiri undangan pernikahan",
    status: "pending",
    submittedAt: "23 Okt 2026, 08:30",
  },
];

export default function OutOfTownPage() {
  const [requests, setRequests] = useState<OutOfTownRequest[]>(dummyRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRequest, setSelectedRequest] =
    useState<OutOfTownRequest | null>(null);

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

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const handleStatusChange = (id: string, status: OutOfTownStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
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
                value: pendingCount,
                icon: "schedule",
                iconBg: "bg-amber-50 dark:bg-amber-900/20",
                iconColor: "text-amber-500",
              },
              {
                key: "approved",
                label: "Approved",
                value: approvedCount,
                icon: "check_circle",
                iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
                iconColor: "text-emerald-500",
              },
              {
                key: "rejected",
                label: "Rejected",
                value: rejectedCount,
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
            <OutOfTownTable requests={paged} onSelect={setSelectedRequest} />
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

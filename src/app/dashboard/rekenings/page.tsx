"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/ui/pagination";
import {
  confirmToast,
  toastError,
  toastInfo,
  toastSuccess,
} from "@/components/ui/toast-provider";
import { RekeningCard } from "@/components/rekenings/rekening-card";
import { RekeningTable } from "@/components/rekenings/rekening-table";
import {
  SearchBarRekening,
  type RekeningFilters,
} from "@/components/rekenings/search-bar-rekening";
import { rekeningApi } from "@/lib/api/rekening";
import type { Rekening } from "@/lib/types/rekening";
import type { ExportOptions } from "@/components/ui/export";

const RekeningList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rekenings, setRekenings] = useState<Rekening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<RekeningFilters>({
    search: "",
    method: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const toastShownRef = useRef(false);

  const fetchRekenings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await rekeningApi.getList();
      const list = Array.isArray(res.data) ? res.data : [];
      setRekenings([...list].sort((a, b) => a.code.localeCompare(b.code)));
    } catch (err: unknown) {
      setRekenings([]);
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to load metode pembayaran. Please try again.";
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRekenings();
  }, [fetchRekenings]);

  useEffect(() => {
    const success = searchParams.get("success");
    const name = searchParams.get("name");

    if (success && name && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Update" : "Registration";
      toastSuccess(
        `${action} Successful: Rekening ${decodeURIComponent(name)} has been ${success} successfully.`,
      );
      window.history.replaceState({}, "", "/dashboard/rekenings");
    }
  }, [searchParams]);

  const filteredRekenings = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return rekenings.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        (item.provider ?? "").toLowerCase().includes(query) ||
        (item.account_number ?? "").toLowerCase().includes(query) ||
        (item.account_holder ?? "").toLowerCase().includes(query);
      const matchesMethod = !filters.method || item.method === filters.method;
      const matchesStatus =
        !filters.status ||
        (filters.status === "active"
          ? item.is_active
          : filters.status === "inactive"
            ? !item.is_active
            : true);
      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [rekenings, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRekenings.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const pagedRekenings = filteredRekenings.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  const stats = useMemo(() => {
    const active = rekenings.filter((item) => item.is_active);
    const qris = rekenings.filter((item) => item.method === "qris");
    const bank = rekenings.filter((item) => item.method === "bank");
    const eWallet = rekenings.filter((item) => item.method === "e_wallet");
    return {
      active: active.length,
      qris: qris.length,
      bank: bank.length,
      eWallet: eWallet.length,
      tradisional: bank.length + eWallet.length,
    };
  }, [rekenings]);

  const handleFilterChange = (next: RekeningFilters) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleDelete = async (rekening: Rekening) => {
    const confirmed = await confirmToast({
      title: "Delete Rekening",
      message: `Are you sure you want to delete ${rekening.name}${
        rekening.account_number ? ` (${rekening.account_number})` : ""
      }? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      await rekeningApi.delete(rekening.id);
      toastSuccess(`Rekening ${rekening.name} has been deleted successfully`);
      fetchRekenings();
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to delete rekening. Please try again.";
      toastError(message);
    }
  };

  const handleEdit = (rekening: Rekening) => {
    router.push(`/dashboard/rekenings/new?id=${rekening.id}`);
  };

  const handleToggleStatus = async (rekening: Rekening) => {
    const isActive = rekening.is_active !== false;
    const action = isActive ? "nonaktif" : "aktif";

    const confirmed = await confirmToast({
      title: isActive ? "Mark as Inactive" : "Mark as Active",
      message: `Are you sure you want to mark ${rekening.name} as ${action}? ${
        isActive
          ? "Rekening ini tidak akan muncul lagi di pilihan pembayaran."
          : "Rekening ini bisa dipilih kembali."
      }`,
      confirmText: `Yes, ${isActive ? "Deactivate" : "Activate"}`,
      cancelText: "Cancel",
      variant: isActive ? "danger" : "info",
    });

    if (!confirmed) return;

    try {
      await rekeningApi.updateStatus(rekening.id, !isActive);
      toastSuccess(
        `Rekening ${rekening.name} has been ${isActive ? "deactivated" : "activated"} successfully.`,
      );
      fetchRekenings();
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to update rekening status. Please try again.";
      toastError(message);
    }
  };

  const handleExport = (options: ExportOptions) => {
    toastInfo(
      `Exporting ${options.type === "all" ? "all" : "filtered"} rekening data as ${options.format.toUpperCase()}`,
    );
  };

  return (
    <div className="m-8 space-y-6">
      <PageHeader
        title="Metode Pembayaran"
        description="Kelola rekening bank, e-wallet, dan QRIS perusahaan untuk menerima pembayaran sewa dan kas."
        buttonText="Add New Rekening"
        buttonHref="/dashboard/rekenings/new"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RekeningCard
          title="Total Metode"
          value={String(rekenings.length)}
          icon="account_balance_wallet"
          iconColor="text-primary"
          trend={{
            value: "Seluruh metode pembayaran terdaftar",
            color: "text-emerald-600",
            icon: "trending_up",
          }}
        />
        <RekeningCard
          title="Metode Aktif"
          value={String(stats.active)}
          icon="verified"
          iconColor="text-emerald-600"
          trend={{
            value: `${stats.active} dari ${rekenings.length} metode aktif`,
            color: "text-emerald-600",
            icon: "info",
          }}
        />
        <RekeningCard
          title="QRIS"
          value={String(stats.qris)}
          icon="qr_code_scanner"
          iconColor="text-blue-600"
          trend={{
            value: `${stats.qris} kode QRIS terdaftar`,
            color: "text-blue-600",
            icon: "info",
          }}
        />
        <RekeningCard
          title="Bank & E-Wallet"
          value={String(stats.tradisional)}
          icon="account_balance"
          iconColor="text-purple-600"
          trend={{
            value: `${stats.bank} bank · ${stats.eWallet} e-wallet`,
            color: "text-purple-600",
            icon: "info",
          }}
        />
      </div>

      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        Menampilkan{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          {filteredRekenings.length}
        </span>{" "}
        dari{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          {rekenings.length}
        </span>{" "}
        metode pembayaran
      </div>

      <SearchBarRekening
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <RekeningTable
          rekenings={pagedRekenings}
          totalResults={filteredRekenings.length}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onExport={handleExport}
        />
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalResults={filteredRekenings.length}
          resultsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default function RekeningListPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <RekeningList />
    </Suspense>
  );
}
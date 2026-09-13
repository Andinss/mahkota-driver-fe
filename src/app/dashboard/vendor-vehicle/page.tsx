"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  confirmToast,
  toastSuccess,
  toastError,
} from "@/components/ui/toast-provider";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { VendorCard } from "@/components/vendor-vehicle/card";
import { VendorTable } from "@/components/vendor-vehicle/table-vendor";
import { VendorPagination } from "@/components/vendor-vehicle/pagination";
import type { ExportOptions } from "@/components/ui/export";
import { vendorApi } from "@/lib/api/vendor-vehicle";
import { formatRupiah } from "@/lib/utils/format";
import type {
  VendorVehicle,
  VendorVehicleSummary,
} from "@/lib/types/vendor-vehicle";

const imageBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

const buildLogoUrl = (logo?: string) =>
  logo
    ? logo.startsWith("http")
      ? logo
      : `${imageBase}/${logo.replace(/^\//, "")}`
    : "";

export default function VendorVehiclePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vendors, setVendors] = useState<VendorVehicle[]>([]);
  const [summary, setSummary] = useState<VendorVehicleSummary | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await vendorApi.getList({
        page: currentPage,
        limit: itemsPerPage,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      const items = Array.isArray(res.data) ? res.data : [];
      setVendors(items);
      if (res.meta) {
        setTotalResults(res.meta.total);
        setTotalPages(res.meta.totalPages);
      } else {
        setTotalPages(1);
        setTotalResults(items.length);
      }
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
      setVendors([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, search, statusFilter]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await vendorApi.getSummary();
      setSummary(res.data);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    const success = searchParams.get("success");
    const name = searchParams.get("name");

    if (success && name && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Update" : "Registration";
      toastSuccess(
        `${action} Successful: Vendor ${decodeURIComponent(name)} has been ${success} successfully.`,
      );
      window.history.replaceState({}, "", "/dashboard/vendor-vehicle");
    }

    fetchVendors();
  }, [searchParams, fetchVendors]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const displayVendors = useMemo(
    () =>
      vendors.map((v) => ({
        ...v,
        logo: buildLogoUrl(v.logo),
      })),
    [vendors],
  );

  const totalVendors = summary?.total_vendors ?? 0;
  const totalPendapatan = summary?.total_pendapatan ?? 0;
  const averagePendapatan = summary?.average_pendapatan ?? 0;
  const activeCount = summary?.active ?? 0;

  const safePage = Math.min(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (vendor: VendorVehicle) => {
    const confirmed = await confirmToast({
      title: "Delete Vendor",
      message: `Are you sure you want to delete ${vendor.name}? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      variant: "danger",
    });
    if (confirmed) {
      try {
        await vendorApi.delete(vendor.id);
        toastSuccess(`Vendor ${vendor.name} has been deleted successfully`);
        fetchVendors();
        fetchSummary();
      } catch (err) {
        console.error("Failed to delete vendor:", err);
        toastError("Failed to delete vendor. Please try again.");
      }
    }
  };

  const handleDetails = (vendor: VendorVehicle) => {
    router.push(`/dashboard/vendor-vehicle/detail?id=${vendor.id}`);
  };

  const handleEdit = (vendor: VendorVehicle) => {
    router.push(`/dashboard/vendor-vehicle/new?id=${vendor.id}`);
  };

  const handleExport = async (options?: ExportOptions) => {
    if (!options) return;
    const params: Record<string, string | number | undefined> = {
      format: options.format,
      columns: options.columns.join(","),
      search: search || undefined,
      status: statusFilter || undefined,
    };
    if (options.dateRange?.start) params.start_date = options.dateRange.start;
    if (options.dateRange?.end) params.end_date = options.dateRange.end;
    try {
      await vendorApi.exportData(params);
    } catch (err) {
      console.error("Failed to export vendors:", err);
      toastError("Failed to export vendor data. Please try again.");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Vendor Vehicles Overview"
        description="Kelola daftar vendor kendaraan, lengkapi identitas pemilik, dan pantau total pendapatan setiap vendor."
        buttonText="Add New Vendor"
        buttonHref="/dashboard/vendor-vehicle/new"
      />

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <VendorCard
          title="Total Vendor"
          value={totalVendors.toString()}
          icon="storefront"
          iconColor="text-primary"
          trend={{
            value: "Seluruh vendor terdaftar",
            color: "text-green-600",
            icon: "trending_up",
          }}
        />
        <VendorCard
          title="Total Pendapatan"
          value={formatRupiah(totalPendapatan)}
          icon="payments"
          iconColor="text-emerald-600"
          trend={{
            value: "Akumulasi semua vendor",
            color: "text-emerald-600",
            icon: "trending_up",
          }}
        />
        <VendorCard
          title="Rata-Rata Pendapatan"
          value={formatRupiah(averagePendapatan)}
          icon="insights"
          iconColor="text-blue-600"
          trend={{
            value: "Berdasarkan semua vendor",
            color: "text-blue-600",
            icon: "info",
          }}
        />
        <VendorCard
          title="Vendor Aktif"
          value={activeCount.toString()}
          icon="verified"
          iconColor="text-purple-600"
          trend={{
            value: `${activeCount} dari ${totalVendors} vendor`,
            color: "text-purple-600",
            icon: "info",
          }}
        />
      </div>

      <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <SearchInput
            className="w-full md:max-w-md"
            placeholder="Search by Vendor or Owner..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
          <div className="flex gap-3 w-full md:w-auto">
            <Select
              id="filter-status"
              label=""
              className="min-w-[160px]"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
            >
              <option value="">All Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            Loading...
          </div>
        ) : displayVendors.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            Tidak ada vendor yang cocok dengan pencarian.
          </div>
        ) : (
          <>
            <VendorTable
              vendors={displayVendors}
              totalResults={totalResults}
              onDelete={handleDelete}
              onDetails={handleDetails}
              onEdit={handleEdit}
              onExport={handleExport}
            />
            <div className="border-t border-slate-200 dark:border-slate-800">
              <VendorPagination
                currentPage={safePage}
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
  );
}
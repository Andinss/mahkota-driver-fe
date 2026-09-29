"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/ui/pagination";
import {
  confirmToast,
  toastError,
  toastInfo,
  toastSuccess,
} from "@/components/ui/toast-provider";
import { MembershipCard } from "@/components/memberships/membership-card";
import { MembershipTable } from "@/components/memberships/membership-table";
import {
  SearchBarMembership,
  type MembershipFilters,
} from "@/components/memberships/search-bar-membership";
import { membershipApi } from "@/lib/api/membership";
import { formatRupiah } from "@/lib/utils/format";
import type { Membership } from "@/lib/types/membership";
import type { ExportOptions } from "@/components/ui/export";

const MembershipList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<MembershipFilters>({
    search: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const toastShownRef = useRef(false);

  const fetchMemberships = async () => {
    setIsLoading(true);
    try {
      const res = await membershipApi.getList();
      const list = Array.isArray(res.data) ? res.data : [];
      setMemberships([...list].sort((a, b) => a.level - b.level));
    } catch {
      setMemberships([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  useEffect(() => {
    const success = searchParams.get("success");
    const name = searchParams.get("name");

    if (success && name && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Update" : "Registration";
      toastSuccess(
        `${action} Successful: Membership ${decodeURIComponent(name)} has been ${success} successfully.`,
      );
      window.history.replaceState({}, "", "/dashboard/memberships");
    }
  }, [searchParams]);

  const filteredMemberships = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return memberships.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.description ?? "").toLowerCase().includes(query);
      const matchesStatus =
        !filters.status ||
        (filters.status === "active"
          ? item.is_active
          : filters.status === "inactive"
            ? !item.is_active
            : true);
      return matchesSearch && matchesStatus;
    });
  }, [memberships, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredMemberships.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pagedMemberships = filteredMemberships.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  const stats = useMemo(() => {
    const regular = memberships.find((item) => item.level === 1);
    const premium = memberships.find((item) => item.level === 2);
    const active = memberships.filter((item) => item.is_active).length;
    return { premium, regular, active };
  }, [memberships]);

  const handleFilterChange = (next: MembershipFilters) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleDelete = async (membership: Membership) => {
    const confirmed = await confirmToast({
      title: "Delete Membership",
      message: `Are you sure you want to delete ${membership.name} membership type? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      await membershipApi.delete(membership.id);
      toastSuccess(`Membership ${membership.name} has been deleted successfully`);
      fetchMemberships();
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to delete membership. Please try again.";
      toastError(message);
    }
  };

  const handleEdit = (membership: Membership) => {
    router.push(`/dashboard/memberships/new?id=${membership.id}`);
  };

  const handleExport = (options: ExportOptions) => {
    toastInfo(
      `Exporting ${options.type === "all" ? "all" : "filtered"} membership data as ${options.format.toUpperCase()}`,
    );
  };

  return (
    <div className="m-8 space-y-6">
      <PageHeader
        title="Membership List Overview"
        description="Kelola tipe membership Regular & Premium beserta fee dan benefit yang berlaku."
        buttonText="Add New Membership"
        buttonHref="/dashboard/memberships/new"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MembershipCard
          title="Total Tipe Membership"
          value={String(memberships.length)}
          icon="card_membership"
          iconColor="text-primary"
          trend={{
            value: "Seluruh tipe membership terdaftar",
            color: "text-emerald-600",
            icon: "trending_up",
          }}
        />
        <MembershipCard
          title="Membership Aktif"
          value={String(stats.active)}
          icon="verified"
          iconColor="text-emerald-600"
          trend={{
            value: `${stats.active} dari ${memberships.length} tipe aktif`,
            color: "text-emerald-600",
            icon: "info",
          }}
        />
        <MembershipCard
          title="Fee Level 1 - Regular"
          value={formatRupiah(stats.regular?.fee ?? 0)}
          icon="military_tech"
          iconColor="text-blue-600"
          trend={{
            value: stats.regular?.name || "Belum ada data",
            color: "text-blue-600",
            icon: "info",
          }}
        />
        <MembershipCard
          title="Fee Level 2 - Premium"
          value={formatRupiah(stats.premium?.fee ?? 0)}
          icon="workspace_premium"
          iconColor="text-purple-600"
          trend={{
            value: stats.premium?.name || "Belum ada data",
            color: "text-purple-600",
            icon: "info",
          }}
        />
      </div>

      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        Menampilkan{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          {filteredMemberships.length}
        </span>{" "}
        dari{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          {memberships.length}
        </span>{" "}
        tipe membership
      </div>

      <SearchBarMembership filters={filters} onFilterChange={handleFilterChange} />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <MembershipTable
          memberships={pagedMemberships}
          totalResults={filteredMemberships.length}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onExport={handleExport}
        />
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalResults={filteredMemberships.length}
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

export default function MembershipListPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <MembershipList />
    </Suspense>
  );
}

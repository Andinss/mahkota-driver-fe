"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  confirmToast,
  toastSuccess,
  toastError,
} from "@/components/ui/toast-provider";
import { PaymentCard } from "@/components/finance/payment-list/card";
import { Pagination } from "@/components/ui/pagination";
import { PaymentTable } from "@/components/finance/payment-list/payment-table";
import { DailyPaymentTable } from "@/components/finance/payment-list/daily-payment-table";
import { AdminPaymentTable } from "@/components/finance/payment-list/admin-payment-table";
import { PageHeader } from "@/components/page-header";
import { useSearchParams, useRouter } from "next/navigation";
import type { ExportOptions } from "@/components/ui/export";
import { FinanceTabFilters } from "@/components/finance/payment-list/finance-tab-filters";
import { financeApi } from "@/lib/api/finances";
import { koinApi } from "@/lib/api/koin";
import { HttpClientError } from "@/lib/api-http";
import type {
  FinanceItem,
  FinanceListParams,
  FinanceSummary,
  DailyPaymentItem,
} from "@/lib/types/finances";
import type { KoinSummary, KoinTransaction } from "@/lib/types/koin";
import { KoinTable } from "@/components/finance/koin-table";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { Button } from "@/components/ui/button";

type FinanceTab = "daily" | "admin-koin" | "koin";

const tabConfig: { key: FinanceTab; label: string }[] = [
  { key: "daily", label: "Daily Payment" },
  { key: "admin-koin", label: "Admin Payment" },
  { key: "koin", label: "Koin" },
];

export default function PaymentList() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<FinanceTab>("daily");

  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [summary, setSummary] = useState<FinanceSummary | null>(null);

  const [dailyPayments, setDailyPayments] = useState<DailyPaymentItem[]>([]);
  const [dailyTablePayments, setDailyTablePayments] = useState<DailyPaymentItem[] | null>(null);
  const [dailyMeta, setDailyMeta] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });

  const [adminFees, setAdminFees] = useState<FinanceItem[]>([]);
  const [adminFeeMeta, setAdminFeeMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [koinTransactions, setKoinTransactions] = useState<KoinTransaction[]>([]);
  const [koinMeta, setKoinMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [koinSummary, setKoinSummary] = useState<KoinSummary | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dailyDateFilter, setDailyDateFilter] = useState(""); // "" | "today"
  const [dailyStatusFilter, setDailyStatusFilter] = useState(""); // "" | "paid" | "unpaid"
  const [adminStatusFilter, setAdminStatusFilter] = useState(""); // "" | "paid" | "unpaid"
  const [koinTypeFilter, setKoinTypeFilter] = useState(""); // "" | "top_up" | "refund"
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchValue), 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setSearchValue("");
    setDebouncedSearch("");
    setPaymentMethod("");
    setDailyDateFilter("");
    setDailyStatusFilter("");
    setAdminStatusFilter("");
    setKoinTypeFilter("");
    setCurrentPage(1);
  }, [activeTab]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await financeApi.getSummary();
      setSummary(res.data);
    } catch {
      // summary non-critical
    }
  }, []);

  const fetchDailyPayments = useCallback(async () => {
    if (!canAccess(user?.permissions, "finance.read")) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await financeApi.getDailyPayments({
        page: 1,
        limit: 100,
        search: debouncedSearch || undefined,
      });
      const items = Array.isArray(response.data) ? response.data : [];
      setDailyPayments(items);
      if (response.meta) setDailyMeta(response.meta);
    } catch {
      toastError("Failed to load daily payments");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, user]);

  const fetchFilteredDailyPayments = useCallback(async () => {
    if (!dailyStatusFilter) {
      setDailyTablePayments(null);
      return;
    }
    try {
      const response = await financeApi.getDailyPayments({
        page: 1,
        limit: 100,
        search: debouncedSearch || undefined,
        status: dailyStatusFilter || undefined,
      });
      const items = Array.isArray(response.data) ? response.data : [];
      setDailyTablePayments(items);
    } catch {
      toastError("Failed to load daily payments");
    }
  }, [dailyStatusFilter, debouncedSearch, user]);

  useEffect(() => {
    fetchFilteredDailyPayments();
  }, [fetchFilteredDailyPayments]);

  const fetchAdminFees = useCallback(async () => {
    if (!canAccess(user?.permissions, "finance.read")) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await financeApi.getAdminFees({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
      });
      const items = Array.isArray(response.data) ? response.data : [];
      setAdminFees(items);
      if (response.meta) setAdminFeeMeta(response.meta);
    } catch {
      toastError("Failed to load admin fees");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, user]);

  const fetchKoinTransactions = useCallback(async () => {
    if (!canAccess(user?.permissions, "finance.read")) {
      return;
    }
    try {
      const response = await koinApi.getAllTransactions({
        page: 1,
        limit: 100,
        type: koinTypeFilter || undefined,
      });
      const items = Array.isArray(response.data) ? response.data : [];
      setKoinTransactions(items);
      if (response.meta) setKoinMeta(response.meta);
    } catch {
      toastError("Failed to load koin transactions");
    }
  }, [user, koinTypeFilter]);

  const fetchKoinSummary = useCallback(async () => {
    try {
      const res = await koinApi.getSummary();
      if ((res as any)?.success) {
        setKoinSummary((res as any).data);
      }
    } catch {
      // koin summary non-critical
    }
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  useEffect(() => {
    if (activeTab === "daily") {
      fetchDailyPayments();
    } else if (activeTab === "admin-koin") {
      fetchAdminFees();
    } else if (activeTab === "koin") {
      fetchKoinTransactions();
      fetchKoinSummary();
    }
  }, [activeTab, fetchDailyPayments, fetchAdminFees, fetchKoinTransactions, fetchKoinSummary]);

  useEffect(() => {
    const success = searchParams.get("success");
    const ref = searchParams.get("ref");
    if (success && ref && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Update" : "Registration";
      toastSuccess(
        `${action} Successful: Finance ${decodeURIComponent(ref)} has been ${success} successfully.`,
      );
      window.history.replaceState({}, "", "/dashboard/finances");
    }
  }, [searchParams]);

  const handleExport = async (options?: ExportOptions) => {
    if (!options) return;
    const params: Record<string, string | number | undefined> = {
      format: options.format, columns: options.columns.join(","), type: options.type,
    };
    if (options.type === "filtered") {
      if (searchValue) params.search = searchValue;
      if (paymentMethod) params.payment_method = paymentMethod;
      if (dailyStatusFilter || adminStatusFilter) {
        params.status = dailyStatusFilter || adminStatusFilter;
      }
      if (options.dateRange?.start) params.start_date = options.dateRange.start;
      if (options.dateRange?.end) params.end_date = options.dateRange.end;
    }
    await financeApi.exportData(params);
  };

  const handleDelete = async (finance: FinanceItem) => {
    const base = `Are you sure you want to delete ${finance.reference_number}?`;
    const message = finance.payment_method === "saldo"
      ? base
      : `${base}\n\nDeleting this finance will not affect the driver's koin.`;
    const confirmed = await confirmToast({
      title: "Delete Payment", message, confirmText: "Yes, Delete",
      cancelText: "Cancel", variant: "danger",
    });
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await financeApi.delete(finance.id);
      toastSuccess(`Finance ${finance.reference_number} has been deleted successfully`);
      fetchAdminFees(); fetchSummary();
    } catch (err) {
      toastError(err instanceof HttpClientError ? err.message : "Failed to delete finance record");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDetails = (finance: FinanceItem) => {
    router.push(`/dashboard/finances/detail?id=${finance.id}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value); setCurrentPage(1);
  };
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value); setCurrentPage(1);
  };
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= adminFeeMeta.totalPages) setCurrentPage(page);
  };

  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const dailyBasePayments = dailyTablePayments ?? dailyPayments;

  const filteredDailyPayments = dailyBasePayments.filter((dp) => {
    if (dailyDateFilter === "today" && !isToday(dp.payment_date) && !isToday(dp.created_at)) {
      return false;
    }
    if (dailyStatusFilter && dp.status !== dailyStatusFilter) return false;
    return true;
  });

  const filteredAdminFees = adminFees.filter((f) => {
    if (adminStatusFilter && f.status !== adminStatusFilter) return false;
    return true;
  });

  const filteredKoinTransactions = koinTransactions.filter((tx) => {
    if (koinTypeFilter && tx.type !== koinTypeFilter) return false;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      const hay = `${tx.driver_name || ""} ${tx.reference_number || ""} ${tx.notes || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const totalDailyAmount = dailyPayments.reduce((sum, dp) => sum + (Number(dp.amount) || 0), 0);
  const unpaidDailyCount = dailyPayments.filter((dp) => dp.status === "unpaid").length;
  const paidDailyCount = dailyPayments.filter((dp) => dp.status === "paid").length;

  const renderDailyCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <PaymentCard title="Total Tagihan Hari Ini" value={`Rp ${totalDailyAmount.toLocaleString("id-ID")}`} icon="payments" iconColor="text-primary"
        trend={{ value: `${dailyPayments.length} tagihan`, color: "text-primary", icon: "trending_up" }} />
      <PaymentCard title="Sudah Dibayar" value={`Rp ${dailyPayments.filter((dp) => dp.status === "paid").reduce((s, dp) => s + Number(dp.amount), 0).toLocaleString("id-ID")}`} icon="check_circle" iconColor="text-emerald-500"
        trend={{ value: `${paidDailyCount} dibayar`, color: "text-emerald-500", icon: "trending_up" }} />
      <PaymentCard title="Belum Dibayar" value={`Rp ${dailyPayments.filter((dp) => dp.status === "unpaid").reduce((s, dp) => s + Number(dp.amount), 0).toLocaleString("id-ID")}`} icon="schedule" iconColor="text-amber-500"
        trend={{ value: `${unpaidDailyCount} belum dibayar`, color: "text-amber-500", icon: "info" }} />
      <PaymentCard title="Hari Ini" value={new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" })} icon="today" iconColor="text-blue-500"
        trend={{ value: `${dailyPayments.length} total tagihan aktif`, color: "text-blue-500", icon: "info" }} />
    </div>
  );

  const totalAdminFeeAmount = adminFees.reduce((sum, f) => sum + (Number(f.fee_admin_join) || 0), 0);
  const paidAdminFeeCount = adminFees.filter((f) => f.status === "paid").length;

  const renderAdminFeeCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <PaymentCard title="Total Fee Membership" value={`Rp ${totalAdminFeeAmount.toLocaleString("id-ID")}`} icon="admin_panel_settings" iconColor="text-amber-500"
        trend={{ value: `${adminFees.length} total`, color: "text-amber-500", icon: "trending_up" }} />
      <PaymentCard title="Sudah Dibayar" value={`Rp ${adminFees.filter((f) => f.status === "paid").reduce((s, f) => s + (Number(f.fee_admin_join) || 0), 0).toLocaleString("id-ID")}`} icon="check_circle" iconColor="text-emerald-500"
        trend={{ value: `${paidAdminFeeCount} dibayar`, color: "text-emerald-500", icon: "trending_up" }} />
      <PaymentCard title="Belum Dibayar" value={`Rp ${adminFees.filter((f) => f.status !== "paid").reduce((s, f) => s + (Number(f.fee_admin_join) || 0), 0).toLocaleString("id-ID")}`} icon="schedule" iconColor="text-red-500"
        trend={{ value: `${adminFees.length - paidAdminFeeCount} belum dibayar`, color: "text-red-500", icon: "info" }} />
      <PaymentCard title="Premium (Rp 700K)" value={String(adminFees.filter((f) => f.fee_kind !== "membership_fee" && (Number(f.fee_admin_join) || 0) >= 700000).length)} icon="star" iconColor="text-violet-500"
        trend={{ value: `Reguler: ${adminFees.filter((f) => f.fee_kind !== "membership_fee" && (Number(f.fee_admin_join) || 0) > 0 && (Number(f.fee_admin_join) || 0) < 700000).length} · Fee Membership: ${adminFees.filter((f) => f.fee_kind === "membership_fee").length} (Rp ${adminFees.filter((f) => f.fee_kind === "membership_fee").reduce((s, f) => s + (Number(f.fee_admin_join) || 0), 0).toLocaleString("id-ID")})`, color: "text-violet-500", icon: "info" }} />
    </div>
  );

  const totalKoinTopUp = koinTransactions
    .filter((tx) => tx.type === "top_up")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const renderKoinCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <PaymentCard title="Total Koin" value={koinSummary ? `Rp ${Number(koinSummary.total_balance).toLocaleString("id-ID")}` : "Rp 0"} icon="account_balance_wallet" iconColor="text-primary"
        trend={{ value: `${koinSummary?.total_drivers_with_koin ?? 0} driver`, color: "text-primary", icon: "trending_up" }} />
      <PaymentCard title="Total Top Up Koin" value={`Rp ${totalKoinTopUp.toLocaleString("id-ID")}`} icon="add_circle" iconColor="text-green-500"
        trend={{ value: `${koinTransactions.filter((tx) => tx.type === "top_up").length} transaksi`, color: "text-green-500", icon: "trending_up" }} />
      <PaymentCard title="Total Refund" value={`Rp ${koinSummary ? Number(koinSummary.total_refunds).toLocaleString("id-ID") : "Rp 0"}`} icon="replay" iconColor="text-orange-500"
        trend={{ value: `${koinTransactions.filter((tx) => tx.type === "refund").length} refund`, color: "text-orange-500", icon: "trending_up" }} />
      <PaymentCard title="Koin Masuk" value={`${koinTransactions.filter((tx) => tx.type === "top_up" || tx.type === "refund").length}`} icon="check_circle" iconColor="text-emerald-500"
        trend={{ value: `Total transaksi: ${koinTransactions.length}`, color: "text-emerald-500", icon: "info" }} />
    </div>
  );

  return (
    <PermissionGuard permission="finance.read">
      <div className="m-8">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-10">
            <PageHeader
              title="Finance List Overview"
              description="Manage your finances, track payments, and monitor transactions."
            />

            {/* Tab Navigation */}
            <div className="flex gap-1 border-b border-[#dbe0e6] dark:border-gray-700">
              {tabConfig.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === tab.key
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "daily" && !isLoading && (
              <>
                {renderDailyCards()}
                <FinanceTabFilters
                  searchValue={searchValue}
                  onSearchChange={handleSearchChange}
                  searchPlaceholder="Search reference number, driver, or plate..."
                  selects={[
                    {
                      id: "filter-daily-date",
                      value: dailyDateFilter,
                      onChange: setDailyDateFilter,
                      options: [
                        { value: "", label: "Semua Tanggal" },
                        { value: "today", label: "Hari Ini" },
                      ],
                    },
                    {
                      id: "filter-daily-status",
                      value: dailyStatusFilter,
                      onChange: setDailyStatusFilter,
                      options: [
                        { value: "", label: "All Status" },
                        { value: "paid", label: "Paid" },
                        { value: "unpaid", label: "Unpaid" },
                      ],
                    },
                  ]}
                />
                <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-500 text-xl">today</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-base">
                          Tagihan Hari Berjalan + Unpaid
                        </h3>
                        <p className="text-xs text-slate-400">
                          Menampilkan tagihan hari ini dan tagihan sebelumnya yang belum dibayar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm">
                  <DailyPaymentTable payments={filteredDailyPayments} />
                </div>
              </>
            )}
            {activeTab === "daily" && isLoading && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm">Loading...</div>
            )}

            {activeTab === "admin-koin" && !isLoading && (
              <>
                {renderAdminFeeCards()}
                <FinanceTabFilters
                  searchValue={searchValue}
                  onSearchChange={handleSearchChange}
                  searchPlaceholder="Search reference number or payer..."
                  selects={[
                    {
                      id: "filter-admin-status",
                      value: adminStatusFilter,
                      onChange: setAdminStatusFilter,
                      options: [
                        { value: "", label: "All Status" },
                        { value: "paid", label: "Paid" },
                        { value: "unpaid", label: "Unpaid" },
                      ],
                    },
                  ]}
                />
                <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                  <AdminPaymentTable payments={filteredAdminFees} />
                  <div className="border-t border-[#dbe0e6] dark:border-gray-700">
                    <Pagination currentPage={adminFeeMeta.page} totalPages={adminFeeMeta.totalPages} totalResults={adminFeeMeta.total} resultsPerPage={itemsPerPage} onPageChange={handlePageChange} onPageSizeChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }} />
                  </div>
                </div>
              </>
            )}
            {activeTab === "admin-koin" && isLoading && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm">Loading...</div>
            )}

            {activeTab === "koin" && !isLoading && (
              <>
                {renderKoinCards()}
                <FinanceTabFilters
                  searchValue={searchValue}
                  onSearchChange={handleSearchChange}
                  searchPlaceholder="Search driver, reference, or notes..."
                  selects={[
                    {
                      id: "filter-koin-type",
                      value: koinTypeFilter,
                      onChange: setKoinTypeFilter,
                      options: [
                        { value: "", label: "All Types" },
                        { value: "top_up", label: "Top Up" },
                        { value: "refund", label: "Refund" },
                      ],
                    },
                  ]}
                />
                <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-500 text-xl">account_balance_wallet</span>
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800 dark:text-white text-base">
                          Koin Transactions
                        </h2>
                        <p className="text-xs text-slate-400">{filteredKoinTransactions.length} transaksi koin tercatat</p>
                      </div>
                    </div>
                    <Link href="/dashboard/finances/koin">
                      <Button icon="add" variant="success">
                        Buat Top Up
                      </Button>
                    </Link>
                  </div>
                  <KoinTable transactions={filteredKoinTransactions} />
                </div>
              </>
            )}
            {activeTab === "koin" && isLoading && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
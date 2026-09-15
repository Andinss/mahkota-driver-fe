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
import { PageHeader } from "@/components/page-header";
import { useSearchParams, useRouter } from "next/navigation";
import type { ExportOptions } from "@/components/ui/export";
import { PaymentFilters } from "@/components/finance/payment-list/payment-filters";
import { financeApi } from "@/lib/api/finances";
import { HttpClientError } from "@/lib/api-http";
import type {
  FinanceItem,
  FinanceListParams,
  FinanceSummary,
} from "@/lib/types/finances";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";

export default function PaymentList() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [summary, setSummary] = useState<FinanceSummary | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isDeleting, setIsDeleting] = useState(false);

  const toastShownRef = useRef(false);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await financeApi.getSummary();
      setSummary(res.data);
    } catch {
      // summary non-critical
    }
  }, []);

  const fetchFinances = useCallback(async () => {
    if (!canAccess(user?.permissions, "finance.read")) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const params: FinanceListParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchValue || undefined,
        payment_method: paymentMethod || undefined,
      };
      const response = await financeApi.getList(params);
      const items = Array.isArray(response.data) ? response.data : [];
      setFinances(items);
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch {
      toastError("Failed to load finance data");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchValue, paymentMethod, user]);

  useEffect(() => {
    fetchFinances();
  }, [fetchFinances]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const success = searchParams.get("success");
    const ref = searchParams.get("ref");

    if (success && ref && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Update" : "Registration";
      toastSuccess(
        `${action} Successful: Finance ${decodeURIComponent(ref)} has been ${success} successfully.`,
      );
      window.history.replaceState({}, "", "/dashboard/finance");
    }
  }, [searchParams]);

  const totalAmount =
    summary?.total_amount_received ??
    finances.reduce((sum, f) => {
      return sum + (Number(f.amount_received) || 0);
    }, 0);

  const activeCount =
    summary?.total_active ?? finances.filter((f) => f.is_active).length;
  const inactiveCount =
    summary?.total_inactive ?? finances.filter((f) => !f.is_active).length;

  const handleExport = async (options?: ExportOptions) => {
    if (!options) return;
    const params: Record<string, string | number | undefined> = {
      format: options.format,
      columns: options.columns.join(","),
      type: options.type,
    };
    if (options.type === "filtered") {
      if (searchValue) params.search = searchValue;
      if (paymentMethod) params.payment_method = paymentMethod;
      if (options.dateRange?.start) params.start_date = options.dateRange.start;
      if (options.dateRange?.end) params.end_date = options.dateRange.end;
    }
    await financeApi.exportData(params);
  };

  const handleDelete = async (finance: FinanceItem) => {
    const base = `Are you sure you want to delete ${finance.reference_number}?`;
    const message =
      finance.payment_method === "saldo"
        ? base
        : `${base}\n\nDeleting this finance will not affect the driver's saldo.`;

    const confirmed = await confirmToast({
      title: "Delete Payment",
      message,
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await financeApi.delete(finance.id);
      toastSuccess(
        `Finance ${finance.reference_number} has been deleted successfully`,
      );
      fetchFinances();
      fetchSummary();
    } catch (err) {
      toastError(
        err instanceof HttpClientError
          ? err.message
          : "Failed to delete finance record",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDetails = (finance: FinanceItem) => {
    router.push(`/dashboard/finance/detail?id=${finance.id}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= meta.totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <PermissionGuard permission="finance.read">
      <div className="m-8">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-10">
            <PageHeader
              title="Finance List Overview"
              description={`Total Records: ${summary?.total_records ?? meta.total}`}
              buttonText={
                canAccess(user?.permissions, "finance.create")
                  ? "Manual Entry"
                  : undefined
              }
              buttonHref={
                canAccess(user?.permissions, "finance.create")
                  ? "/dashboard/finance/payment"
                  : undefined
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <PaymentCard
                title="Total Finance"
                value={`Rp ${totalAmount.toLocaleString("id-ID")}`}
                icon="payments"
                iconColor="text-primary"
                trend={{
                  value: `${summary?.total_records ?? finances.length} transactions`,
                  color: "text-primary",
                  icon: "trending_up",
                }}
              />
              <PaymentCard
                title="This Month"
                value={`Rp ${(summary?.total_this_month ?? 0).toLocaleString("id-ID")}`}
                icon="calendar_month"
                iconColor="text-emerald-500"
                trend={{
                  value: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
                  color: "text-emerald-500",
                  icon: "trending_up",
                }}
              />
              <PaymentCard
                title="Today"
                value={`Rp ${(summary?.total_today ?? 0).toLocaleString("id-ID")}`}
                icon="today"
                iconColor="text-amber-500"
                trend={{
                  value: new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" }),
                  color: "text-amber-500",
                  icon: "schedule",
                }}
              />
              <PaymentCard
                title="Total Transactions"
                value={`${summary?.total_records ?? meta.total}`}
                icon="receipt_long"
                iconColor="text-blue-500"
                trend={{
                  value: `${summary?.total_active ?? 0} active • ${summary?.total_inactive ?? 0} inactive`,
                  color: "text-blue-500",
                  icon: "info",
                }}
              />
            </div>

            <PaymentFilters
              searchValue={searchValue}
              paymentMethod={paymentMethod}
              onSearchChange={handleSearchChange}
              onPaymentMethodChange={handlePaymentMethodChange}
            />
            <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  Loading...
                </div>
              ) : (
                <>
                  <PaymentTable
                    payment={finances}
                    onDetails={handleDetails}
                    onEdit={(f) => {
                      router.push(`/dashboard/finance/payment?id=${f.id}`);
                    }}
                    onDelete={handleDelete}
                    onExport={handleExport}
                  />
                  <div className="border-t border-[#dbe0e6] dark:border-gray-700">
                    <Pagination
                      currentPage={meta.page}
                      totalPages={meta.totalPages}
                      totalResults={meta.total}
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
        </div>
      </div>
    </PermissionGuard>
  );
}

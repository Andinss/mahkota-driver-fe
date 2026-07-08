"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PaymentCard } from "@/components/finance/payment-list/card";
import { FinancePagination } from "@/components/finance/payment-list/payment-pagination";
import { PaymentTable } from "@/components/finance/payment-list/payment-table";
import { PageHeader } from "@/components/page-header";
import { AlertDialog } from "@/components/ui/alert";
import { useSearchParams, useRouter } from "next/navigation";
import type { ExportOptions } from "@/components/ui/export";
import { PaymentFilters } from "@/components/finance/payment-list/payment-filters";
import { financeApi } from "@/lib/api/finances";
import type { FinanceItem, FinanceListParams, FinanceSummary } from "@/lib/types/finances";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";

export default function PaymentList() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [summary, setSummary] = useState<FinanceSummary | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const [selectedFinance, setSelectedFinance] = useState<FinanceItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await financeApi.getSummary();
      setSummary(res.data);
    } catch {
      // summary non-critical
    }
  }, []);

  const fetchFinances = useCallback(async () => {
    if (!canAccess(user?.permissions, 'finance.read')) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const params: FinanceListParams = {
        page: currentPage,
        limit: 10,
        search: searchValue || undefined,
        payment_method: paymentMethod || undefined,
      };
      const response = await financeApi.getList(params);
      setFinances(response.data);
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch {
      setAlertTitle("Error");
      setAlertMessage("Failed to load finance data");
      setAlertType("error");
      setIsAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchValue, paymentMethod, user]);

  useEffect(() => {
    fetchFinances();
  }, [fetchFinances]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const success = searchParams.get("success");
    const ref = searchParams.get("ref");

    if (success && ref) {
      const action = success === "updated" ? "Update" : "Registration";
      setAlertTitle(`${action} Successful`);
      setAlertMessage(`Finance ${decodeURIComponent(ref)} has been ${success} successfully.`);
      setAlertType("success");
      setIsAlertOpen(true);
      window.history.replaceState({}, "", "/dashboard/finance");
    }
  }, [searchParams]);

  const totalAmount = summary?.total_amount_received ?? finances.reduce((sum, f) => {
    return sum + (Number(f.amount_received) || 0);
  }, 0);

  const activeCount = summary?.total_active ?? finances.filter((f) => f.is_active).length;
  const inactiveCount = summary?.total_inactive ?? finances.filter((f) => !f.is_active).length;

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
    await financeApi.exportData(params);
  };

  const handleDelete = (finance: FinanceItem) => {
    setSelectedFinance(finance);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFinance) return;
    setIsDeleting(true);
    try {
      await financeApi.delete(selectedFinance.id);
      setAlertTitle("Delete Successful");
      setAlertMessage(`Finance ${selectedFinance.reference_number} has been deleted successfully`);
      setAlertType("success");
      setIsAlertOpen(true);
      fetchFinances();
      fetchSummary();
    } catch {
      setAlertTitle("Error");
      setAlertMessage("Failed to delete finance record");
      setAlertType("error");
      setIsAlertOpen(true);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setSelectedFinance(null);
    }
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
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
            title="Finance Dashboard"
            description={`Total Records: ${summary?.total_records ?? meta.total}`}
            buttonText={canAccess(user?.permissions, "finance.create") ? "Manual Entry" : undefined}
            buttonHref={canAccess(user?.permissions, "finance.create") ? "/dashboard/finance/payment" : undefined}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PaymentCard
              title="Total Amount Received"
              value={`Rp ${totalAmount.toLocaleString("id-ID")}`}
              icon="payments"
              iconColor="text-primary"
              trend={{
                value: `${summary?.total_records ?? finances.length} transactions`,
                color: "text-green-600",
                icon: "trending_up",
              }}
            />
            <PaymentCard
              title="Active Records"
              value={activeCount.toString()}
              icon="verified"
              iconColor="text-green-700"
              trend={{
                value: `${summary ? ((activeCount / (summary.total_records || 1)) * 100).toFixed(0) : ((activeCount / (finances.length || 1)) * 100).toFixed(0)}% of total`,
                color: "text-green-700",
                icon: "trending_up",
              }}
            />
            <PaymentCard
              title="Inactive Records"
              value={inactiveCount.toString()}
              icon="warning"
              iconColor="text-orange-700"
              trend={{
                value: `${summary ? ((inactiveCount / (summary.total_records || 1)) * 100).toFixed(0) : ((inactiveCount / (finances.length || 1)) * 100).toFixed(0)}% of total`,
                color: "text-[#e73908]",
                icon: "trending_down",
              }}
            />
            <PaymentCard
              title="Page"
              value={`${meta.page} / ${meta.totalPages}`}
              icon="description"
              iconColor="text-blue-600"
              trend={{
                value: `${meta.total} total records`,
                color: "text-blue-600",
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
          <div className="flex flex-col gap-4 bg-surface-light dark:bg-surface-dark border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
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
                  <FinancePagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    totalResults={meta.total}
                    resultsPerPage={meta.limit}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Payment"
        message={`Are you sure you want to delete ${selectedFinance?.reference_number}?`}
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
        cancelText="Cancel"
        variant="danger"
      />

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

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import DetailInfo from "@/components/finance/detail-finance/detail-info";
import FinanceSummary from "@/components/finance/detail-finance/finance-summary";
import FlowFinance from "@/components/finance/detail-finance/flow";
import PaymentHistory from "@/components/finance/detail-finance/payment-history";
import { financeApi } from "@/lib/api/finances";
import type { FinanceItem } from "@/lib/types/finances";

interface FinanceDetailPageProps {
  id: string | null;
}

const FinanceDetailPage = ({ id }: FinanceDetailPageProps) => {
  const router = useRouter();
  const [finance, setFinance] = useState<FinanceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      financeApi
        .getDetail(id)
        .then((res) => {
          const item = (res as any)?.data ?? (res as any);
          if (item?.payer) {
            setFinance(item);
          } else {
            throw new Error("Invalid response");
          }
        })
        .catch(() => {
          financeApi
            .getById(id)
            .then((res) => {
              const item = (res as any)?.data ?? (res as any);
              if (item?.payer) {
                setFinance(item);
              }
            })
            .catch(() => setFinance(null));
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id, reloadKey]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-xl animate-spin">
                progress_activity
              </span>
              <span className="text-sm font-medium">
                Memuat detail pembayaran...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!finance) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard/finance")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">
                  arrow_back
                </span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Detail Pembayaran
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pembayaran tidak ditemukan
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">
              search_off
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Data pembayaran tidak ditemukan
            </p>
            <button
              onClick={() => router.push("/dashboard/finance")}
              className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Kembali ke Daftar Pembayaran
            </button>
          </div>
        </div>
      </div>
    );
  }

  const driverName = finance.driver
    ? `${finance.driver.first_name} ${finance.driver.last_name}`
    : finance.payer;

  return (
    <PermissionGuard permission="finance.read">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard/finance")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">
                  arrow_back
                </span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Detail Pembayaran
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {finance.reference_number} - {driverName}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <FinanceSummary finance={finance} />
            <DetailInfo finance={finance} />
            <div className="grid grid-cols-1 gap-6">
              <PaymentHistory
                finance={finance}
                onChanged={() => setReloadKey((k) => k + 1)}
              />
            </div>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
};
export default FinanceDetailPage;

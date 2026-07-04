"use client";
import { useState, useEffect } from "react";
import { PermissionGuard } from "@/components/auth-guard-permission";
import DetailInfo from "@/components/finance/detail-finance/detail-info";
import FinanceSummary from "@/components/finance/detail-finance/finance-summary";
import FlowFinance from "@/components/finance/detail-finance/flow";
import RecordCard from "@/components/finance/detail-finance/record";
import { financeApi } from "@/lib/api/finances";
import type { FinanceItem } from "@/lib/types/finances";

interface FinanceDetailPageProps {
  id: string | null;
}

const FinanceDetailPage = ({ id }: FinanceDetailPageProps) => {

  const [finance, setFinance] = useState<FinanceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          // fallback to regular getById
          financeApi.getById(id).then((res) => {
            const item = (res as any)?.data ?? (res as any);
            if (item?.payer) {
              setFinance(item);
            }
          }).catch(() => setFinance(null));
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="m-8 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!finance) {
    return (
      <div className="m-8 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 dark:text-slate-400">Finance record not found</p>
      </div>
    );
  }

  return (
    <PermissionGuard permission="finance.read">
    <div className="m-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-5">
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          <FinanceSummary finance={finance} />

          <DetailInfo finance={finance} />
        </div>

        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          <FlowFinance
            status={finance.is_active ? "completed" : "pending"}
          />
          <RecordCard />
        </div>
      </div>
    </div>
    </PermissionGuard>
  );
};
export default FinanceDetailPage;

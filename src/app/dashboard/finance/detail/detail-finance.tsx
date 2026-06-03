"use client";
import { useState, useEffect } from "react";
import DetailInfo from "@/components/finance/detail-finance/detail-info";
import FinanceSummary from "@/components/finance/detail-finance/finance-summry";
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
        .getById(id)
        .then((res) => {
          const item = (res?.data ?? res) as unknown as FinanceItem;
          if (!item?.payer) throw new Error("Invalid response");
          setFinance(item);
        })
        .catch(() => setFinance(null))
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
    <div className="m-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-5">
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          <FinanceSummary finance={finance} />

          <DetailInfo finance={finance} />
        </div>

        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          <FlowFinance />
          <RecordCard />
        </div>
      </div>
    </div>
  );
};
export default FinanceDetailPage;

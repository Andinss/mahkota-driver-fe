"use client";
import DetailInfo from "@/components/finance/detail-finance/detail-info";
import FinanceSummary from "@/components/finance/detail-finance/finance-summry";
import FlowFinance from "@/components/finance/detail-finance/flow";
import RecordCard from "@/components/finance/detail-finance/record";
import { PageHeader } from "@/components/page-header";

const FinanceDetailPage = () => {
  return (
    <div className="m-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-5">
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          <FinanceSummary />

          <DetailInfo />
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

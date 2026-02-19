import { Button } from "@/components/ui/button";

export const HistoryHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[#111418] dark:text-white text-3xl font-bold leading-tight">Vehicle Rental History</h1>
        <p className="text-[#617589] dark:text-[#93adc8] text-base font-normal">View detailed logs of vehicle usage, payments, and incidents.</p>
      </div>
      <Button icon="download" variant="secondary">
        Export Report
      </Button>
    </div>
  );
};

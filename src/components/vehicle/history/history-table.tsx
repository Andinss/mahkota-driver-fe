import { HistoryTableRow } from "./history-table-row";
import { Pagination } from "./pagination";

type RentalHistory = {
  vehicle: {
    name: string;
    plate: string;
    image: string;
    imageAlt: string;
  };
  driver: {
    name: string;
    image: string;
    imageAlt: string;
  };
  startDate: string;
  endDate: string;
  duration: string;
  paymentStatus: "paid" | "pending" | "refunded";
  maintenance?: {
    hasMaintenance: boolean;
    note?: string;
  };
};

interface HistoryTableProps {
  histories: RentalHistory[];
}

export const HistoryTable = ({ histories }: HistoryTableProps) => {
  return (
    <div className="bg-white dark:bg-[#1a2634] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3b4d] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] dark:bg-[#22303e] border-b border-[#e5e7eb] dark:border-[#2a3b4d]">
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#93adc8] min-w-[200px]">Vehicle</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#93adc8] min-w-[180px]">Driver</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#93adc8] min-w-[180px]">Rental Period</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#93adc8]">Duration</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#93adc8]">Payment</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#93adc8]">Maint.</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-[#93adc8] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-[#2a3b4d]">
            {histories.map((history, index) => (
              <HistoryTableRow key={index} history={history} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={1} totalPages={3} totalResults={24} resultsPerPage={5} />
    </div>
  );
};

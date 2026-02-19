import { PaymentBadge } from "./payment-badge";

interface RentalHistory {
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
}

interface HistoryTableRowProps {
  history: RentalHistory;
}

export const HistoryTableRow = ({ history }: HistoryTableRowProps) => {
  return (
    <tr className="hover:bg-[#f0f9ff] dark:hover:bg-[#2a3b4d]/50 transition-colors group">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg bg-cover bg-center shrink-0 border border-[#e5e7eb] dark:border-[#2a3b4d]"
            data-alt={history.vehicle.imageAlt}
            style={{ backgroundImage: `url("${history.vehicle.image}")` }}
          />
          <div>
            <p className="text-sm font-medium text-[#111418] dark:text-white">{history.vehicle.name}</p>
            <p className="text-xs text-[#617589] dark:text-[#93adc8]">{history.vehicle.plate}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-full bg-cover bg-center shrink-0"
            data-alt={history.driver.imageAlt}
            style={{ backgroundImage: `url("${history.driver.image}")` }}
          />
          <span className="text-sm text-[#111418] dark:text-white">{history.driver.name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="text-sm text-[#111418] dark:text-white font-medium">{history.startDate}</span>
          <span className="text-xs text-[#617589] dark:text-[#93adc8]">to {history.endDate}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-[#111418] dark:text-white">{history.duration}</span>
      </td>
      <td className="py-3 px-4">
        <PaymentBadge status={history.paymentStatus} />
      </td>
      <td className="py-3 px-4">
        {history.maintenance?.hasMaintenance ? (
          <div className="group/tooltip relative">
            <span className="material-symbols-outlined text-orange-500 cursor-help">build</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover/tooltip:block bg-black text-white text-xs rounded py-1 px-2 text-center z-10">
              {history.maintenance.note}
            </div>
          </div>
        ) : (
          <span className="material-symbols-outlined text-[#d1d5db] dark:text-[#4b5563]" title="No Maintenance">check_circle</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <button className="text-[#617589] hover:text-primary dark:text-[#93adc8] dark:hover:text-primary p-1 rounded-full hover:bg-[#f0f2f4] dark:hover:bg-[#2a3b4d] transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </td>
    </tr>
  );
};

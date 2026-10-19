"use client";

export type OutOfTownStatus = "pending" | "approved" | "rejected";

export interface OutOfTownRequest {
  id: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  vehicleName: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  reason: string;
  status: OutOfTownStatus;
  submittedAt: string;
  adminNote?: string | null;
}

interface OutOfTownTableRowProps {
  request: OutOfTownRequest;
  onSelect?: (request: OutOfTownRequest) => void;
}

/* Warna badge per status */
const statusConfig: Record<
  OutOfTownStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  },
};

export const OutOfTownTableRow = ({
  request,
  onSelect,
}: OutOfTownTableRowProps) => {
  const status = statusConfig[request.status] || statusConfig.pending;

  return (
    <tr
      onClick={() => onSelect?.(request)}
      className={`hover:bg-white dark:hover:bg-slate-800/30 transition-colors ${
        onSelect ? "cursor-pointer" : ""
      }`}
    >
      <td className="px-4 py-3">
        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate max-w-[160px]">
          {request.driverName}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
          {request.driverPhone}
        </p>
      </td>

      <td className="px-4 py-3">
        <p className="font-medium text-slate-900 dark:text-white text-sm truncate max-w-[160px]">
          {request.vehicleName}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-[160px]">
          {request.vehiclePlate}
        </p>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 text-base">
            location_on
          </span>
          <span className="text-sm text-slate-900 dark:text-white truncate max-w-[140px]">
            {request.destination}
          </span>
        </div>
      </td>

      <td className="px-4 py-3 text-sm text-slate-900 dark:text-white whitespace-nowrap">
        {request.departureDate} - {request.returnDate}
      </td>

      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
        {request.reason}
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${status.className}`}
        >
          {status.label}
        </span>
      </td>

      <td className="px-4 py-3 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(request);
          }}
          title="Lihat Detail"
          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            visibility
          </span>
        </button>
      </td>
    </tr>
  );
};

interface VehicleHistoryPaginationProps {
  totalVehicles: number;
  currentPage: number;
}

export function VehicleHistoryPagination({
  totalVehicles,
  currentPage,
}: VehicleHistoryPaginationProps) {
  return (
    <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
      <p className="text-sm text-slate-500">
        Showing 1 to {totalVehicles} of {totalVehicles} vehicles operated
      </p>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
          {currentPage}
        </button>
        <button
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold"
          disabled
        >
          Next
        </button>
      </div>
    </div>
  );
}

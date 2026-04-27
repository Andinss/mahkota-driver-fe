import { RentalTableRow } from "./rent-table-row";

interface Rental {
  transactionId: string;
  driver: {
    name: string;
    id: string;
    avatar?: string;
  };
  vehicle: {
    name: string;
    id: string;
  };
  rentalPeriod: {
    start: string;
    end: string;
    duration: number;
  };
  deposit: string;
  paymentStatus: string;
}

interface RentalTableProps {
  rentals: Rental[];
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
  resultsPerPage?: number;
  onEdit?: (rental: Rental) => void;
  onDelete?: (rental: Rental) => void;
  onDetails?: (rental: Rental) => void;
  onEndRental?: (rental: Rental) => void;
  onExport?: () => void;
}

export const RentalTable = ({
  rentals,
  currentPage = 1,
  totalPages = 6,
  totalResults = 142,
  resultsPerPage = 4,
  onEdit,
  onDelete,
  onDetails,
  onEndRental,
  onExport,
}: RentalTableProps) => {
  const startEntry = (currentPage - 1) * resultsPerPage + 1;
  const endEntry = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Rental Transactions
        </h2>
        <button
          onClick={onExport}
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
        >
          Export as CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Driver Details</th>
              <th className="px-6 py-4">Vehicle Info</th>
              <th className="px-6 py-4">Rental Period</th>
              <th className="px-6 py-4">Deposit</th>
              <th className="px-6 py-4">Payment Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {rentals.map((rental, index) => (
              <RentalTableRow
                key={rental.transactionId || index}
                rental={rental}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetails={onDetails}
                onEndRental={onEndRental}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

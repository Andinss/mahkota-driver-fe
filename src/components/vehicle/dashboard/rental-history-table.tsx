interface RentalHistory {
  id: string;
  vehicle: { name: string; plate: string };
  driver: string;
  period: string;
  amount: string;
  status: { label: string; color: string };
}

const rentalHistoryData: RentalHistory[] = [
  {
    id: "1",
    vehicle: { name: "Toyota Avanza", plate: "B 1234 XYZ" },
    driver: "John Doe",
    period: "Oct 24 - Oct 26",
    amount: "Rp 1,200,000",
    status: { label: "Paid", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  },
  {
    id: "2",
    vehicle: { name: "Mitsubishi Xpander", plate: "B 7890 JKL" },
    driver: "Michael Smith",
    period: "Oct 25 - Oct 28",
    amount: "Rp 2,500,000",
    status: { label: "Ongoing", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  },
  {
    id: "3",
    vehicle: { name: "Honda CR-V", plate: "B 2222 GHI" },
    driver: "Sarah Wilson",
    period: "Oct 22 - Oct 23",
    amount: "Rp 1,800,000",
    status: { label: "Pending", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  },
];

export function RentalHistoryTable() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden h-full shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 className="font-bold text-lg dark:text-white">
          Recent Rental History
        </h3>
        <button className="text-primary text-sm font-semibold hover:underline">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rentalHistoryData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold dark:text-white">
                      {item.vehicle.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.vehicle.plate}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.driver}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.period}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold dark:text-white">
                  {item.amount}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status.color}`}>
                    {item.status.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

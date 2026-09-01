interface DurationProps {
  startDate?: string;
  endDate?: string;
  dailyRate?: number;
  depositAmount?: number;
  duration?: number;
  methodPayment?: string;
  saldoDeducted?: number;
  serviceFee?: number;
  rentalDuration?: string;
  rentalService?: string;
}

const formatDate = (d?: string) => {
  if (!d) return "Aug 12, 2024";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const Duration = ({
  startDate = "Aug 12, 2024",
  endDate = "Aug 19, 2024",
  dailyRate = 245000,
  depositAmount = 500000,
  duration = 7,
  methodPayment,
  saldoDeducted,
  serviceFee = 25000,
  rentalDuration,
  rentalService,
}: DurationProps) => {
  const totalEst = dailyRate * duration + depositAmount + serviceFee;

  return (
    <div className="col-span-12 lg:col-span-7">
      <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 sm:p-8 shadow-md border border-gray-200 dark:border-gray-700 h-full">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            Duration & Rates
          </h3>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded">
            {duration} DAYS TOTAL
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center sm:text-left w-full">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
              Pick-up Date
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatDate(startDate)}</p>
            <p className="text-[10px] text-gray-500">09:00 AM • Jakarta HQ</p>
          </div>
          <div className="flex items-center justify-center px-4 rotate-90 sm:rotate-0">
            <div className="h-[1px] w-8 sm:w-12 bg-gray-300 relative">
              <div className="absolute -top-1 right-0 w-2.5 h-2.5 border-r border-t border-gray-400 rotate-45"></div>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-right w-full">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
              Expected Return
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatDate(endDate)}</p>
            <p className="text-[10px] text-gray-500">06:00 PM • Jakarta HQ</p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-gray-200 pt-8">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
              Daily Rate
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white">{formatCurrency(dailyRate)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
              Service Fee
            </p>
            <p className="text-xl font-black text-gray-900 dark:text-white">{formatCurrency(serviceFee)}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-200">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
              Est. Total
            </p>
            <p className="text-xl font-black text-blue-600">{formatCurrency(totalEst)}</p>
          </div>
        </div>
        {methodPayment && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-500 text-lg">
                  {methodPayment === "Saldo" ? "account_balance_wallet" : "payments"}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payment Method: <strong>{methodPayment}</strong>
                </span>
              </div>
              {methodPayment === "Saldo" && Number(saldoDeducted) > 0 && (
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  -{formatCurrency(Number(saldoDeducted))} from Saldo
                </span>
              )}
            </div>
          </div>
        )}
        {(rentalDuration || rentalService) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              {rentalDuration && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-500 text-lg">schedule</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipe: <strong className="capitalize">{rentalDuration}</strong>
                  </span>
                </div>
              )}
              {rentalService && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-500 text-lg">
                    {rentalService === "lepas kunci" ? "no_crash" : "person"}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Layanan: <strong className="capitalize">{rentalService}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Duration;

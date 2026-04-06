"use client";

interface SummaryProps {
  rentalData: {
    startDate: string;
    endDate: string;
    duration: number;
    dailyRate: number;
    depositAmount: number;
    serviceFee: number;
    vehicleId?: string;
    driverType?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const Summary = ({ rentalData, onConfirm, onCancel }: SummaryProps) => {
  const dailyRateTotal = rentalData.dailyRate * rentalData.duration;
  const totalRevenue =
    dailyRateTotal + rentalData.depositAmount + rentalData.serviceFee;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <div className="sticky top-8 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6 uppercase text-xs tracking-widest">
          Revenue Summary
        </h3>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">
              Daily Rate x {rentalData.duration || 0} Days
            </span>
            <span className="font-medium">
              {formatCurrency(dailyRateTotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Security Deposit</span>
            <span className="font-medium">
              {formatCurrency(rentalData.depositAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Service Fee</span>
            <span className="font-medium">
              {formatCurrency(rentalData.serviceFee)}
            </span>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1 uppercase">
              Total Estimated Revenue
            </div>
            <div className="text-3xl font-black text-primary">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">
              check_circle
            </span>
            Confirm Rental
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
        <div className="mt-6 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/40">
          <span className="material-symbols-outlined text-amber-500 text-lg">
            info
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Summary;

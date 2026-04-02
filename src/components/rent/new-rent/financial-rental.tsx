const FinancialRental = () => {
  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
          3
        </span>
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
          Financial Details
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Daily Rate (IDR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
              Rp
            </span>
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
              type="number"
              value="450000"
            />
          </div>
          <p className="text-[10px] text-slate-500 italic">
            *Auto-filled from vehicle data
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Deposit Amount (IDR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
              Rp
            </span>
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
              placeholder="500000"
              type="number"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Payment Method
          </label>
          <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all appearance-none">
            <option>Bank Transfer</option>
            <option>Cash</option>
            <option>Credit Card</option>
            <option>E-Wallet</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default FinancialRental;

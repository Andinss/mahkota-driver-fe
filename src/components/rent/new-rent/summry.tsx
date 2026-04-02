const Summary = () => {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      <div className="sticky top-8 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6 uppercase text-xs tracking-widest">
          Revenue Summary
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Daily Rate x Days</span>
            <span className="font-medium">Rp 2.250.000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Security Deposit</span>
            <span className="font-medium">Rp 500.000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Service Fee</span>
            <span className="font-medium">Rp 25.000</span>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1 uppercase">
              Total Estimated Revenue
            </div>
            <div className="text-3xl font-black text-primary">Rp 2.775.000</div>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <button className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xl">
              check_circle
            </span>
            Confirm Rental
          </button>
          <button className="w-full py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]">
            Cancel
          </button>
        </div>
        <div className="mt-6 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/40">
          <span className="material-symbols-outlined text-amber-500 text-lg">
            info
          </span>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-normal">
            Once confirmed, the vehicle status will change to <b>Occupied</b>{" "}
            and the driver will be notified.
          </p>
        </div>
      </div>
    </aside>
  );
};
export default Summary;

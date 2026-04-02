const Period = () => {
  return (
    <div>
      <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            2
          </span>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            Rental Period
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Start Date
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
              type="date"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              End Date
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
              type="date"
            />
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center border border-primary/20 h-[50px]">
            <div className="text-xs text-primary font-bold uppercase tracking-widest">
              Total Duration
            </div>
            <div className="text-xl font-black text-primary leading-none">
              5 Days
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Period;

const StatCard = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat Card 1 - Total Users */}
      <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Total Users
          </p>
          <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-[20px]">
            group
          </span>
        </div>
        <div className="flex items-end gap-2 mt-1">
          <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">
            1,240
          </p>
          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded flex items-center">
            <span className="material-symbols-outlined text-[12px] mr-0.5">
              trending_up
            </span>{" "}
            12%
          </span>
        </div>
      </div>

      {/* Stat Card 2 - Active Users */}
      <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Active Users
          </p>
          <span className="material-symbols-outlined text-emerald-500 bg-emerald-500/10 p-1.5 rounded-md text-[20px]">
            person_check
          </span>
        </div>
        <div className="flex items-end gap-2 mt-1">
          <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">
            980
          </p>
          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded flex items-center">
            <span className="material-symbols-outlined text-[12px] mr-0.5">
              trending_up
            </span>{" "}
            5%
          </span>
        </div>
      </div>

      {/* Stat Card 3 - Pending Approvals */}
      <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Pending Approvals
          </p>
          <span className="material-symbols-outlined text-amber-500 bg-amber-500/10 p-1.5 rounded-md text-[20px]">
            pending_actions
          </span>
        </div>
        <div className="flex items-end gap-2 mt-1">
          <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">
            12
          </p>
          <span className="text-amber-600 dark:text-amber-400 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded flex items-center">
            Requires Action
          </span>
        </div>
      </div>

      {/* Stat Card 4 - New Signups Today */}
      <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            New Signups Today
          </p>
          <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-[20px]">
            how_to_reg
          </span>
        </div>
        <div className="flex items-end gap-2 mt-1">
          <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">
            5
          </p>
          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded flex items-center">
            <span className="material-symbols-outlined text-[12px] mr-0.5">
              trending_up
            </span>{" "}
            1%
          </span>
        </div>
      </div>
    </section>
  );
};

export default StatCard;

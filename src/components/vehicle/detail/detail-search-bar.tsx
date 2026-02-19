export const DetailSearchBar = () => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex items-center gap-2 flex-1 min-w-[300px] max-w-lg">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">
              search
            </span>
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow shadow-sm"
            placeholder="Search by license plate, model, or ID..."
            type="text"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[20px]">
            filter_list
          </span>
          Filter
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Showing 1-10 of 77 vehicles
        </span>
        <div className="flex gap-1">
          <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-50">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

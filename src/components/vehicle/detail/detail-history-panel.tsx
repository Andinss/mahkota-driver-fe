export const DetailHistoryPanel = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col xl:col-span-1 h-fit sticky top-0">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
        <h3 className="font-bold text-slate-900 dark:text-white">
          Vehicle History
        </h3>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <span className="material-symbols-outlined text-[20px]">
            close
          </span>
        </button>
      </div>
      <div className="p-5 flex flex-col gap-6">
        {/* Quick Info */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="size-14 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <img
              alt="Icon representing current vehicle selection"
              className="size-10"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGVABOENFrrH6bqJLGqISblWlkueqStUp5pM4TLXKPY8U1hs4AfOIojGiiAuRd2NnrETUCLl6StwEUtHalKoPBFkH-CtCEh6sSI3-GbK8yJeotkcPvsqBkO3RX5z8qJrt5s1dRRkDXTWmFrYN9b8CgpnkTl7YmHGMHkqNg_DnsMmU8QX-Vh1G7J0tEetwwTLAT9PggbXTHyICZAZOQX_bWn1WZJOfb0_pmM0L6uabNPMYeSqwAfhJmFjLFtOY06vHc1OJZDpiCVRuG"
            />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-lg">
              Toyota Avanza
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
              B 1234 CD
            </p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Active
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex justify-center items-center gap-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">
              edit_note
            </span>
            Update Status
          </button>
          <button className="flex justify-center items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              visibility
            </span>
            View Details
          </button>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Activity Log
          </h4>
          <div className="relative pl-4 border-l border-slate-200 dark:border-slate-700 space-y-6">
            {/* Event 1 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-white dark:ring-slate-900"></div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Status changed to{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Available
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Today, 10:30 AM • By System Admin
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                Vehicle returned from maintenance. Checked and cleaned.
              </p>
            </div>
            {/* Event 2 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900"></div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Status changed to{" "}
                <span className="text-red-600 dark:text-red-400">
                  Maintenance
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Yesterday, 04:15 PM • By Technician A.
              </p>
            </div>
            {/* Event 3 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900"></div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Vehicle Retrieved
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Yesterday, 03:00 PM • By Driver John
              </p>
            </div>
          </div>
          <button className="w-full mt-6 text-xs text-slate-500 dark:text-slate-400 hover:text-primary hover:underline text-center">
            View full history
          </button>
        </div>
      </div>
    </div>
  );
};

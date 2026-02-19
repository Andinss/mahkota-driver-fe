export function MaintenanceTrendsChart() {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg dark:text-white">
            Maintenance Trends
          </h3>
          <p className="text-xs text-gray-500">
            Service requests over last 30 days
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
            Monthly
          </button>
          <button className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-lg">
            Last 30 Days
          </button>
        </div>
      </div>
      <div className="h-[200px] flex items-end justify-between gap-2 px-2">
        <div className="w-full bg-primary/20 rounded-t-sm h-[30%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[45%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[20%]"></div>
        <div className="w-full bg-primary rounded-t-sm h-[65%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[40%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[55%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[35%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[70%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[25%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[50%]"></div>
        <div className="w-full bg-primary rounded-t-sm h-[85%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[30%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[60%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[45%]"></div>
        <div className="w-full bg-primary/20 rounded-t-sm h-[20%]"></div>
      </div>
      <div className="mt-4 flex justify-between px-2">
        <span className="text-[10px] font-medium text-gray-400">
          1 Oct
        </span>
        <span className="text-[10px] font-medium text-gray-400">
          10 Oct
        </span>
        <span className="text-[10px] font-medium text-gray-400">
          20 Oct
        </span>
        <span className="text-[10px] font-medium text-gray-400">
          30 Oct
        </span>
      </div>
    </div>
  );
}

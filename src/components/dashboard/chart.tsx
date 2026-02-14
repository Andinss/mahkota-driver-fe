const ChartCard = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-5">
      {/* Chart Section */}
      <div className="xl:col-span-2 flex flex-col rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">
              User Registration Growth
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                145
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                New Users (Last 30 Days)
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/50 outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="flex-1 w-full min-h-[250px] relative mt-2">
          {/* SVG Chart Representation */}
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 800 200"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#137fec" stopOpacity="0.2"></stop>
                <stop offset="100%" stopColor="#137fec" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <line
              className="dark:stroke-slate-700"
              stroke="#e2e8f0"
              strokeDasharray="4"
              x1="0"
              x2="800"
              y1="150"
              y2="150"
            ></line>
            <line
              className="dark:stroke-slate-700"
              stroke="#e2e8f0"
              strokeDasharray="4"
              x1="0"
              x2="800"
              y1="100"
              y2="100"
            ></line>
            <line
              className="dark:stroke-slate-700"
              stroke="#e2e8f0"
              strokeDasharray="4"
              x1="0"
              x2="800"
              y1="50"
              y2="50"
            ></line>
            {/* Area Path */}
            <path
              d="M0,150 C50,140 100,100 150,110 C200,120 250,80 300,70 C350,60 400,90 450,80 C500,70 550,40 600,50 C650,60 700,30 750,20 L800,10 V200 H0 Z"
              fill="url(#chartGradient)"
            ></path>
            {/* Line Path */}
            <path
              d="M0,150 C50,140 100,100 150,110 C200,120 250,80 300,70 C350,60 400,90 450,80 C500,70 550,40 600,50 C650,60 700,30 750,20 L800,10"
              fill="none"
              stroke="#137fec"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            ></path>
            {/* Data Points */}
            <circle
              cx="150"
              cy="110"
              fill="white"
              r="4"
              stroke="#137fec"
              strokeWidth="2"
            ></circle>
            <circle
              cx="300"
              cy="70"
              fill="white"
              r="4"
              stroke="#137fec"
              strokeWidth="2"
            ></circle>
            <circle
              cx="450"
              cy="80"
              fill="white"
              r="4"
              stroke="#137fec"
              strokeWidth="2"
            ></circle>
            <circle
              cx="600"
              cy="50"
              fill="white"
              r="4"
              stroke="#137fec"
              strokeWidth="2"
            ></circle>
            <circle
              cx="800"
              cy="10"
              fill="white"
              r="4"
              stroke="#137fec"
              strokeWidth="2"
            ></circle>
          </svg>
        </div>
        <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium px-2">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="xl:col-span-1 flex flex-col gap-4">
        <div className="rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm p-6 h-full">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-5">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
            <button className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">person_add</span>
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-medium text-sm">
                  Add New User
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Register manually
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left">
              <div className="size-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">lock_reset</span>
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-medium text-sm">
                  Reset Password
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Send recovery email
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left">
              <div className="size-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">
                  manage_accounts
                </span>
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-medium text-sm">
                  Edit Roles
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Manage permissions
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left">
              <div className="size-10 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">summarize</span>
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-medium text-sm">
                  View Audit Logs
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Track system changes
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;

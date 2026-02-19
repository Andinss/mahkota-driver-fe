const VehicleSidebar = () => {
  return (
    <aside className="flex w-64 h-screen flex-col justify-between border-r border-slate-200 bg-white dark:border-slate-800 p-4 dark:bg-slate-900 transition-colors duration-200">
      <div className="flex flex-col gap-4">
        {/* Logo Section */}
        <div className="flex gap-3 px-2 py-2">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 bg-primary/10 flex items-center justify-center text-primary"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCayM1M4BEeHDgBMWOgZ-6uVXx5vWpf8Q0WTsKUzvldl1p7wGBhz8LOrA1xzQNa269xSDgExCrWIrwoyLvM_3e_4BQCB9or-J0tXoN1CKS_9V60GlgcOacU_zYTvYR9QisxOJcc87ZQ43di2V_uNl_S_n_zIBHNpjR2aerjOR1V_O5YVIRFBfStuhKBHCVFmWao5vX2Jlskc_9f6q9bh5nf8656za2up0uFQRefaGYj9lwf6wFRS_3wSLaM4QeNLnrsqR1SoqmWGGQ4")',
            }}
          ></div>
          <div className="flex flex-col justify-center">
            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">
              Fleet Admin
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
              Vehicle Management
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary"
            href="/dashboard/vehicle"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            href="/dashboard/vehicle/management"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              directions_car
            </span>
            <p className="text-sm font-medium leading-normal">Vehicles</p>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            href="/dashboard/vehicle/history"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              history
            </span>
            <p className="text-sm font-medium leading-normal">
              Vehicle History
            </p>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">build</span>
            <span className="text-sm font-medium">Maintenance</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="text-sm font-medium">Reports</span>
          </a>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-1 border-t border-slate-200 dark:border-slate-800 pt-4">
        <a
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          href="/dashboard"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <p className="text-sm font-medium leading-normal">
            Back to Dashboard
          </p>
        </a>
      </div>
    </aside>
  );
};

export default VehicleSidebar;

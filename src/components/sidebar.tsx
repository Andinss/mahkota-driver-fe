const Sidebar = () => {
  return (
    <aside className="flex w-64 h-screen flex-col justify-between border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 px-2 py-2">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 bg-primary/10 flex items-center justify-center text-primary"
            data-alt="Abstract geometric logo in blue"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCayM1M4BEeHDgBMWOgZ-6uVXx5vWpf8Q0WTsKUzvldl1p7wGBhz8LOrA1xzQNa269xSDgExCrWIrwoyLvM_3e_4BQCB9or-J0tXoN1CKS_9V60GlgcOacU_zYTvYR9QisxOJcc87ZQ43di2V_uNl_S_n_zIBHNpjR2aerjOR1V_O5YVIRFBfStuhKBHCVFmWao5vX2Jlskc_9f6q9bh5nf8656za2up0uFQRefaGYj9lwf6wFRS_3wSLaM4QeNLnrsqR1SoqmWGGQ4")',
            }}
          ></div>
          <div className="flex flex-col justify-center">
            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">
              PT XYZ Admin
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
              Rental System
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-colors"
            href="/dashboard"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <p className="text-sm font-medium leading-normal">Dashboard</p>
          </a>

          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              people
            </span>
            <p className="text-sm font-medium leading-normal">
              User Management
            </p>
          </a>

          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              verified_user
            </span>
            <p className="text-sm font-medium leading-normal">
              Roles &amp; Permissions
            </p>
          </a>

          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              badge
            </span>
            <p className="text-sm font-medium leading-normal">
              Driver Management
            </p>
          </a>

          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            href="/dashboard/vehicle"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              directions_car
            </span>
            <p className="text-sm font-medium leading-normal">
              Vehicle Management
            </p>
          </a>

          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              settings
            </span>
            <p className="text-sm font-medium leading-normal">Settings</p>
          </a>
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t border-slate-200 dark:border-slate-800 pt-4">
        <a
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          href="#"
        >
          <span className="material-symbols-outlined">logout</span>
          <p className="text-sm font-medium leading-normal">Logout</p>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;

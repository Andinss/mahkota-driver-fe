const Topbar = () => {
  return (
    <header className="flex flex-col gap-1 p-7 mt-2">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal mt-1">
            Welcome back, Administrator. Here is an overview of user activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white w-64 shadow-sm"
              placeholder="Search users..."
              type="text"
            />
          </div>
          <button className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors relative">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
              notifications
            </span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-slate-200 dark:border-slate-700"></span>
          </button>
          <div
            className="size-10 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700"
            data-alt="Admin user profile avatar"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBWlskkdFoTQprusiYVu7an4AXhl_9-FDQvUqoV7CfJSu11thcCE5vg56M68qimVlCi6UKLy0TemBcJADCyasSX01GUoGRkbawpjU1ZmAMY-Q3l5L8MipeG8HQfoPZ7oLbMtatSz_6mnssWAwAAQC7qn7FDiraGFp_qcQ2JBGyR0Esxy0mOpcPFgg_qckqazyxa9aCAwYO9nZE9cDtkWMv81L4VX6zliMkx7Y5fj1RwV8KCuCKEGshMHI6DMr3a54zGOa8-eyg_jWH")',
            }}
          ></div>
        </div>
      </div>
    </header>
  );
};
export default Topbar;

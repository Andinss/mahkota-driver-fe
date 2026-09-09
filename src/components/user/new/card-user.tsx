const CardUser = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-violet-500 text-xl">info</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Informasi Penting
          </h3>
          <p className="text-xs text-slate-400">Hal yang perlu diperhatikan saat membuat user</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          <span className="material-symbols-outlined text-blue-500">verified_user</span>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Permissions</h4>
          <p className="text-xs text-slate-500 leading-normal">
            System defaults for the selected role will be applied. You can customize them in &apos;Role Settings&apos;.
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          <span className="material-symbols-outlined text-blue-500">lock_reset</span>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Initial Password</h4>
          <p className="text-xs text-slate-500 leading-normal">
            The user will be prompted to set a secure password upon their first login attempt via email.
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          <span className="material-symbols-outlined text-blue-500">monitoring</span>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Audit Tracking</h4>
          <p className="text-xs text-slate-500 leading-normal">
            This action will be logged in the system audit logs for security and compliance purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardUser;
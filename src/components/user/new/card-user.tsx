const CardUser = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-3">
        <span className="material-symbols-outlined text-blue-600">verified_user</span>
        <h4 className="text-sm font-bold">Permissions</h4>
        <p className="text-xs text-slate-500 leading-normal">
          System defaults for the selected role will be applied. You can customize them in 'Role Settings'.
        </p>
      </div>
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-3">
        <span className="material-symbols-outlined text-blue-600">lock_reset</span>
        <h4 className="text-sm font-bold">Initial Password</h4>
        <p className="text-xs text-slate-500 leading-normal">
          The user will be prompted to set a secure password upon their first login attempt via email.
        </p>
      </div>
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-3">
        <span className="material-symbols-outlined text-blue-600">monitoring</span>
        <h4 className="text-sm font-bold">Audit Tracking</h4>
        <p className="text-xs text-slate-500 leading-normal">
          This action will be logged in the system audit logs for security and compliance purposes.
        </p>
      </div>
    </div>
  );
};

export default CardUser;
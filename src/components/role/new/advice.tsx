const Advice = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-amber-500 text-xl">tips_and_updates</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Security Best Practices
          </h3>
          <p className="text-xs text-slate-400">Panduan keamanan untuk pengelolaan role</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        Always follow the principle of least privilege. Only grant permissions
        that are strictly necessary for the employee&apos;s daily tasks.
      </p>
    </div>
  );
};
export default Advice;

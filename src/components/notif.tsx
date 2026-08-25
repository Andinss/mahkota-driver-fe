import Link from "next/link";

export const DropdownNotif = () => {
  return (
    <div className="absolute right-0 top-12 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white">
          Notifications
        </h3>
        <button className="text-xs font-semibold text-primary hover:underline">
          Mark all as read
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        <div className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3">
          <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">
              warning
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-tight">
              Vehicle B 1234 ABC is due for maintenance.
            </p>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Status: Important
            </span>
          </div>
        </div>

        <div className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">
              person_add
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-tight">
              Driver Bambang Wijaya completed registration.
            </p>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Status: Success
            </span>
          </div>
        </div>

        <div className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
              bookmark
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-tight">
              New rental booking for Toyota Camry.
            </p>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Status: Info
            </span>
          </div>
        </div>
      </div>
      <Link href="/dashboard/notification">
        <button className="w-full py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary bg-slate-50 dark:bg-slate-800/30 transition-colors">
          View All Notifications
        </button>
      </Link>
    </div>
  );
};

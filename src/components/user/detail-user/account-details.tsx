import type { UserItem } from "@/lib/types/user";

interface AccountDetailsProps {
  user: UserItem;
}

const AccountDetails = ({ user }: AccountDetailsProps) => {
  return (
    <div className="bg-white dark:bg-[#1a2632] p-6 lg:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h4 className="text-[0.7rem] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
        <span className="w-4 h-px bg-gray-300 dark:bg-slate-600"></span> Account
        Details
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase">
            Created At
          </label>
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-transparent focus-within:border-blue-300 transition-all">
            <span className="material-symbols-outlined text-blue-600 text-sm">
              calendar_month
            </span>
            <span className="font-medium text-sm lg:text-base text-gray-900 dark:text-white">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase">
            Updated At
          </label>
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-transparent focus-within:border-blue-300 transition-all">
            <span className="material-symbols-outlined text-blue-600 text-sm">
              update
            </span>
            <span className="font-medium text-sm lg:text-base text-gray-900 dark:text-white">
              {user.updated_at
                ? new Date(user.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase">
            Role Code
          </label>
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-transparent focus-within:border-blue-300 transition-all">
            <span className="material-symbols-outlined text-blue-600 text-sm">
              code
            </span>
            <span className="font-medium text-sm lg:text-base text-gray-900 dark:text-white">
              {user.role?.code || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;

import { Button } from "@/components/ui/button";
import type { UserItem } from "@/lib/types/user";

interface ProfileCardProps {
  user: UserItem;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const initial = (user.fullname || user.username).charAt(0).toUpperCase();

  return (
    <div className="col-span-12 lg:col-span-4 xl:col-span-3 bg-white dark:bg-[#1a2632] p-6 lg:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
      <div className="relative inline-block mb-6">
        <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 mx-auto bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
          <span className="text-5xl font-bold text-gray-500 dark:text-gray-400">
            {initial}
          </span>
        </div>
        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
      </div>
      <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white mb-1">
        {user.fullname || user.username}
      </h3>
      <p className="text-blue-600 font-bold text-xs lg:text-sm mb-8 uppercase tracking-[0.15em]">
        {user.role?.name || "N/A"}
      </p>
      <div className="space-y-3 mb-8">
        <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
          <p className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase">
            Username
          </p>
          <span className="text-xs lg:text-sm font-bold text-gray-900 dark:text-white">
            {user.username}
          </span>
        </div>
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
          <span className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase">
            Status
          </span>
          <span className={`px-2 py-0.5 rounded text-[0.65rem] font-black uppercase ${user.is_active ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
            {user.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <Button icon="settings">Manage User</Button>
        <Button icon="block">{user.is_active ? "Deactivate" : "Activate"}</Button>
      </div>
    </div>
  );
};

export default ProfileCard;

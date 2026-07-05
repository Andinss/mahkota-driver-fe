import { Button } from "@/components/ui/button";
import type { UserItem } from "@/lib/types/user";

interface ProfileCardProps {
  user: UserItem;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const initial = (user.fullname || user.username).charAt(0).toUpperCase();

  return (
    <div className="col-span-12 lg:col-span-4 xl:col-span-3 bg-white dark:bg-[#1a2632] p-6 lg:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center transition-all duration-200 hover:shadow-md">
      {/* Avatar Section */}
      <div className="relative flex justify-center mb-6">
        <div className="relative inline-block">
          <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
            <span className="text-5xl lg:text-6xl font-bold text-gray-600 dark:text-gray-300 select-none">
              {initial}
            </span>
          </div>
          <button
            className="absolute -bottom-1 -right-1 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#1a2632]"
            aria-label="Edit profile"
          >
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
        </div>
      </div>

      {/* User Info */}
      <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white mb-1 truncate">
        {user.fullname || user.username}
      </h3>
      <p className="text-blue-600 dark:text-blue-400 font-bold text-xs lg:text-sm mb-8 uppercase tracking-[0.15em]">
        {user.role?.name || "N/A"}
      </p>

      {/* Details Grid */}
      <div className="space-y-3 mb-8">
        <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg transition-colors duration-200">
          <p className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Username
          </p>
          <span className="text-xs lg:text-sm font-bold text-gray-900 dark:text-white">
            {user.username}
          </span>
        </div>

        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg transition-colors duration-200">
          <span className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Status
          </span>
          <span
            className={`
            px-2.5 py-0.5 rounded-full text-[0.65rem] font-black uppercase tracking-wide
            ${
              user.is_active
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }
          `}
          >
            {user.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          icon="settings"
          className="w-full justify-center font-bold transition-all duration-200 hover:shadow-md"
        >
          Manage User
        </Button>
        <Button
          icon="block"
          // variant={user.is_active ? "destructive" : "default"}
          className="w-full justify-center font-bold transition-all duration-200 hover:shadow-md"
        >
          {user.is_active ? "Deactivate" : "Activate"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;

import type { UserItem } from "@/lib/types/user";

interface ContactInformationProps {
  user: UserItem;
}

const ContactInformation = ({ user }: ContactInformationProps) => {

  const isDriver = user.role?.name?.toLowerCase() === "driver";

  return (
    <div className="bg-white dark:bg-[#1a2632] p-6 lg:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h4 className="text-[0.7rem] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
        <span className="w-4 h-px bg-gray-300 dark:bg-slate-600"></span> Contact Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase">
            Email Address
          </label>
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-transparent focus-within:border-blue-300 transition-all">
            <span className="material-symbols-outlined text-blue-600 text-sm">
              mail
            </span>
            <span className="font-medium text-sm lg:text-base text-gray-900 dark:text-white">
              {user.email}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase">
            Username
          </label>
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-transparent focus-within:border-blue-300 transition-all">
            <span className="material-symbols-outlined text-blue-600 text-sm">
              person
            </span>
            <span className="font-medium text-sm lg:text-base text-gray-900 dark:text-white">
              {user.username}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase">
            Role
          </label>
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-transparent focus-within:border-blue-300 transition-all">
            <span className="material-symbols-outlined text-blue-600 text-sm">
              shield
            </span>
            <span className="font-medium text-sm lg:text-base text-gray-900 dark:text-white">
              {user.role?.name || "N/A"}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase">
            Full Name
          </label>
          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-transparent focus-within:border-blue-300 transition-all">
            <span className="material-symbols-outlined text-blue-600 text-sm">
              badge
            </span>
            <span className="font-medium text-sm lg:text-base text-gray-900 dark:text-white">
              {user.fullname || "-"}
            </span>
          </div>
        </div>

        {isDriver && user.phoneNumber && (
          <div className="space-y-2">
            <label className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase">
              Phone Number
            </label>
            <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-transparent focus-within:border-blue-300 transition-all">
              <span className="material-symbols-outlined text-blue-600 text-sm">
                phone
              </span>
              <span className="font-medium text-sm lg:text-base text-gray-900 dark:text-white">
                {user.phoneNumber || "-"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInformation;

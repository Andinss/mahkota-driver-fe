"use client";
import { Input } from "@/components/ui/input";

interface GeneralInformationProps {
  roleName: string;
  setRoleName: (value: string) => void;
  roleDescription: string;
  setRoleDescription: (value: string) => void;
  error?: string;
}

const GeneralInformation = ({
  roleName,
  setRoleName,
  roleDescription,
  setRoleDescription,
  error
}: GeneralInformationProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">badge</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Informasi Umum
          </h3>
          <p className="text-xs text-slate-400">Masukkan detail informasi role</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            htmlFor="role-name"
          >
            Role Name <span className="text-red-500">*</span>
          </label>
          <Input
            className="w-full bg-gray-50 dark:bg-[#1a2632] border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2.5 px-4 text-sm transition-all"
            id="role-name"
            placeholder="e.g. Senior Supervisor"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
            error={error}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            htmlFor="role-desc"
          >
            Description (Optional)
          </label>
          <textarea
            className={`w-full rounded-lg border bg-white dark:bg-[#1a2632] px-3 py-2 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary h-auto border-[#dbe0e6] dark:border-[#4b5563]`}
            placeholder="Enter role description"
            id="role-desc"
            rows={2}
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
export default GeneralInformation;

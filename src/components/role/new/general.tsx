import { Input } from "@/components/ui/input";

const GeneralInformation = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-blue-600">badge</span>
        General Information
      </h2>
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1.5"
            htmlFor="role-name"
          >
            Role Name
          </label>
          <Input
            className="w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2.5 px-4 text-sm transition-all"
            id="role-name"
            placeholder="e.g. Senior Supervisor"
            type="text"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1.5"
            htmlFor="role-desc"
          >
            Description (Optional)
          </label>
          <textarea
            className="w-full rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-3 py-2 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary h-auto"
            placeholder="Enter full permanent address including city, state, and zip code"
            name="permanentAddress"
            id="permanentAddress"
            rows={2}
            required
          />
        </div>
      </div>
    </div>
  );
};
export default GeneralInformation;

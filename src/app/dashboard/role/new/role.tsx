import Advice from "@/components/role/new/advice";
import GeneralInformation from "@/components/role/new/general";
import RoleHierarchy from "@/components/role/new/hierarchy";
import Permission from "@/components/role/new/permission";

const RolePage = () => {
  return (
    <div className="m-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Add New Role
          </h1>
          <p className="text-gray-500 mt-1">
            Configure system-wide access levels and permissions for PT XYZ
            staff.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <GeneralInformation />
          <Permission />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <RoleHierarchy />

          <Advice />
        </div>
      </div>

      <div className="mt-12 mb-8 flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl shadow-lg sticky bottom-8 z-10">
        <div className="hidden sm:block">
          <p className="text-xs text-gray-500">Last saved: Never (Draft)</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors active:opacity-80">
            Cancel
          </button>
          <button className="flex-1 sm:flex-none px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 hover:opacity-90 transition-all active:scale-[0.98]">
            Save Role
          </button>
        </div>
      </div>
    </div>
  );
};
export default RolePage;

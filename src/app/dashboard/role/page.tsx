"use client";
import { PageHeader } from "@/components/page-header";

const RolePage = () => {
  return (
    <div className="m-8">
      <PageHeader
        title="Role Management"
        description="Manage roles and permissions for users in the system."
        buttonText="Add New Role"
        buttonHref="/dashboard/role/new"
      />
      <div className="bg-white rounded-2xl border border-gray-200 mt-5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Role Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                  View Dashboards
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                  Manage Payments
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                  Manage Drivers
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                  Assign Vehicles
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                  Vehicle Retrieval
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                  User Management
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-bold text-gray-900">Owner</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-bold text-gray-900">Finance</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-emerald-500 font-bold">
                    check_circle
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-gray-300">
                    do_not_disturb_on
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-gray-300">
                    do_not_disturb_on
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-gray-300">
                    do_not_disturb_on
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-tight">
                    Read Only
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="font-bold text-gray-900">Supervisor</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-emerald-500 font-bold">
                    check_circle
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-tight">
                    Read Only
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-emerald-500 font-bold">
                    check_circle
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-tight">
                    Read Only
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="font-bold text-gray-900">
                      Field Officer
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-tight">
                    Read Only
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-gray-300">
                    do_not_disturb_on
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-tight">
                    Read Only
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-emerald-500 font-bold">
                    check_circle
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-gray-300">
                    do_not_disturb_on
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                    <span className="font-bold text-gray-900">
                      Administrator
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
                    Full Access
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden h-full flex flex-col justify-between">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Role Security Protocol
              </h3>
              <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                Managing permissions requires dual-factor authentication for
                sensitive role changes. All permission modifications are logged
                in the Activity Audit trail.
              </p>
            </div>
            <div className="mt-8 relative z-10">
              <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-white px-6 py-2.5 rounded-xl font-medium text-sm">
                Review Security Logs
              </button>
            </div>

            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <span className="material-symbols-outlined text-9xl">
                shield_lock
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Total Users</h4>
                <p className="text-2xl font-black text-blue-600 tracking-tighter">
                  1,284
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
              <span>Last 30 Days</span>
              <span className="text-emerald-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
                +12%
              </span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Active Roles</h4>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">
                  5
                </p>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-5/6"></div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
              Utilization Capacity 84%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RolePage;

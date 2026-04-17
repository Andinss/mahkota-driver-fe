"use client";
export default function RoleList () {
    return (
<div>


{/* Page Canvas */} 
<div className="p-8 max-w-7xl mx-auto">
  {/* Breadcrumbs */}
  <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
    <span>Home</span>
    <span className="material-symbols-outlined text-xs">chevron_right</span>
    <span>Settings</span>
    <span className="material-symbols-outlined text-xs">chevron_right</span>
    <span className="text-blue-600 font-medium">Users</span>
  </nav>

  {/* Header Section */}
  <div className="flex justify-between items-end mb-8">
    <div>
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Management</h2>
      <p className="text-slate-500 mt-1">Configure global access controls and administrative privileges.</p>
    </div>
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
      <span className="material-symbols-outlined text-lg">add</span>
      <span>Add New Role</span>
    </button>
  </div>

  {/* Tabs */}
  <div className="border-b border-slate-200 dark:border-slate-800 mb-8 flex items-center gap-8">
    <a className="pb-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors relative" href= "/dashboard/user-management">
      User List
    </a>
    <button className="pb-4 text-sm font-bold text-blue-600 relative">
      Roles &amp; Permissions
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>
    </button>
    <button className="pb-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors relative">
      Activity Log
    </button>
  </div>

  {/* Permissions Table (Bento Style Card) */}
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-slate-800/50">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Role Name</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-center">View Dashboards</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-center">Manage Payments</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-center">Manage Drivers</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-center">Assign Vehicles</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-center">Vehicle Retrieval</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-center">User Management</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {/* Owner Role */}
          <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="font-bold text-slate-900 dark:text-white">Owner</span>
              </div>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
           </tr>

          {/* Finance Role */}
          <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="font-bold text-slate-900 dark:text-white">Finance</span>
              </div>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="material-symbols-outlined text-emerald-500 font-bold" data-weight="fill">check_circle</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="material-symbols-outlined text-slate-200">do_not_disturb_on</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="material-symbols-outlined text-slate-200">do_not_disturb_on</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="material-symbols-outlined text-slate-200">do_not_disturb_on</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-tight">Read Only</span>
             </td>
           </tr>

          {/* Supervisor Role */}
          <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="font-bold text-slate-900 dark:text-white">Supervisor</span>
              </div>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="material-symbols-outlined text-emerald-500 font-bold" data-weight="fill">check_circle</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-tight">Read Only</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="material-symbols-outlined text-emerald-500 font-bold" data-weight="fill">check_circle</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-tight">Read Only</span>
             </td>
           </tr>

          {/* Field Officer Role */}
          <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="font-bold text-slate-900 dark:text-white">Field Officer</span>
              </div>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-tight">Read Only</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="material-symbols-outlined text-slate-200">do_not_disturb_on</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-tight">Read Only</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="material-symbols-outlined text-emerald-500 font-bold" data-weight="fill">check_circle</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="material-symbols-outlined text-slate-200">do_not_disturb_on</span>
             </td>
           </tr>

          {/* Administrator Role */}
          <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                <span className="font-bold text-slate-900 dark:text-white">Administrator</span>
              </div>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
            <td className="px-6 py-5 text-center">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">Full Access</span>
             </td>
           </tr>
        </tbody>
       </table>
    </div>
  </div>

  {/* Role Insights (Asymmetric Layout) */}
  <div className="mt-12 grid grid-cols-12 gap-6">
    <div className="col-span-12 lg:col-span-7">
      <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden h-full flex flex-col justify-between">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4">Role Security Protocol</h3>
          <p className="text-blue-100 text-lg leading-relaxed max-w-md">
            Managing permissions requires dual-factor authentication for sensitive role changes. All permission modifications are logged in the Activity Audit trail.
          </p>
        </div>
        <div className="mt-8 relative z-10">
          <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-white px-6 py-2.5 rounded-xl font-medium text-sm">
            Review Security Logs
          </button>
        </div>
        {/* Abstract Graphic */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <span className="material-symbols-outlined text-9xl">shield_lock</span>
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
            <p className="text-2xl font-black text-blue-600 tracking-tighter">1,284</p>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
          <span>Last 30 Days</span>
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
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
            <p className="text-2xl font-black text-slate-900 tracking-tighter">5</p>
          </div>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-5/6"></div>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Utilization Capacity 84%</p>
      </div>
    </div>
  </div>
</div>
</div>

    );
}
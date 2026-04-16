
export default function UserList () {
    return(
        <div className="m-8">
        {/* Page Heading */}
<div className="flex flex-wrap justify-between items-end gap-4 mb-6">
  <div className="flex flex-col gap-1">
    <h1 className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">User Management</h1>
    <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">Manage system access, roles, and permissions for employees.</p>
  </div>
  <button className="flex items-center gap-2 cursor-pointer rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal transition-all shadow-md active:scale-95">
    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>add</span>
    <span className="truncate">Add New User</span>
  </button>
</div>

{/* Tabs */}
<div className="flex gap-8">
<a className="flex items-center justify-center border-b-[3px] border-primary text-[#111418] dark:text-white pb-3 px-1 cursor-pointer" href="#">
<p className="text-sm font-bold leading-normal tracking-[0.015em]">User List</p>
</a>
<a className="flex items-center justify-center border-b-[3px] border-transparent text-[#617589] dark:text-gray-400 hover:text-primary transition-colors pb-3 px-1 cursor-pointer" href="#">
<p className="text-sm font-medium leading-normal tracking-[0.015em]">Roles &amp; Permissions</p>
</a>
<a className="flex items-center justify-center border-b-[3px] border-transparent text-[#617589] dark:text-gray-400 hover:text-primary transition-colors pb-3 px-1 cursor-pointer" href="#">
<p className="text-sm font-medium leading-normal tracking-[0.015em]">Activity Log</p>
</a>
</div>

{/* Scrollable Content */}
<div className="flex-1 overflow-y-auto p-8">
  {/* Filters & Search Toolbar */}
  <div className="flex flex-wrap items-end gap-4 mb-6 bg-white dark:bg-[#111418] p-4 rounded-xl border border-[#dbe0e6] dark:border-gray-800 shadow-sm">
    <label className="flex flex-col min-w-64 flex-1">
      <p className="text-[#111418] dark:text-gray-300 text-sm font-semibold leading-normal pb-2">Search Users</p>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#617589]">
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>search</span>
        </span>
        <input className="w-full rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#111418] dark:text-white h-11 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-[#617589]" placeholder="Search by name, email, or ID..." defaultValue=""/>
      </div>
    </label>
    
    <label className="flex flex-col w-48">
      <p className="text-[#111418] dark:text-gray-300 text-sm font-semibold leading-normal pb-2">Role</p>
      <div className="relative">
        <select className="w-full appearance-none rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#111418] dark:text-white h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
          <option value="">All Roles</option>
          <option value="admin">Administrator</option>
          <option value="manager">Fleet Manager</option>
          <option value="staff">Staff</option>
          <option value="driver">Driver</option>
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#617589]">
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>expand_more</span>
        </span>
      </div>
    </label>
    
    <label className="flex flex-col w-48">
      <p className="text-[#111418] dark:text-gray-300 text-sm font-semibold leading-normal pb-2">Status</p>
      <div className="relative">
        <select className="w-full appearance-none rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#111418] dark:text-white h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="locked">Locked</option>
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#617589]">
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>expand_more</span>
        </span>
      </div>
    </label>
    
    <button className="h-11 px-4 rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#617589] dark:text-gray-300 hover:bg-[#f0f2f4] dark:hover:bg-gray-700 hover:text-[#111418] font-medium text-sm transition-colors flex items-center gap-2">
      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>filter_list</span>
      More Filters
    </button>
  </div>

  {/* Users Table */}
  <div className="bg-white dark:bg-[#111418] rounded-xl border border-[#dbe0e6] dark:border-gray-800 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f9fafb] dark:bg-gray-900 border-b border-[#dbe0e6] dark:border-gray-800">
            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#617589] dark:text-gray-400 w-12">
              <input className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
            </th>
            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#617589] dark:text-gray-400">User</th>
            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#617589] dark:text-gray-400">Role</th>
            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#617589] dark:text-gray-400">Status</th>
            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#617589] dark:text-gray-400">Last Login</th>
            <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#617589] dark:text-gray-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#dbe0e6] dark:divide-gray-800">
          {/* Row 1 */}
          <tr className="group hover:bg-[#f0f2f4] dark:hover:bg-gray-900/50 transition-colors">
            <td className="py-4 px-6 align-middle">
              <input className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
            </td>
            <td className="py-4 px-6 align-middle">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-cover bg-center" data-alt="Portrait of Sarah Jenkins" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdtSak1sxKtbH7qdcz3IuCdUW19kDwIvq-0eDeUHLkShpFVdjZQ6OSwGLbEvnp4xzQyiTjP6Dlo37g-T8YsTd67EDYE2_GDVlMpmj6zgUhLvWhR_Vr9RowD-L0h89-ZDQUMcQyokeq2z5gyRydeYOGBGtA981U2zSthNLvfeJIW7cHo6ZA0-xPsMq8R29NkVHZBVQ1ZLBKV5V303jSwc5rKVTXE6ja3VzW2Zj3fG8X5eYIIeBWhFv6jL6kgnZhYnuEZTQ85LdcBdci")' }}></div>
                <div>
                  <p className="text-sm font-bold text-[#111418] dark:text-white">Sarah Jenkins</p>
                  <p className="text-xs text-[#617589] dark:text-gray-400">sarah.j@ptxyz.com</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 align-middle">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <span className="size-1.5 rounded-full bg-purple-500"></span>
                Administrator
              </span>
            </td>
            <td className="py-4 px-6 align-middle">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                Active
              </span>
            </td>
            <td className="py-4 px-6 align-middle">
              <p className="text-sm text-[#111418] dark:text-gray-300">Oct 24, 2023</p>
              <p className="text-xs text-[#617589]">10:42 AM</p>
            </td>
            <td className="py-4 px-6 align-middle text-right">
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" title="Edit User">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 transition-colors" title="Reset Password">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>lock_reset</span>
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-500 transition-colors" title="Delete User">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                </button>
              </div>
            </td>
          </tr>

          {/* Row 2 */}
          <tr className="group hover:bg-[#f0f2f4] dark:hover:bg-gray-900/50 transition-colors">
            <td className="py-4 px-6 align-middle">
              <input className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
            </td>
            <td className="py-4 px-6 align-middle">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-cover bg-center" data-alt="Portrait of Michael Chen" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBphshVOvnKF2v5PhuqJ7hiD8ot4AwmjTGqvZr7wihxZE30giEL-jTOVnaVjeTJTx_0Y5PlmHtrd6Nhk3gU2JQeVYHhaEXWv_XkdR3hcxQhIuf5lYuV0K0FvtRurX0ZkQPa9A1plBofCjCPFP3KMDWltXsqXAn2Ayb-rFmNc4vH480eSsQGwcTx82wpr9AcmEtgM-pslDuMULquhg7wCCxi1huRqdVyo3y6oSF_ROvDRRrmoTfzDcEvx7VSfpLCCCwrjlsGviDW_hyl")' }}></div>
                <div>
                  <p className="text-sm font-bold text-[#111418] dark:text-white">Michael Chen</p>
                  <p className="text-xs text-[#617589] dark:text-gray-400">m.chen@ptxyz.com</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 align-middle">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <span className="size-1.5 rounded-full bg-blue-500"></span>
                Fleet Manager
              </span>
            </td>
            <td className="py-4 px-6 align-middle">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                Active
              </span>
            </td>
            <td className="py-4 px-6 align-middle">
              <p className="text-sm text-[#111418] dark:text-gray-300">Oct 23, 2023</p>
              <p className="text-xs text-[#617589]">09:15 AM</p>
            </td>
            <td className="py-4 px-6 align-middle text-right">
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" title="Edit User">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 transition-colors" title="Reset Password">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>lock_reset</span>
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-500 transition-colors" title="Delete User">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                </button>
              </div>
            </td>
          </tr>

          {/* Row 3 */}
          <tr className="group hover:bg-[#f0f2f4] dark:hover:bg-gray-900/50 transition-colors">
            <td className="py-4 px-6 align-middle">
              <input className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
            </td>
            <td className="py-4 px-6 align-middle">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-cover bg-center" data-alt="Portrait of David Kim" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDCi2SMpiYsMIWA8fInU3whtQSzflot1SPf9oDeE7dDw0faZs0Kr2YYcyjeEaxqsVk1YdZhaGF3iWYv9vMkrUFlTyx6G1E8p9xSAiWA_zjeNakEHhkIEioIOgZPI0TJ3LKC8-of6Fo7_CBDCXd-DA6H-q5JpO9m7t6ByQLucR8Yn3bak76m3_mjfa4nvr4yzOZVPNgyU_gAN93FDCIrIuh8z3Y6LdD_GByBmg-HcG_Ns2HiI7iD0DkZL09wZgla9kwbdKDJdroIDx2_")' }}></div>
                <div>
                  <p className="text-sm font-bold text-[#111418] dark:text-white">David Kim</p>
                  <p className="text-xs text-[#617589] dark:text-gray-400">d.kim@ptxyz.com</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 align-middle">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                <span className="size-1.5 rounded-full bg-gray-500"></span>
                Staff
              </span>
            </td>
            <td className="py-4 px-6 align-middle">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                Inactive
              </span>
            </td>
            <td className="py-4 px-6 align-middle">
              <p className="text-sm text-[#111418] dark:text-gray-300">Sep 12, 2023</p>
              <p className="text-xs text-[#617589]">04:30 PM</p>
            </td>
            <td className="py-4 px-6 align-middle text-right">
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" title="Edit User">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 transition-colors" title="Reset Password">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>lock_reset</span>
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-500 transition-colors" title="Delete User">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                </button>
              </div>
            </td>
          </tr>

          {/* Row 4 */}
          <tr className="group hover:bg-[#f0f2f4] dark:hover:bg-gray-900/50 transition-colors">
            <td className="py-4 px-6 align-middle">
              <input className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
            </td>
            <td className="py-4 px-6 align-middle">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-cover bg-center" data-alt="Portrait of Alex Johnson" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_W2zneguoEY2rrAZAPjoSob45s6p6Myzo7ewQIeINvQzcjvkqP6qaSlJ3bH6-2l1fq-2k0I__WcP7RADwTNFI0q1y8BgYyAK9Kb6k5sEO9m9wYdDX9-8vc_gov64OmaGm_X9VYUvpupvRyKqoilgx6H0p7TpY9HMuWC2A97kwvSaXi3OIjV8kvxRbIRK8DqduxrfuhGZVPKUHyAvHd2SbVd80MzMGebZ4fX0JNQtMr257jIPyU30DCoTlXKO78CwxfM4od38QyF5s")' }}></div>
                <div>
                  <p className="text-sm font-bold text-[#111418] dark:text-white">Alex Johnson</p>
                  <p className="text-xs text-[#617589] dark:text-gray-400">alex.j@ptxyz.com</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 align-middle">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <span className="size-1.5 rounded-full bg-amber-500"></span>
                Driver
              </span>
            </td>
            <td className="py-4 px-6 align-middle">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                Active
              </span>
            </td>
            <td className="py-4 px-6 align-middle">
              <p className="text-sm text-[#111418] dark:text-gray-300">Oct 24, 2023</p>
              <p className="text-xs text-[#617589]">08:00 AM</p>
            </td>
            <td className="py-4 px-6 align-middle text-right">
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" title="Edit User">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 transition-colors" title="Reset Password">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>lock_reset</span>
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-500 transition-colors" title="Delete User">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Pagination Footer */}
    <div className="flex items-center justify-between px-6 py-4 border-t border-[#dbe0e6] dark:border-gray-800 bg-white dark:bg-[#111418]">
      <p className="text-sm text-[#617589] dark:text-gray-400">
        Showing <span className="font-bold text-[#111418] dark:text-white">1</span> to <span className="font-bold text-[#111418] dark:text-white">4</span> of <span className="font-bold text-[#111418] dark:text-white">42</span> users
      </p>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-sm font-medium hover:bg-[#f0f2f4] dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
          Previous
        </button>
        <button className="px-3 py-1.5 rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-sm font-medium hover:bg-[#f0f2f4] dark:hover:bg-gray-700 transition-colors">
          Next
        </button>
      </div>
    </div>
  </div>
</div>
        </div>
    );
}
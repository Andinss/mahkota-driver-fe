"use client";

import React from "react";

export default function AuditLogPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Audit Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and review all system changes and user activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
            <span className="text-sm font-medium">Export CSV</span>
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Total Events</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
              <span className="material-symbols-outlined text-xl">reorder</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">2,840</h3>
            <span className="text-green-500 text-xs font-medium flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 8%
            </span>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Security Alerts</span>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">
              <span className="material-symbols-outlined text-xl">security</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">12</h3>
            <span className="text-slate-500 text-xs font-medium">Requires action</span>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">User Actions</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
              <span className="material-symbols-outlined text-xl">person_outline</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">1,150</h3>
            <span className="text-green-500 text-xs font-medium flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
            </span>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Failed Requests</span>
            <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl">
              <span className="material-symbols-outlined text-xl">error_outline</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">45</h3>
            <span className="text-red-500 text-xs font-medium flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 2%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-primary focus:border-primary transition-all text-sm" 
            placeholder="Search by user, action, or target entity..." 
            type="text"
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-primary focus:border-primary py-2.5 px-4 min-w-[140px]">
            <option>Date Range</option>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Custom Range</option>
          </select>
          <select className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-primary focus:border-primary py-2.5 px-4 min-w-[140px]">
            <option>All Actions</option>
            <option>User Management</option>
            <option>System Config</option>
            <option>Security</option>
          </select>
          <select className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-primary focus:border-primary py-2.5 px-4 min-w-[140px]">
            <option>All Statuses</option>
            <option>Success</option>
            <option>Failed</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="text-sm font-medium">Oct 24, 2023</div>
                  <div className="text-xs text-slate-500">14:22:15 PM</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                      <img 
                        alt="Marcus Wright" 
                        className="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFDk8Mp4BTG8MOPMT_1fFoT-f8wNmCWSGSG5L5Iw670JwsalPDFfxZMJbXRByAXXpMNvPmwYUzu4yjDQ3c6JY_b1dG0MsK1piz_NA1OUqZSr8-a3FBBlDeOQkPRv0DSz7SHzJ0SULyblfmfKOx7sBLcmwhsO5aWqdpcHJGAD5J8RbwuYDBYarLSEbPrzRc53nIARfdvFZSnednUVSxS0l2xI5mqZStudblsoaRZ5YaS2mbtFFCY8Zu5lhsF9ZeSOJ9DOTfnUQycAk"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Marcus Wright</div>
                      <div className="text-xs text-slate-500">Admin</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-medium">Modified Permissions</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Role: Manager</div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Success
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
               </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="text-sm font-medium">Oct 24, 2023</div>
                  <div className="text-xs text-slate-500">13:45:02 PM</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                      <img 
                        alt="User" 
                        className="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGIhXQNMhpTigfb0385UeKg8jLuF-C8ocioBMX1NuKjgMFqWndiU_21BCH74kOSTD2s713JyITOX4ay1csfBSHXV-1zRr5cHI2fAGP0cZ3JpgEDLB-tPKwshSrGWvrZFdK0z0iONOR98Hk3EzG3GlCFg7Wcz8xt4XO6WNBUoW_0A17MzZEuTn2JsSh9xpqMsTUavLwGc6EY2NWdNFyS1DIKCg_gtRRDjaNph1sTJZhmZb8Yrsc-FonpDKg22I_uXLYAY_rf5FJ1OQ"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Alex Rivera</div>
                      <div className="text-xs text-slate-500">Staff</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-medium">Reset Password</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-slate-600 dark:text-slate-400">User: j.smith@lumina.com</div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Failed
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
               </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="text-sm font-medium">Oct 24, 2023</div>
                  <div className="text-xs text-slate-500">11:10:55 AM</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                      <img 
                        alt="Sarah Jenkins" 
                        className="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuByr9Bvo5Iq_4BUoDN1RbSctNTx2UalTJ9Yoi6vhqCelcyl9M4mS87td-Gnc77omQF-8NiwbgLozSiHPbHoWVejPdUFrz6lwB4zw6MBnHf00QeMuApDkbjGDQATe0f4ez46p7tn-kJnkxDRfpnbwsWQSA1yC4Rd4W1w2esZYRVcKYHRoiAeHT_rOgI8rOmft8IraUYz75_ZQye-r3fgc01lirHVqvwItPkIbUSne8o6Mpjxn01Rna-RjPPUP8dbRLBnrQlrjjfk0xA"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Sarah Jenkins</div>
                      <div className="text-xs text-slate-500">Supervisor</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-medium">Added New User</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Driver: MD-0052</div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Pending
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
               </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="text-sm font-medium">Oct 24, 2023</div>
                  <div className="text-xs text-slate-500">09:12:44 AM</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                      SYS
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary">System</div>
                      <div className="text-xs text-slate-500">Automated</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-medium">Backup Completed</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Database: Weekly_Full</div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Success
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
               </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">10</span> of <span className="font-medium text-slate-900 dark:text-white">2,840</span> results
          </p>
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-50" 
              disabled
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-medium">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-sm font-medium transition-colors">2</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-sm font-medium transition-colors">3</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-sm font-medium transition-colors">284</button>
            </div>
            <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-800 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-slate-500 pb-8">
        © 2026 Mahkota Drive. All rights reserved.
      </footer>
    </div>
  );
}
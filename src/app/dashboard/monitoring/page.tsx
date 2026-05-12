"use client";

import { PageHeader } from "@/components/page-header";
import { TaskListCard } from "@/components/monitoring/task-list/task-list-card";
import EmergencyResponse from "@/components/monitoring/task-list/emergency-response";

export default function TaskList() {
    return (
        <div className="p-8 space-y-8">
                {/* Page Heading */}
                <PageHeader 
                    title="Welcome, Officer Budi"
                    description="You have 1 urgent emergency and 5 scheduled tasks today."
                />

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <TaskListCard 
                        title="Pending Emergencies"
                        value="1"
                        icon="warning"
                        iconColor="text-orange-500"
                        trend={{
                            value: "Requires immediate action",
                            color: "text-orange-600",
                            icon: "warning"
                        }}
                    />
                    <TaskListCard 
                        title="Retrievals Today"
                        value="5"
                        icon="directions_car"
                        iconColor="text-primary"
                        trend={{
                            value: "2 completed",
                            color: "text-[#617589]",
                            icon: "check"
                        }}
                    />
                    <TaskListCard 
                        title="Completed Tasks"
                        value="12"
                        icon="check_circle"
                        iconColor="text-green-600"
                        trend={{
                            value: "+3 from yesterday",
                            color: "text-green-600",
                            icon: "trending_up"
                        }}
                    />
                </div>

                {/* Emergency Section */}
                <EmergencyResponse />
                {/* <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-600">emergency_home</span>
                        <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight">Emergency Response</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-[#1e2732] border-l-4 border-red-500 rounded-lg p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Breakdown</span>
                                    <span className="text-[#617589] dark:text-gray-400 text-sm">#EM-2024-89</span>
                                </div>
                                <span className="text-red-600 text-sm font-semibold animate-pulse flex items-center gap-1">
                                    <span className="size-2 rounded-full bg-red-600"></span> High Priority
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs text-[#617589] dark:text-gray-400 font-medium uppercase">Location</p>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-[#111418] dark:text-gray-200 text-[20px] mt-0.5">location_on</span>
                                        <p className="text-[#111418] dark:text-white font-medium">Jl. Jendral Sudirman No. 45, Jakarta Pusat</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <p className="text-xs text-[#617589] dark:text-gray-400 font-medium uppercase">Vehicle &amp; Driver</p>
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-[#111418] dark:text-gray-200 text-[20px] mt-0.5">directions_car</span>
                                        <div>
                                            <p className="text-[#111418] dark:text-white font-medium">Toyota Avanza (B 1234 XYZ)</p>
                                            <p className="text-sm text-[#617589] dark:text-gray-400">Driver: Pak Bambang</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-2">
                                <button className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">navigation</span> Respond Now
                                </button>
                                <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#111418] dark:text-white border border-[#e5e7eb] dark:border-[#444] px-4 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">call</span> Call Driver
                                </button>
                            </div>
                        </div> */}

                        {/* Small Map Preview */}
                        {/* <div className="hidden md:block w-48 h-auto min-h-[140px] bg-gray-200 rounded-lg bg-cover bg-center border border-[#e5e7eb] dark:border-[#333]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCh_z9Nc3IWYR7UuadAJqJO1netBz9iAt9DFzYrY97_iWPMJOd24o3N4C6p42ZmzlqVa5G_wRbt4krpYnKwmr5nwAtSzEuyhc-A03iVWuGo0scbKbC3zzHKX0qh1wUOI7CTvjR8BLCOgwh4Alt52PbU_tGDEcHCY9pFoRDia_h3z0_68fwTKCVtRPD8eNUxH6nQgLcfJRKEkfybQSgrJT9uDuVFthxNvkZb4RyH9SiyVSyOr83X9Vn_0eX6OrUtyywD1MWFwaGsIL-_")' }}>
                        </div>
                    </div>
                </section> */}

                {/* Tasks List Section */}
                <section className="flex flex-col gap-4 pb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-5">
                        <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight">Scheduled Retrievals</h2>

                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">search</span>
                                <input className="pl-10 pr-4 py-2 bg-white dark:bg-[#1e2732] border border-[#e5e7eb] dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64 text-[#111418] dark:text-white" placeholder="Search vehicle or driver..." type="text" />
                            </div>
                            <select className="px-4 py-2 bg-white dark:bg-[#1e2732] border border-[#e5e7eb] dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-[#111418] dark:text-white">
                                <option>All Status</option>
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex border-b border-[#e5e7eb] dark:border-[#333] mb-2">
                        <button className="px-4 py-2 text-primary border-b-2 border-primary font-semibold text-sm">All Tasks</button>
                        <button className="px-4 py-2 text-[#617589] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white font-medium text-sm transition-colors">Retrievals</button>
                        <button className="px-4 py-2 text-[#617589] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white font-medium text-sm transition-colors">Maintenance</button>
                        <button className="px-4 py-2 text-[#617589] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white font-medium text-sm transition-colors">Completed</button>
                    </div>

                    {/* Task Table */}
                    <div className="bg-white dark:bg-[#1e2732] rounded-xl border border-[#e5e7eb] dark:border-[#333] shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-[#1a222d] border-b border-[#e5e7eb] dark:border-[#333]">
                                    <tr>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-[#617589] dark:text-gray-400 whitespace-nowrap">Priority</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-[#617589] dark:text-gray-400 whitespace-nowrap">Vehicle Info</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-[#617589] dark:text-gray-400 whitespace-nowrap">Location</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-[#617589] dark:text-gray-400 whitespace-nowrap">Time Window</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-[#617589] dark:text-gray-400 whitespace-nowrap">Status</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase text-[#617589] dark:text-gray-400 whitespace-nowrap text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e5e7eb] dark:divide-[#333]">
                                    {/* Row 1 */}
                                    <tr className="hover:bg-gray-50 dark:hover:bg-[#252f3b] transition-colors group">
                                        <td className="py-4 px-4 align-top">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">Normal</span>
                                        </td>
                                        <td className="py-4 px-4 align-top">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-[#111418] dark:text-white">Honda CRV</span>
                                                <span className="text-xs text-[#617589] dark:text-gray-400 font-mono">B 2891 UJK</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 align-top max-w-[200px]">
                                            <div className="flex gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-[18px]">location_on</span>
                                                <span className="text-sm text-[#111418] dark:text-gray-200 truncate">Soekarno-Hatta Terminal 3</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 align-top">
                                            <span className="text-sm text-[#111418] dark:text-gray-200">Today, 14:00</span>
                                        </td>
                                        <td className="py-4 px-4 align-top">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                                                <span className="size-1.5 rounded-full bg-yellow-500"></span> Pending
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 align-top text-right">
                                            <button className="text-primary hover:text-blue-700 font-medium text-sm px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Details</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1e2732] border-t border-[#e5e7eb] dark:border-[#333]">
                            <div className="text-sm text-[#617589] dark:text-gray-400">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">12</span> results
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-[#e5e7eb] dark:border-[#333] rounded text-sm disabled:opacity-50 text-[#111418] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252f3b]" disabled>Previous</button>
                                <button className="px-3 py-1 border border-[#e5e7eb] dark:border-[#333] rounded text-sm text-[#111418] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252f3b]">Next</button>
                            </div>
                        </div>
                    </div>
                </section>
        </div>
    );
}
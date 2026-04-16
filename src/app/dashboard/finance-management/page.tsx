"use client";

import { DriverStatsCard } from "@/components/driver/dashboard/driver-stats-card";

export default function PaymentList() {
  return (
    <>
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Section */}
        <header className="w-full px-6 py-6 pb-2 shrink-0">
          <div className="max-w-[1200px] mx-auto w-full">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                  Finance Dashboard
                </h2>
                <p className="text-[#617589] dark:text-gray-400 text-sm font-medium">
                  Daily Payment Queue • October 26, 2023
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-[#dbe0e6] dark:border-gray-600 text-[#111418] dark:text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    download
                  </span>
                  Export
                </button>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                  <span className="material-symbols-outlined text-[20px]">
                    add
                  </span>
                  Manual Entry
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <DriverStatsCard
    title="Total Collections Today"
    value="$12,450"
    icon="payments"
    iconColor="text-primary"
    trend={{
      icon: "trending_up",
      text: "+12% from yesterday",
      textColor: "text-emerald-500",
    }}
  />
  
  {/* Card 2 - Anda bisa menambahkan card lainnya di sini */}
  <DriverStatsCard
    title="Total Outstanding"
    value="$8,230"
    icon="receipt_long"
    iconColor="text-orange-500"
    trend={{
      icon: "trending_up",
      text: "+5% from last week",
      textColor: "text-red-500",
    }}
  />
  
  {/* Card 3 */}
  <DriverStatsCard
    title="Average Payment"
    value="$425"
    icon="analytics"
    iconColor="text-blue-500"
    trend={{
      icon: "trending_up",
      text: "+8% increase",
      textColor: "text-emerald-500",
    }}
  />
  
  {/* Card 4 */}
  <DriverStatsCard
    title="Collection Rate"
    value="94%"
    icon="speed"
    iconColor="text-emerald-500"
    trend={{
      icon: "trending_up",
      text: "+3% this month",
      textColor: "text-emerald-500",
    }}
  />
</div>

            {/* Main Section: Queue Table */}
            <div className="flex flex-col gap-4 bg-surface-light dark:bg-surface-dark border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
              {/* Filters & Search Toolbar */}
              <div className="p-4 border-b border-[#dbe0e6] dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex flex-wrap lg:flex-nowrap gap-4 items-center justify-between">
                {/* Search */}
                <div className="w-full lg:w-96">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-600 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[#617589] dark:text-gray-400">search</span>
                    <input className="w-full bg-transparent border-none p-0 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:ring-0" placeholder="Search Invoice # or Customer..."/>
                  </label>
                </div>
                {/* Filter Chips */}
                <div className="flex gap-2 flex-wrap items-center">
                  <button className="flex h-9 items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-600 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-[#111418] dark:text-gray-200 text-sm font-medium">Date Range</span>
                    <span className="material-symbols-outlined text-base text-[#617589]">keyboard_arrow_down</span>
                  </button>
                  <button className="flex h-9 items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-600 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-[#111418] dark:text-gray-200 text-sm font-medium">Status: All</span>
                    <span className="material-symbols-outlined text-base text-[#617589]">keyboard_arrow_down</span>
                  </button>
                  <button className="flex h-9 items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-[#dbe0e6] dark:border-gray-600 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-[#111418] dark:text-gray-200 text-sm font-medium">Vehicle Type</span>
                    <span className="material-symbols-outlined text-base text-[#617589]">keyboard_arrow_down</span>
                  </button>
                </div>
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-[#617589] dark:text-gray-400 font-medium border-b border-[#dbe0e6] dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4">Invoice ID</th>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Vehicle Plate</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dbe0e6] dark:divide-gray-700">
                    {/* Row 1: Late */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">#INV-4023</td>
                      <td className="px-6 py-4 text-[#111418] dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cover bg-center" data-alt="Customer avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCcgquo3s1Gm9UWljE7Yx8CgDUShF68J6fkgw1QvJ5OY4Yi2YzBIR_mdrI8wMWujABWw_8vsHbygbpYbgqBM5o6LBdaJNvGR8cQS8Loj8VvD3G18m5AUrXkuEbRUFb0n2zJFsSZxH5ROqS9ReASBv8Z79k6f6jw6z5dQr37SpsRhKvVgrzA5Oi0_54ygMxCPhm31EX4bMSnxf4i1OggQBnvb8Q3cZ6XmBTkAoo-PacjlfHNUo2yx-p-rIQHrGzFcM8KDdC3f0yGWk0q")' }}></div>
                          James Anderson
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">B 1234 CD</td>
                      <td className="px-6 py-4 font-semibold text-[#111418] dark:text-white">$450.00</td>
                      <td className="px-6 py-4 text-[#e73908] font-medium">Oct 24, 2023</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-[#e73908] dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          Late
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">Credit Card</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 rounded text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Validate">
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                          </button>
                          <button className="p-1.5 rounded text-gray-500 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Details">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Row 2: Pending */}
                    <tr className="bg-primary/[0.02] dark:bg-primary/[0.05] border-l-2 border-l-primary hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08] transition-colors">
                      <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">#INV-4024</td>
                      <td className="px-6 py-4 text-[#111418] dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cover bg-center" data-alt="Customer avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDyfv7iIobUo0yuS3OZSQpcwA_Q4P6OEp2BEv6Bwbfp5QdycOcW7dDrS_hRancDVUPPRaQKAJrwLOyxoV37O58AKHH0OHUX0RKiGjTpkOO_Fw89UQZGeSixjgPyTP0zqaGppeRd-jhD5sLc68crgFtEIOhQ2Nn4n8z7MwG0PJYnaqRpECVNooa_bCz7gY61QwZtkisx13u-gb-0t8A7slICPMoKqD6hBs_HMRMHG_bLDfwToOpWm8WmFhtJuwirFjrquGGHdcAHzCu-")' }}></div>
                          Sarah Connor
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">D 5678 XY</td>
                      <td className="px-6 py-4 font-semibold text-[#111418] dark:text-white">$1,200.00</td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">Oct 26, 2023</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-[#d97706] dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          Pending Review
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">Bank Transfer</td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors shadow-sm">
                          Validate
                        </button>
                      </td>
                    </tr>
                    {/* Row 3: Paid */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">#INV-4022</td>
                      <td className="px-6 py-4 text-[#111418] dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cover bg-center" data-alt="Customer avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC4-mRZKk3sqc11M4-sgdg-mZ9I5zyhANPAmdKmeqj7Iw5Q18dIJsIrBrF_d3HIegqAQF3CVoWTLy9B3LiaKdX2AvWyLFPmmX5ZTxAUwqH8rxIO-Gq3dBmsb4rThS8lQfTfZr0gs82-lWf4XIUr4H-B4ewbtq8_wcz-AueRROyj6MaLydH7bffTSjJFW95b81j9f0kKQh7UDd0NUgIhq7b-gK4s4JiOJ4Fph6tXyN8PnpssPowxaTHEOORPGbR65EN2OuzGgASXQXOm")' }}></div>
                          Michael Chen
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">B 9988 AA</td>
                      <td className="px-6 py-4 font-semibold text-[#111418] dark:text-white">$320.00</td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">Oct 26, 2023</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-[#078838] dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">Credit Card</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 rounded text-gray-500 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Details">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button className="p-1.5 rounded text-gray-500 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Download Receipt">
                            <span className="material-symbols-outlined text-[20px]">receipt</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Row 4: Pending */}
                    <tr className="bg-primary/[0.02] dark:bg-primary/[0.05] border-l-2 border-l-primary hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08] transition-colors">
                      <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">#INV-4025</td>
                      <td className="px-6 py-4 text-[#111418] dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cover bg-center" data-alt="Customer avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6QO9PL8jNr1d60A9pOnhJXK_msEq2QVp9QrkI9JKgiMRzewJp7yECe9-d3SWRWyTzkDZ3nXlb9SuQYKG19H1dutrDHNP6iazRBH4uaveVN0RxYwum0l6Ul5ah1HTYv-f56lFYn6JJmnXXobYEf6ueTww7FCQXfyF1jiIWRT910Q3xkk-m2xy2zsxZCu_YiDS008JPEAyzqmbm27ubUfYG6AAQSbggNbmI5MFc358Wiq_Kr2DnRFz6SIiefnhSYaTuDJzaHLe1wf-m")' }}></div>
                          Emma Watson
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">F 2233 KL</td>
                      <td className="px-6 py-4 font-semibold text-[#111418] dark:text-white">$850.00</td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">Oct 26, 2023</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-[#d97706] dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          Pending Review
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">Cash</td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors shadow-sm">
                          Validate
                        </button>
                      </td>
                    </tr>
                    {/* Row 5: Paid */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">#INV-4021</td>
                      <td className="px-6 py-4 text-[#111418] dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cover bg-center" data-alt="Customer avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDi1kPQgCgdKaBias77134VvG-U5cHjmNvAkyjUxDQND6pcV1Tl2ewWUXIVrAQkt_IDqUWWkt17S2Tgb0VpatU3NLXeUS9Uw3sH3Eo7rt3e0IoDm15GHyBthB0U6OYS9L_6V5kHzz_TbsbdgJ7TOcwYVHEZgr4SRoUagMxckIfOHdPNyuZvfnl6SGm_hi2ltiFvt4kStP8sCBx8Axb-4Y1QWdeYCaiQJdJKpwYX1S2x6HvIT8ReGDBhLAM12kql2fvOt1xIPUP_EyeB")' }}>
                          </div>
                          Robert Fox
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">A 5544 BC</td>
                      <td className="px-6 py-4 font-semibold text-[#111418] dark:text-white">$150.00</td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">Oct 25, 2023</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-[#078838] dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#617589] dark:text-gray-400">Credit Card</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 rounded text-gray-500 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Details">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button className="p-1.5 rounded text-gray-500 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Download Receipt">
                            <span className="material-symbols-outlined text-[20px]">receipt</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Table Footer / Pagination */}
              <div className="p-4 border-t border-[#dbe0e6] dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
                <p className="text-sm text-[#617589] dark:text-gray-400">Showing 1 to 5 of 12 entries</p>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded border border-[#dbe0e6] dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 text-[#617589] dark:text-gray-400 disabled:opacity-50 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button className="p-1.5 rounded border border-[#dbe0e6] dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 text-[#111418] dark:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
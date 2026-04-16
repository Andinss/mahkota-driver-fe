'use client';

import React, { useState } from 'react';

export default function LatePaymentPage() {
  const [selectedDriver, setSelectedDriver] = useState<string>('DRV-009');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="p-8">
          {/* Page Title Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Late Payment Approvals</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage driver late payment justifications.</p>
            </div>
            {/* Search & Filter Area */}
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl leading-none">search</span>
                <input 
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-white shadow-sm" 
                  placeholder="Search driver or ID..." 
                  type="text"
                />
              </div>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm font-medium">
                <span className="material-icons-round text-xl">filter_list</span>
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight mb-2">Pending Requests</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">12</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[11px] font-bold">+2 today</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight mb-2">Approved Today</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">3</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight mb-2">Rejected Today</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">1</p>
            </div>
          </div>

          {/* Content Split View */}
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-320px)] min-h-[600px]">
            {/* List Column */}
            <div className="w-full lg:w-4/12 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
              {/* Card 1 (Active) */}
              <div 
                className={`cursor-pointer p-4 rounded-xl bg-white dark:bg-slate-900 transition-all shadow-sm ${selectedDriver === 'DRV-009' ? 'border-2 border-primary shadow-md' : 'border border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                onClick={() => setSelectedDriver('DRV-009')}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      alt="Budi Santoso" 
                      className="size-10 rounded-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgFMRuuzJMfExZiTiflbrrGbXprn693ZmzTEhCCjOUpbtnjxHKJM234zc9Iv5_ZQ6AYdHVjHXV3mjFjtCoJLwnGG-aD2h2YgLAxY0U8tbv2wRn72Jq6LUb9K0WCrrs4lRpjW__SWwUeCcC5MUpEt3ELhZO-1Php47jFGS3aV4co4yQYEFfm6X8D8ceoPJG8-9FgEx2iA2DUUg_ZJCV3rmZkV1sJnjK6Gh7gGYeQolixzSRp1GMohWAqnRU_qtMgCVc4wijC_G5yzoY"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Budi Santoso</h3>
                      <p className="text-[11px] text-slate-500">ID: DRV-009</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wide">Pending</span>
                </div>
                <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-3"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">Late Amount</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Rp 1.500.000</p>
                  </div>
                  <span className="text-[11px] text-slate-400">2 hrs ago</span>
                </div>
              </div>

              {/* Card 2 */}
              <div 
                className={`cursor-pointer p-4 rounded-xl bg-white dark:bg-slate-900 transition-all shadow-sm ${selectedDriver === 'DRV-112' ? 'border-2 border-primary shadow-md' : 'border border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                onClick={() => setSelectedDriver('DRV-112')}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      alt="Siti Aminah" 
                      className="size-10 rounded-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt58FAvKitEQXvE-LZ85BwZVPbF7UY3MoLOGJ9IAt1zf6UVwd71em0pAozmk6mnsXXF81jtbNPG84f37r5unCJeblhdKuO0OqCyZLJteZAD5crRnHtbwFGR4SFkXp25NU3kXTCdtNjqkD_nROv1J_NT912COaCBPpz-rNBrRWI_DCbNIGOxRwg7A4n6bUVb3r8CadYtjLhsWhjaGnAtIwPQBtDX1O-WY5l_CaT_Nwk4PHAFHkNyh8Q1-SLIJqNowLP_MAiGVKyou9a"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Siti Aminah</h3>
                      <p className="text-[11px] text-slate-500">ID: DRV-112</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wide">Pending</span>
                </div>
                <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-3"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">Late Amount</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Rp 750.000</p>
                  </div>
                  <span className="text-[11px] text-slate-400">5 hrs ago</span>
                </div>
              </div>

              {/* Card 3 */}
              <div 
                className={`cursor-pointer p-4 rounded-xl bg-white dark:bg-slate-900 transition-all shadow-sm ${selectedDriver === 'DRV-045' ? 'border-2 border-primary shadow-md' : 'border border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                onClick={() => setSelectedDriver('DRV-045')}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      alt="Ahmad Dhani" 
                      className="size-10 rounded-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkX66pns_aW4oQ-ZFIfevxLJP5Aan3TFJI1rQe9M2JoUGlV_BHXXcfMaZThTbIIIn7K3lUFRWNjxd2ZBYyAy1cHp0P2KTRD881nxJrrYCgm33T_zWioHw5DlnJ-mYy39ODRA1UQO_VFoCNPxTMsHztdDTSA4gAisYMOctSMEsbuQiWliP0_reaTOsgJY0Nf8tpotHH4Tk2WTd161fpTWYHKAvIA4BkNZInrGjuvS-aUhPSCNd6KLYFmm7seUtsC-24EksHdflR29du"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ahmad Dhani</h3>
                      <p className="text-[11px] text-slate-500">ID: DRV-045</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wide">Pending</span>
                </div>
                <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-3"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[11px] text-slate-500 mb-0.5">Late Amount</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Rp 2.100.000</p>
                  </div>
                  <span className="text-[11px] text-slate-400">Yesterday</span>
                </div>
              </div>
            </div>

            {/* Detail Column - Dynamic berdasarkan selectedDriver */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
              {selectedDriver === 'DRV-009' && <DriverDetail driverId="DRV-009" />}
              {selectedDriver === 'DRV-112' && <DriverDetail driverId="DRV-112" />}
              {selectedDriver === 'DRV-045' && <DriverDetail driverId="DRV-045" />}
            </div>
          </div>

          {/* Global Footer */}
          <footer className="mt-8 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">© 2024 PT XYZ Vehicle Rental Management System. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

// Component untuk Detail Driver
function DriverDetail({ driverId }: { driverId: string }) {
  const driverData = {
    'DRV-009': {
      name: 'Budi Santoso',
      vehicle: 'Toyota Avanza',
      plate: 'B 1234 XYZ',
      dueDate: 'Oct 12, 2023',
      paymentDate: 'Oct 14, 2023',
      amount: 'Rp 1.500.000',
      justification: 'Bank System Offline',
      message: '"I attempted to transfer the payment on Oct 12th at 13:45, but the BCA mobile banking system was down for maintenance. I tried again every hour until 8 PM. By the time it was back up, I was already on another shift in a remote area with poor signal. I have attached the screenshot of the error message."'
    },
    'DRV-112': {
      name: 'Siti Aminah',
      vehicle: 'Honda Brio',
      plate: 'D 5678 ABC',
      dueDate: 'Oct 10, 2023',
      paymentDate: 'Oct 12, 2023',
      amount: 'Rp 750.000',
      justification: 'Emergency Situation',
      message: '"There was a family emergency that required me to be at the hospital. I could not make the payment on time due to this urgent situation. I have attached the hospital documents as proof."'
    },
    'DRV-045': {
      name: 'Ahmad Dhani',
      vehicle: 'Mitsubishi Xpander',
      plate: 'F 9012 DEF',
      dueDate: 'Oct 8, 2023',
      paymentDate: 'Oct 10, 2023',
      amount: 'Rp 2.100.000',
      justification: 'Technical Issues',
      message: '"The payment gateway was experiencing technical difficulties. I tried multiple times but the transaction kept failing. I have attached screenshots of the error messages."'
    }
  };

  const data = driverData[driverId as keyof typeof driverData];

  return (
    <>
      {/* Detail Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xl">
            {data.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{data.name}</h2>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <span className="material-icons-round text-lg">badge</span>
              <span>Driver ID: {driverId}</span>
              <span>•</span>
              <span>Joined Jan 2022</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            Review Required
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Submitted 2 hours ago</p>
        </div>
      </div>

      {/* Detail Content */}
      <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
        {/* Transaction Info Grid */}
        <div className="mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-icons-round text-primary text-lg">receipt_long</span>
            Transaction Details
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight mb-1">Vehicle</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{data.vehicle}</p>
              <p className="text-[11px] text-slate-400">{data.plate}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight mb-1">Due Date</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{data.dueDate}</p>
              <p className="text-[11px] text-slate-400">14:00 PM</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
              <p className="text-[11px] text-rose-600 dark:text-rose-400 uppercase font-bold tracking-tight mb-1">Payment Date</p>
              <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{data.paymentDate}</p>
              <p className="text-[11px] text-rose-500 font-medium">+2 Days Late</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-[11px] text-primary uppercase font-bold tracking-tight mb-1">Total Amount</p>
              <p className="text-lg font-black text-primary">{data.amount}</p>
            </div>
          </div>
        </div>

        {/* Justification */}
        <div className="mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-icons-round text-primary text-lg">chat_bubble_outline</span>
            Driver Justification
          </h4>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
            <h5 className="font-bold text-slate-900 dark:text-white mb-2">Reason: {data.justification}</h5>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.message}
            </p>
          </div>
        </div>

        {/* History Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="material-icons-round text-primary text-lg">history</span>
              Recent History
            </h4>
            <button className="text-[11px] text-primary font-bold uppercase tracking-wider hover:underline">
              View Full Profile
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">Sep 01, 2023</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vehicle Return</td>
                  <td className="px-4 py-3"><span className="text-emerald-500 font-bold">On Time</span></td>
                  <td className="px-4 py-3 text-right text-slate-900 dark:text-white">{data.amount}</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">Aug 15, 2023</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vehicle Return</td>
                  <td className="px-4 py-3"><span className="text-emerald-500 font-bold">On Time</span></td>
                  <td className="px-4 py-3 text-right text-slate-900 dark:text-white">{data.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Footer Actions */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Note for Driver (Optional)
          </label>
          <input 
            className="w-full rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary shadow-sm" 
            placeholder="e.g., Waiving fee due to system outage verified..."
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button className="px-6 py-2.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-bold text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center gap-2">
            <span className="material-icons-round text-lg">close</span>
            Reject
          </button>
          <button className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2">
            <span className="material-icons-round text-lg">check</span>
            Approve Request
          </button>
        </div>
      </div>
    </>
  );
}
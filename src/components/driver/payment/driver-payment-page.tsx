"use client";

import { PageHeader } from "@/components/page-header";

export function DriverPaymentPage() {
  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-10">
          <PageHeader
            title="Payment Overview"
            description="Kelola pembayaran sewa dan transaksi keuangan Anda"
          />

          <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">receipt_long</span>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Belum Ada Transaksi</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">Data pembayaran akan muncul di sini setelah ada aktivitas transaksi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

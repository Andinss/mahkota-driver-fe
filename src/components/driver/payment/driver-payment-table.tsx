"use client";

import { useState } from "react";
import { ModalExport } from "@/components/ui/export";
import type { ExportColumn } from "@/components/ui/export";

interface Transaction {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  subtitleColor?: string;
  method: string;
  methodIcon: string;
  amount: string;
  amountColor?: string;
  status: string;
  statusColor: string;
  statusBg: string;
  statusDotColor: string;
  showPayButton?: boolean;
}

interface DriverPaymentTableProps {
  transactions?: Transaction[];
  onExport?: (options: any) => void;
}

const transactionColumns: ExportColumn[] = [
  { id: "reference_number", label: "No. Transaksi", defaultChecked: true },
  { id: "category", label: "Kategori Transaksi", defaultChecked: true },
  { id: "method", label: "Metode Bayar", defaultChecked: true },
  { id: "amount", label: "Nominal", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
];

const defaultTransactions: Transaction[] = [
  {
    id: "#TRX-2024-9102",
    date: "Hari Ini - 07:00 WIB",
    title: "Sewa Harian Avanza",
    subtitle: "B 1234 XYZ (Reguler)",
    method: "BCA VA",
    methodIcon: "account_balance",
    amount: "Rp 450.000",
    status: "Menunggu Pembayaran",
    statusColor: "text-red-600 dark:text-red-400",
    statusBg: "bg-red-50 dark:bg-red-900/20",
    statusDotColor: "bg-red-500",
    showPayButton: true,
  },
  {
    id: "#TRX-2024-8994",
    date: "09 Okt 2024 - 08:15 WIB",
    title: "Sewa Harian Avanza",
    subtitle: "B 1234 XYZ (Reguler)",
    method: "BCA VA Auto",
    methodIcon: "account_balance",
    amount: "Rp 450.000",
    status: "Lunas",
    statusColor: "text-emerald-600 dark:text-emerald-400",
    statusBg: "bg-slate-100 dark:bg-slate-800",
    statusDotColor: "bg-emerald-500",
  },
  {
    id: "#TRX-2024-8840",
    date: "07 Okt 2024 - 19:40 WIB",
    title: "Top Up Koin Dompet Mitra",
    subtitle: "+100.000 Koin Ditambahkan",
    subtitleColor: "text-emerald-600",
    method: "QRIS GoPay",
    methodIcon: "qr_code_scanner",
    amount: "+Rp 100.000",
    amountColor: "text-emerald-500",
    status: "Berhasil Masuk",
    statusColor: "text-emerald-600 dark:text-emerald-400",
    statusBg: "bg-slate-100 dark:bg-slate-800",
    statusDotColor: "bg-emerald-500",
  },
  {
    id: "#TRX-2024-8621",
    date: "04 Okt 2024 - 14:10 WIB",
    title: "Klaim Own Risk (Baret Bumper)",
    subtitle: "BAP-OR #4412 Terverifikasi",
    method: "Mandiri VA",
    methodIcon: "account_balance",
    amount: "Rp 300.000",
    status: "Lunas",
    statusColor: "text-emerald-600 dark:text-emerald-400",
    statusBg: "bg-slate-100 dark:bg-slate-800",
    statusDotColor: "bg-emerald-500",
  },
  {
    id: "#TRX-2024-8500",
    date: "01 Okt 2024 - 10:00 WIB",
    title: "Insentif Performa Sewa Bersih",
    subtitle: "Bonus Rating 5 Bintang Sep-2024",
    method: "Bonus Sistem",
    methodIcon: "savings",
    amount: "+Rp 150.000",
    amountColor: "text-emerald-500",
    status: "Masuk Koin",
    statusColor: "text-emerald-600 dark:text-emerald-400",
    statusBg: "bg-slate-100 dark:bg-slate-800",
    statusDotColor: "bg-emerald-500",
  },
];

export function DriverPaymentTable({
  transactions = defaultTransactions,
  onExport,
}: DriverPaymentTableProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">receipt_long</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Transaksi Pembayaran
            </h2>
            <p className="text-xs text-slate-400">{transactions.length} transaksi tercatat</p>
          </div>
        </div>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">No. Transaksi &amp; Waktu</th>
              <th className="px-6 py-4">Kategori Transaksi</th>
              <th className="px-6 py-4">Metode Bayar</th>
              <th className="px-6 py-4">Nominal</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className={`font-mono font-semibold text-sm ${tx.showPayButton ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                      {tx.id}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{tx.date}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white">{tx.title}</span>
                    <span className={`text-xs font-mono ${tx.subtitleColor || 'text-slate-500 dark:text-slate-400'}`}>
                      {tx.subtitle}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">{tx.methodIcon}</span>
                    <span>{tx.method}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${tx.amountColor || 'text-slate-900 dark:text-white'}`}>
                    {tx.amount}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${tx.statusBg} ${tx.statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${tx.statusDotColor}`} />
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {tx.showPayButton && (
                      <button
                        type="button"
                        className="h-8 px-2.5 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Bayar Sekarang
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          setIsExportModalOpen(false);
          onExport?.(options);
        }}
        totalRows={transactions.length}
        title="Export Data Transaksi"
        description="Generate laporan transaksi pembayaran driver."
        columns={transactionColumns}
      />
    </>
  );
}

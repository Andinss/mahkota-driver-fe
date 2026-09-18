"use client";

import { PageHeader } from "@/components/page-header";
import { PaymentCard } from "@/components/finance/payment-list/card";
import { Card } from "@/components/ui/card";

export default function ProfilDriver() {
  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-10">
          <PageHeader
            title="Profil Saya"
            description="Informasi profil dan data personal Anda"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PaymentCard
              title="Status Akun"
              value="Aktif"
              icon="verified"
              iconColor="text-emerald-500"
              trend={{
                value: "Member Internal - Prioritas",
                color: "text-emerald-500",
                icon: "trending_up",
              }}
            />
            <PaymentCard
              title="ID Karyawan"
              value="-"
              icon="badge"
              iconColor="text-primary"
              trend={{
                value: "Belum terdaftar",
                color: "text-primary",
                icon: "info",
              }}
            />
            <PaymentCard
              title="Saldo Koin"
              value="0 Koin"
              icon="toll"
              iconColor="text-blue-500"
              trend={{
                value: "Belum ada transaksi",
                color: "text-blue-500",
                icon: "account_balance_wallet",
              }}
            />
            <PaymentCard
              title="Unit Operasional"
              value="Kosong"
              icon="directions_car"
              iconColor="text-slate-400"
              trend={{
                value: "Belum ada unit terdaftar",
                color: "text-slate-400",
                icon: "info",
              }}
            />
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Driver</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Profil mitra driver</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Nama Lengkap</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">-</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Email</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">-</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Telepon</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">-</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Tanggal Lahir</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">-</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Jenis Kelamin</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">-</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Kewarganegaraan</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">Indonesian (WNI)</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { PaymentCard } from "@/components/finance/payment-list/card";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { driverApi } from "@/lib/api/driver";
import { koinApi } from "@/lib/api/koin";
import type { DriverItem } from "@/lib/types/driver";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default function ProfilDriver() {
  const { user } = useAuth();
  const [driver, setDriver] = useState<DriverItem | null>(null);
  const [koinBalance, setKoinBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.driver_id) {
      setIsLoading(false);
      return;
    }
    driverApi
      .getMe()
      .then((res: any) => {
        const data = res?.data ?? res;
        setDriver(data);
        if (data?.koin?.balance !== undefined) {
          setKoinBalance(Number(data.koin.balance) || 0);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch driver profile:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    koinApi
      .getBalance(user.driver_id)
      .then((res: any) => {
        const data = res?.data ?? res;
        setKoinBalance(Number(data?.balance) || 0);
      })
      .catch(() => {});
  }, [user?.driver_id]);

  const fullName = driver
    ? `${driver.first_name} ${driver.last_name}`.trim()
    : user?.username || "-";
  const employeeId = driver?.employee_id || "-";
  const activeRentals = driver?.rentals?.length ?? 0;

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
              value={employeeId}
              icon="badge"
              iconColor="text-primary"
              trend={{
                value: employeeId !== "-" ? "Terdaftar" : "Belum terdaftar",
                color: employeeId !== "-" ? "text-emerald-500" : "text-primary",
                icon: employeeId !== "-" ? "check_circle" : "info",
              }}
            />
            <PaymentCard
            title="Koin"
            value={`${koinBalance.toLocaleString("id-ID")} Koin`}
            icon="toll"
            iconColor="text-blue-500"
            trend={{
              value: koinBalance > 0 ? `Setara ${formatIDR(koinBalance)}` : "Belum ada transaksi",
              color: koinBalance > 0 ? "text-blue-500" : "text-blue-500",
              icon: "account_balance_wallet",
            }}
          />
            <PaymentCard
              title="Unit Operasional"
              value={`${activeRentals} Unit`}
              icon="directions_car"
              iconColor={activeRentals > 0 ? "text-emerald-500" : "text-slate-400"}
              trend={{
                value: activeRentals > 0 ? "Aktif Beroperasi" : "Belum ada unit terdaftar",
                color: activeRentals > 0 ? "text-emerald-500" : "text-slate-400",
                icon: activeRentals > 0 ? "check_circle" : "info",
              }}
            />
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {driver?.profile_photo ? (
                  <img
                    src={driver.profile_photo}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{fullName}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Profil mitra driver</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Nama Lengkap</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{fullName}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Email</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{driver?.email || user?.email || "-"}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Telepon</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{driver?.phone || "-"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Tanggal Lahir</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                    {driver?.date_of_birth
                      ? new Date(driver.date_of_birth).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                      : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Jenis Kelamin</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{driver?.gender || "-"}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Kewarganegaraan</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{driver?.citizenship || "Indonesian (WNI)"}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

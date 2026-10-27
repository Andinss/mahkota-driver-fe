"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PaymentCard } from "@/components/finance/payment-list/card";
import { useAuth } from "@/lib/auth-context";
import { driverApi } from "@/lib/api/driver";
import { financeApi } from "@/lib/api/finances";
import { koinApi } from "@/lib/api/koin";
import { driverKeys, financeKeys, koinKeys } from "@/lib/query-keys";
import type { DriverItem } from "@/lib/types/driver";
import type { FinanceItem, DailyPaymentItem } from "@/lib/types/finances";
import { formatDateOnly } from "@/lib/utils/format";
import {
  getRentalDisplayStatus,
  type RentalDisplayStatus,
} from "@/lib/utils/rental-status";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { DriverQuickActions } from "./driver-quick-actions";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = formatDateOnly;

const PLACEHOLDER_IMG = "/images/placeholder-car.jpg";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  unpaid: {
    label: "Belum Dibayar",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    dot: "bg-red-500",
  },
  pending: {
    label: "Menunggu Verifikasi",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    dot: "bg-amber-500",
  },
  paid: {
    label: "Lunas",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Dibatalkan",
    color: "text-slate-500 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
    dot: "bg-slate-400",
  },
};

const izinBadgeConfig: Record<
  "pending" | "approved" | "rejected",
  { className: string; title: string; icon: string }
> = {
  pending: {
    className:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    title: "Izin telat menunggu persetujuan",
    icon: "hourglass_top",
  },
  approved: {
    className:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    title: "Izin telat disetujui",
    icon: "task_alt",
  },
  rejected: {
    className:
      "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    title: "Izin telat ditolak",
    icon: "event_busy",
  },
};

const rentalBadgeConfig: Record<
  RentalDisplayStatus,
  { label: string; className: string }
> = {
  active: { label: "Aktif", className: "bg-emerald-500" },
  upcoming: { label: "Akan Datang", className: "bg-blue-500" },
  completed: { label: "Selesai", className: "bg-slate-400 dark:bg-slate-600" },
  stopped: { label: "Dihentikan", className: "bg-rose-500" },
};

export function DriverDashboardPage() {
  const { user } = useAuth();
  const driverId = user?.driver_id ?? null;

  const driverQuery = useQuery({
    queryKey: driverKeys.me(),
    queryFn: async () => {
      const res = await driverApi.getMe();
      return (res?.data ?? res) as DriverItem;
    },
    enabled: !!driverId,
  });

  const feeQuery = useQuery({
    queryKey: financeKeys.myList({ limit: 10 }),
    queryFn: async () => {
      const res = await financeApi.getMyFinances({ limit: 10 });
      return Array.isArray(res?.data) ? res.data : [];
    },
    enabled: !!driverId,
  });

  const koinQuery = useQuery({
    queryKey: koinKeys.balance(driverId ?? ""),
    queryFn: async () => {
      const res = await koinApi.getBalance(driverId!);
      const data =
        (res as { data?: { balance?: string | number } })?.data ?? res;
      const balance = Number((data as { balance?: string | number })?.balance);
      return Number.isFinite(balance) ? balance : 0;
    },
    enabled: !!driverId,
  });

  const dailyQuery = useQuery({
    queryKey: financeKeys.myDailyPayments({ limit: 10 }),
    queryFn: async () => {
      const res = await financeApi.getMyDailyPayments({ limit: 10 });
      const data = (res as { data?: unknown })?.data ?? res;
      const items = Array.isArray(data)
        ? data
        : ((data as { data?: unknown })?.data ?? []);
      return Array.isArray(items) ? (items as DailyPaymentItem[]) : [];
    },
    enabled: !!driverId,
  });

  const driver = driverQuery.data ?? null;
  const feeBills: FinanceItem[] = feeQuery.data ?? [];
  const dailyPayments: DailyPaymentItem[] = dailyQuery.data ?? [];
  const koinBalance = koinQuery.data ?? null;
  const isLoading = driverQuery.isLoading;
  const isRefreshing =
    driverQuery.isFetching || koinQuery.isFetching || feeQuery.isFetching;

  const fullName = driver
    ? `${driver.first_name} ${driver.last_name}`.trim()
    : user?.driver_name || user?.username || "Driver";
  // Riwayat pemakaian unit (aktif + selesai), urut dari yang terbaru.
  const rentalHistory = [...(driver?.rentals ?? [])].sort(
    (a, b) =>
      new Date(b.start_date ?? 0).getTime() -
      new Date(a.start_date ?? 0).getTime(),
  );
  const activeRentals = rentalHistory.filter(
    (rental) =>
      getRentalDisplayStatus(
        rental.status,
        rental.start_date,
        rental.end_date,
      ) === "active",
  ).length;

  const billRows = [
    ...feeBills.map((f) => ({
      id: `fee-${f.id}`,
      date: f.payment_date || f.created_at || "",
      vehicleName:
        f.fee_kind === "additional_charge"
          ? f.charge_name || "Tagihan Tambahan"
          : "-",
      subLabel:
        f.fee_kind === "additional_charge" ? "Tagihan Tambahan" : null,
      subTitle:
        f.fee_kind === "additional_charge" ? f.reason || null : null,
      amount: Number(f.fee_admin_join) || 0,
      status: f.status,
      href: `/dashboard/driver/payment/form?id=${f.id}`,
      izinStatus: null as "pending" | "approved" | "rejected" | null,
      izinNote: null as string | null,
    })),
    ...dailyPayments.map((dp) => ({
      id: `daily-${dp.id}`,
      date: dp.payment_date,
      vehicleName: dp.vehicle_name,
      subLabel: null as string | null,
      subTitle: null as string | null,
      amount: dp.amount,
      status: dp.status,
      href: `/dashboard/driver/payment/form?id=${dp.id}&type=daily`,
      izinStatus: dp.izin_status ?? null,
      izinNote: dp.izin?.admin_note ?? null,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full flex flex-col gap-8 pb-10">
          <PageHeader
            title={`Selamat Datang, ${fullName}`}
            description="Selamat datang di portal mitra driver Mahkota Fleet"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dashboard/driver/koin"
              title="Lihat riwayat koin saya"
              className="block rounded-xl outline-none transition-all hover:ring-2 hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <PaymentCard
                title="Koin Utama"
                value={
                  koinBalance === null
                    ? "…"
                    : `${koinBalance.toLocaleString("id-ID")} Koin`
                }
                icon="toll"
                iconColor="text-primary"
                trend={{
                  value:
                    koinBalance === null
                      ? isRefreshing
                        ? "Menyinkronkan ulang…"
                        : "Memuat saldo…"
                      : `Setara ${formatIDR(koinBalance)} · Lihat riwayat koin →`,
                  color: "text-primary",
                  icon: "account_balance_wallet",
                }}
              />
            </Link>
            <PaymentCard
              title="Status Keanggotaan"
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
              title="Unit Operasional"
              value={isLoading ? "…" : `${activeRentals} Unit`}
              icon="directions_car"
              iconColor={
                activeRentals > 0 ? "text-emerald-500" : "text-slate-400"
              }
              trend={{
                value: isLoading
                  ? "Memuat unit…"
                  : activeRentals > 0
                    ? "Aktif Beroperasi"
                    : "Belum ada unit aktif",
                color:
                  !isLoading && activeRentals > 0
                    ? "text-emerald-500"
                    : "text-slate-400",
                icon: !isLoading && activeRentals > 0 ? "check_circle" : "info",
              }}
            />
          </div>

          {/* Vehicle Cards / Slider — riwayat unit yang pernah dipakai */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {rentalHistory.length > 0 && (
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-500 text-xl">
                        directions_car
                      </span>
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white text-base">
                        Unit Kendaraan Saya
                      </h2>
                      <p className="text-xs text-slate-400">
                        {rentalHistory.length} unit pernah dipakai
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={16}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    className="driver-vehicle-swiper"
                  >
                    {rentalHistory.map((rental) => {
                      const vehicle = rental.vehicle;
                      if (!vehicle) return null;
                      const badge =
                        rentalBadgeConfig[
                          getRentalDisplayStatus(
                            rental.status,
                            rental.start_date,
                            rental.end_date,
                          )
                        ];
                      const photos = vehicle.vehicle_photo;
                      const imageUrl =
                        Array.isArray(photos) && photos.length > 0
                          ? photos[0]
                          : typeof photos === "string" && photos
                            ? photos
                            : PLACEHOLDER_IMG;

                      return (
                        <SwiperSlide key={rental.id}>
                          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
                              {imageUrl === PLACEHOLDER_IMG ? (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">
                                    directions_car
                                  </span>
                                </div>
                              ) : (
                                <img
                                  src={imageUrl}
                                  alt={`${vehicle.merk} ${vehicle.model}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    target.parentElement?.classList.add(
                                      "flex",
                                      "items-center",
                                      "justify-center",
                                    );
                                    const fallback =
                                      document.createElement("span");
                                    fallback.className =
                                      "material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600";
                                    fallback.textContent = "directions_car";
                                    target.parentElement?.appendChild(fallback);
                                  }}
                                />
                              )}
                              <div className="absolute top-3 right-3">
                                <span
                                  className={`px-2.5 py-1 text-white text-xs font-semibold rounded-full ${badge.className}`}
                                >
                                  {badge.label}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                {vehicle.merk} {vehicle.model}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
                                {vehicle.license_plate}
                              </p>
                              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="material-symbols-outlined text-[14px]">
                                    calendar_today
                                  </span>
                                  <span>
                                    {formatDate(rental.start_date)} -{" "}
                                    {formatDate(rental.end_date)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="material-symbols-outlined text-[14px]">
                                    speed
                                  </span>
                                  <span>
                                    {rental.total_duration} hari &middot;{" "}
                                    {formatIDR(rental.daily_rate || 0)}/hari
                                  </span>
                                </div>
                                {vehicle.color && (
                                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-[14px]">
                                      palette
                                    </span>
                                    <span>{vehicle.color}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>
            )}
            <DriverQuickActions />
          </div>

          {/* Tagihan — data general (fee membership + daily payment), tanpa tab, kolom tetap */}
          {billRows.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-orange-500 text-xl">
                      pending
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 dark:text-white text-base">
                      Tagihan Saya
                    </h2>
                    <p className="text-xs text-slate-400">
                      {billRows.length} tagihan tercatat
                    </p>
                  </div>
                </div>
                <a
                  href="/dashboard/driver/payment"
                  className="text-xs text-primary hover:text-primary/80 font-semibold"
                >
                  Lihat Semua
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-6 py-3">Tanggal</th>
                      <th className="px-6 py-3">Kendaraan</th>
                      <th className="px-6 py-3">Jumlah</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {billRows.map((row) => {
                      const st =
                        statusConfig[row.status] || statusConfig.unpaid;
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">
                            {formatDate(row.date)}
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {row.vehicleName}
                            </span>
                            {row.subLabel && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 align-middle">
                                {row.subLabel}
                              </span>
                            )}
                            {row.subTitle && (
                              <p
                                className="text-xs text-slate-400 truncate max-w-[220px]"
                                title={row.subTitle}
                              >
                                {row.subTitle}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-semibold text-orange-600 dark:text-orange-400">
                              {formatIDR(row.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.color}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                              />
                              {st.label}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="inline-flex items-center justify-end gap-2">
                              {row.status === "unpaid" && (
                                <a
                                  href={row.href}
                                  title="Bayar Tagihan"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    payments
                                  </span>
                                </a>
                              )}
                              {row.izinStatus ? (
                                <span
                                  title={`${
                                    izinBadgeConfig[row.izinStatus].title
                                  }${
                                    row.izinNote
                                      ? ` — Catatan: ${row.izinNote}`
                                      : ""
                                  }`}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-semibold whitespace-nowrap ${izinBadgeConfig[row.izinStatus].className}`}
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    {izinBadgeConfig[row.izinStatus].icon}
                                  </span>
                                  Izin Telat
                                </span>
                              ) : row.status !== "unpaid" ? (
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-xl">
                                  check_circle
                                </span>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  support_agent
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Butuh Bantuan?
                </h3>
                <p className="text-xs text-slate-400">
                  Hubungi Tim Finance Mahkota Fleet
                </p>
              </div>
            </div>
            <a
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-semibold"
              href="https://wa.me/6281198760000"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">
                chat
              </span>
              WhatsApp Finance: 0811-9876-0000
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

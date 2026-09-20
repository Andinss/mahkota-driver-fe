"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { PaymentCard } from "@/components/finance/payment-list/card";
import { useAuth } from "@/lib/auth-context";
import { driverApi } from "@/lib/api/driver";
import { financeApi } from "@/lib/api/finances";
import { saldoApi } from "@/lib/api/saldo";
import type { DriverItem } from "@/lib/types/driver";
import type { FinanceItem } from "@/lib/types/finances";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
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

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const PLACEHOLDER_IMG = "/images/placeholder-car.jpg";

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  unpaid: { label: "Belum Dibayar", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", dot: "bg-red-500" },
  pending: { label: "Menunggu Verifikasi", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", dot: "bg-amber-500" },
  partially_paid: { label: "Partially Paid", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", dot: "bg-blue-500" },
  paid: { label: "Lunas", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", dot: "bg-emerald-500" },
  cancelled: { label: "Dibatalkan", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", dot: "bg-slate-400" },
};

export function DriverDashboardPage() {
  const { user } = useAuth();
  const [driver, setDriver] = useState<DriverItem | null>(null);
  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [saldoBalance, setSaldoBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.driver_id) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [driverRes, financesRes, saldoRes] = await Promise.allSettled([
          driverApi.getMe(),
          financeApi.getMyFinances({ limit: 5 }),
          saldoApi.getBalance(user.driver_id!),
        ]);

        if (driverRes.status === "fulfilled") {
          const data = (driverRes.value as any)?.data ?? driverRes.value;
          setDriver(data);
        }
        if (financesRes.status === "fulfilled") {
          const res = financesRes.value as any;
          const data = res?.data ?? res;
          const items = Array.isArray(data) ? data : data?.data ?? [];
          setFinances(items);
        }
        if (saldoRes.status === "fulfilled") {
          const data = (saldoRes.value as any)?.data ?? saldoRes.value;
          setSaldoBalance(data?.balance ?? 0);
        }
      } catch (err) {
        console.error("Failed to fetch driver data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.driver_id]);

  const fullName = driver
    ? `${driver.first_name} ${driver.last_name}`.trim()
    : user?.username || "Driver";
  const activeRentals = driver?.rentals?.length ?? 0;
  const openBills = finances.filter((f) => ["unpaid", "partially_paid"].includes(f.status));
  const totalRemaining = finances.reduce((sum, f) => sum + (f.remaining_amount || 0), 0);

  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-10">
          <PageHeader
            title={`Selamat Datang, ${fullName}`}
            description="Selamat datang di portal mitra driver Mahkota Fleet"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <PaymentCard
              title="Saldo Koin Utama"
              value={`${saldoBalance.toLocaleString("id-ID")} Koin`}
              icon="toll"
              iconColor="text-primary"
              trend={{
                value: `Setara ${formatIDR(saldoBalance)}`,
                color: "text-primary",
                icon: "account_balance_wallet",
              }}
            />
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

          {/* Vehicle Cards / Slider */}
          {driver?.rentals && driver.rentals.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-500 text-xl">directions_car</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 dark:text-white text-base">
                      Unit Kendaraan Saya
                    </h2>
                    <p className="text-xs text-slate-400">{driver.rentals.length} unit aktif</p>
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
                  breakpoints={{
                    640: { slidesPerView: driver.rentals.length > 1 ? 2 : 1 },
                    1024: { slidesPerView: driver.rentals.length > 2 ? 3 : driver.rentals.length },
                  }}
                  className="driver-vehicle-swiper"
                >
                  {driver.rentals.map((rental) => {
                    const vehicle = rental.vehicle;
                    if (!vehicle) return null;
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
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">directions_car</span>
                              </div>
                            ) : (
                              <img
                                src={imageUrl}
                                alt={`${vehicle.merk} ${vehicle.model}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.parentElement?.classList.add("flex", "items-center", "justify-center");
                                  const fallback = document.createElement("span");
                                  fallback.className = "material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600";
                                  fallback.textContent = "directions_car";
                                  target.parentElement?.appendChild(fallback);
                                }}
                              />
                            )}
                            <div className="absolute top-3 right-3">
                              <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                                Aktif
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
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>{formatDate(rental.start_date)} - {formatDate(rental.end_date)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined text-[14px]">speed</span>
                                <span>{rental.total_duration} hari &middot; {formatIDR(rental.daily_rate || 0)}/hari</span>
                              </div>
                              {vehicle.color && (
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="material-symbols-outlined text-[14px]">palette</span>
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

          {openBills.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-orange-500 text-xl">pending</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 dark:text-white text-base">
                      Tagihan Belum Dibayar
                    </h2>
                    <p className="text-xs text-slate-400">{openBills.length} tagihan menunggu pembayaran</p>
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
                      <th className="px-6 py-3">No. Referensi</th>
                      <th className="px-6 py-3">Kendaraan</th>
                      <th className="px-6 py-3">Sisa Tagihan</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {openBills.slice(0, 5).map((finance) => {
                      const st = statusConfig[finance.status] || statusConfig.unpaid;
                      const vehicle = finance.vehicle || finance.rentals?.[0]?.vehicle;
                      const vehicleName = vehicle
                        ? `${vehicle.merk} ${vehicle.model}`
                        : "-";

                      return (
                        <tr key={finance.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-3">
                            <span className="font-mono font-semibold text-sm text-primary">
                              {finance.reference_number}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-semibold text-slate-900 dark:text-white">{vehicleName}</span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-semibold text-orange-600 dark:text-orange-400">
                              {formatIDR(finance.remaining_amount)}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                              {st.label}
                            </span>
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
                <span className="material-symbols-outlined text-primary text-xl">support_agent</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Butuh Bantuan?
                </h3>
                <p className="text-xs text-slate-400">Hubungi Tim Finance Mahkota Fleet</p>
              </div>
            </div>
            <a
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-semibold"
              href="https://wa.me/6281198760000"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              WhatsApp Finance: 0811-9876-0000
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { financeApi } from "@/lib/api/finances";
import { useAuth } from "@/lib/auth-context";
import { toastError } from "@/components/ui/toast-provider";
import { Pagination } from "@/components/ui/pagination";
import { FeeBillDetailModal } from "@/components/finance/fee-bill-detail-modal";
import type { FinanceItem, DailyPaymentItem } from "@/lib/types/finances";
import { formatDateOnly, formatDateTime } from "@/lib/utils/format";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  unpaid: { label: "Belum Dibayar", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", dot: "bg-red-500" },
  pending: { label: "Menunggu Verifikasi", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", dot: "bg-amber-500" },
  paid: { label: "Lunas", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", dot: "bg-emerald-500" },
  cancelled: { label: "Dibatalkan", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", dot: "bg-slate-400" },
};

export function DriverPaymentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [adminFee, setAdminFee] = useState<FinanceItem | null>(null);
  const [dailyPayments, setDailyPayments] = useState<DailyPaymentItem[]>([]);
  const [dailyMeta, setDailyMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [dailyPage, setDailyPage] = useState(1);
  const [dailyPageSize, setDailyPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDaily, setIsLoadingDaily] = useState(false);
  const [activeTab, setActiveTab] = useState<"admin" | "daily">("daily");
  const [feeList, setFeeList] = useState<FinanceItem[]>([]);
  const [feeMeta, setFeeMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [feePage, setFeePage] = useState(1);
  const [feePageSize, setFeePageSize] = useState(10);
  const [isLoadingFees, setIsLoadingFees] = useState(false);
  const [detailFeeId, setDetailFeeId] = useState<string | null>(null);

  const fetchFeeList = useCallback(async () => {
    if (!user?.driver_id) return;
    setIsLoadingFees(true);
    try {
      const res = await financeApi.getMyFinances({
        page: feePage,
        limit: feePageSize,
      });
      setFeeList(Array.isArray(res?.data) ? res.data : []);
      if (res?.meta) setFeeMeta(res.meta);
    } catch {
      setFeeList([]);
    } finally {
      setIsLoadingFees(false);
    }
  }, [user?.driver_id, feePage, feePageSize]);

  const fetchDailyPayments = useCallback(async () => {
    if (!user?.driver_id) return;
    setIsLoadingDaily(true);
    try {
      const dailyRes = await financeApi.getMyDailyPayments({
        page: dailyPage,
        limit: dailyPageSize,
      });
      const dailyData = (dailyRes as any)?.data ?? dailyRes;
      const items = Array.isArray(dailyData) ? dailyData : dailyData?.data ?? [];
      setDailyPayments(items);
      if ((dailyRes as any)?.meta) {
        setDailyMeta((dailyRes as any).meta);
      }
    } catch {
      setDailyPayments([]);
    } finally {
      setIsLoadingDaily(false);
    }
  }, [user?.driver_id, dailyPage, dailyPageSize]);

  const fetchData = useCallback(async () => {
    if (!user?.driver_id) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const adminFeeRes = await financeApi.getMyAdminFee();
      const adminFeeData = (adminFeeRes as any)?.data ?? adminFeeRes;
      setAdminFee(adminFeeData?.id ? adminFeeData : null);
    } catch (err) {
      console.error("Failed to fetch payment data:", err);
      toastError("Gagal memuat data tagihan");
    } finally {
      setIsLoading(false);
    }
  }, [user?.driver_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchDailyPayments();
  }, [fetchDailyPayments]);

  useEffect(() => {
    if (activeTab === "admin") {
      fetchFeeList();
    }
  }, [activeTab, fetchFeeList]);

  const adminFeePaid = adminFee?.status === "paid";
  const hasAdminFee = !!adminFee?.id;
  const adminFeeUnpaid = hasAdminFee && !adminFeePaid;
  const totalUnpaidDaily = dailyPayments
    .filter((dp) => dp.status === "unpaid")
    .reduce((sum, dp) => sum + dp.amount, 0);
  const totalUnpaidFee = feeList
    .filter((f) => f.status === "unpaid")
    .reduce((sum, f) => sum + (Number(f.fee_admin_join) || 0), 0);

  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-10">
          <PageHeader
            title="Pembayaran Saya"
            description="Lihat dan bayar tagihan sewa kendaraan Anda"
          />

          {/* Tab Navigation */}
          <div className="flex gap-1 border-b border-[#dbe0e6] dark:border-gray-700">
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "daily"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300"
              }`}
            >
              Daily Payment
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "admin"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300"
              }`}
            >
              Admin Fee
              {adminFeeUnpaid && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block animate-spin">hourglass_empty</span>
              <p className="text-sm text-slate-400">Memuat data tagihan...</p>
            </div>
          ) : (
            <>
              {/* Admin Fee Tab — tabel riwayat tagihan Fee Membership */}
              {activeTab === "admin" && (
                isLoadingFees ? (
                  <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm p-12 text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block animate-spin">hourglass_empty</span>
                    <p className="text-sm text-slate-400">Memuat tagihan fee membership...</p>
                  </div>
                ) : feeList.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm p-8 text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">receipt_long</span>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Belum Ada Tagihan</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500">Tagihan akan muncul setelah membership dipilih.</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-amber-500 text-xl">admin_panel_settings</span>
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-800 dark:text-white text-base">Fee Membership</h2>
                          <p className="text-xs text-slate-400">Biaya membership driver</p>
                        </div>
                      </div>
                      {totalUnpaidFee > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Total Belum Dibayar</p>
                          <p className="font-bold text-amber-600 dark:text-amber-400">{formatIDR(totalUnpaidFee)}</p>
                        </div>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1000px] text-left text-sm whitespace-nowrap">
                        <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                          <tr>
                            <th className="px-6 py-4">No. Referensi</th>
                            <th className="px-6 py-4">Keterangan</th>
                            <th className="px-6 py-4">Jumlah</th>
                            <th className="px-6 py-4">Sisa Tagihan</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                            <th className="px-6 py-4">Tanggal Dibuat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                          {feeList.map((f) => {
                            const st = statusConfig[f.status] || statusConfig.unpaid;
                            const sisa = Number(f.remaining_amount) || 0;
                            return (
                              <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-mono font-semibold text-sm text-primary">{f.reference_number}</td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-[320px] truncate" title={f.notes}>{f.notes || "-"}</td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatIDR(f.fee_admin_join || 0)}</td>
                                <td className={`px-6 py-4 font-bold ${sisa > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"}`}>
                                  {sisa > 0 ? formatIDR(sisa) : formatIDR(0)}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${st.bg} ${st.color}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                    {st.label}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      onClick={() => setDetailFeeId(f.id)}
                                      title="Detail Pembayaran"
                                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                                    </button>
                                    {f.status === "unpaid" ? (
                                      <button
                                        onClick={() => router.push(`/dashboard/driver/payment/form?id=${f.id}`)}
                                        title="Bayar Fee Membership"
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-[18px]">payments</span>
                                      </button>
                                    ) : (
                                      <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-xl">check_circle</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                  {f.created_at ? formatDateOnly(f.created_at) : formatDateOnly(f.payment_date)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <Pagination
                      currentPage={feeMeta.page}
                      totalPages={feeMeta.totalPages}
                      totalResults={feeMeta.total}
                      resultsPerPage={feePageSize}
                      onPageChange={setFeePage}
                      onPageSizeChange={(size) => {
                        setFeePageSize(size);
                        setFeePage(1);
                      }}
                    />
                  </div>
                )
              )}

              {/* Daily Payments Tab — langsung tampil tanpa perlu bayar admin fee dulu */}
              {activeTab === "daily" && (
                <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-500 text-xl">calendar_today</span>
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800 dark:text-white text-base">Tagihan Harian</h2>
                        <p className="text-xs text-slate-400">{dailyPayments.length} tagihan tercatat</p>
                      </div>
                    </div>
                    {totalUnpaidDaily > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Total Belum Dibayar</p>
                        <p className="font-bold text-orange-600 dark:text-orange-400">{formatIDR(totalUnpaidDaily)}</p>
                      </div>
                    )}
                  </div>

                  {isLoadingDaily ? (
                    <div className="p-12 text-center">
                      <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block animate-spin">hourglass_empty</span>
                      <p className="text-sm text-slate-400">Memuat tagihan harian...</p>
                    </div>
                  ) : dailyPayments.length === 0 ? (
                    <div className="p-12 text-center">
                      <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">check_circle</span>
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Tidak Ada Tagihan</h3>
                      <p className="text-sm text-slate-400 dark:text-slate-500">Semua tagihan harian sudah lunas.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] text-left text-sm whitespace-nowrap">
                        <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                          <tr>
                            <th className="px-6 py-4">Kendaraan</th>
                            <th className="px-6 py-4">Plat Nomor</th>
                            <th className="px-6 py-4">Vendor</th>
                            <th className="px-6 py-4">Jumlah</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                            <th className="px-6 py-4">Tanggal Dibuat</th>
                            <th className="px-6 py-4">Tanggal Bayar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                          {dailyPayments.map((dp) => {
                            const st = statusConfig[dp.status] || statusConfig.unpaid;
                            return (
                              <tr key={dp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                           
                                <td className="px-6 py-4">
                                  <span className="font-semibold text-slate-900 dark:text-white">{dp.vehicle_name}</span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-400">{dp.license_plate}</td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{dp.vendor_name}</td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatIDR(dp.amount)}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${st.bg} ${st.color}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                    {st.label}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {dp.status === "unpaid" ? (
                                    <a
                                      href={`/dashboard/driver/payment/form?id=${dp.id}&type=daily`}
                                      title="Bayar Tagihan Harian"
                                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">payments</span>
                                    </a>
                                  ) : (
                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-xl">check_circle</span>
                                  )}
                                </td>
                                     <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                  {formatDateTime(dp.created_at)}
                                </td>
                                     <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                {dp.status === "paid"
                                  ? formatDateTime(dp.updated_at)
                                  : "-"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {dailyPayments.length > 0 && (
                    <Pagination
                      currentPage={dailyMeta.page}
                      totalPages={dailyMeta.totalPages}
                      totalResults={dailyMeta.total}
                      resultsPerPage={dailyPageSize}
                      onPageChange={setDailyPage}
                      onPageSizeChange={(size) => {
                        setDailyPageSize(size);
                        setDailyPage(1);
                      }}
                    />
                  )}
                </div>
              )}

              {/* Help */}
              <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">support_agent</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">Butuh Bantuan?</h3>
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
            </>
          )}

          {/* Detail pembayaran fee membership */}
          <FeeBillDetailModal
            financeId={detailFeeId}
            onClose={() => setDetailFeeId(null)}
            onPay={(id) => {
              setDetailFeeId(null);
              router.push(`/dashboard/driver/payment/form?id=${id}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}

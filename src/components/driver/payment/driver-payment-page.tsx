"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { financeApi } from "@/lib/api/finances";
import { useAuth } from "@/lib/auth-context";
import { toastError, toastSuccess } from "@/components/ui/toast-provider";
import { Pagination } from "@/components/ui/pagination";
import { FeeBillDetailModal } from "@/components/finance/fee-bill-detail-modal";
import { ProofUpload } from "@/components/driver/payment/proof-upload";
import type { FinanceItem, DailyPaymentItem } from "@/lib/types/finances";
import { financeKeys } from "@/lib/query-keys";
import { formatDateOnly, formatDateTime } from "@/lib/utils/format";
import { resolveImageUrl } from "@/lib/utils/image";

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
  rejected: { label: "Ditolak", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", dot: "bg-rose-500" },
  cancelled: { label: "Dibatalkan", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", dot: "bg-slate-400" },
};

/** Tampilan status izin telat bayar + dampaknya terhadap penghitungan telat. */
const izinStatusMeta: Record<
  "pending" | "approved" | "rejected",
  {
    label: string;
    icon: string;
    boxBg: string;
    boxBorder: string;
    iconColor: string;
    badge: string;
    impact: string;
    impactColor: string;
  }
> = {
  pending: {
    label: "Menunggu Persetujuan",
    icon: "hourglass_top",
    boxBg: "bg-amber-50 dark:bg-amber-900/20",
    boxBorder: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-500",
    badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    impact: "Menunggu keputusan supervisor.",
    impactColor: "text-amber-700 dark:text-amber-400",
  },
  approved: {
    label: "Disetujui",
    icon: "task_alt",
    boxBg: "bg-emerald-50 dark:bg-emerald-900/20",
    boxBorder: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-500",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    impact: "Hari ini TIDAK dihitung sebagai keterlambatan.",
    impactColor: "text-emerald-700 dark:text-emerald-400",
  },
  rejected: {
    label: "Ditolak",
    icon: "cancel",
    boxBg: "bg-rose-50 dark:bg-rose-900/20",
    boxBorder: "border-rose-200 dark:border-rose-800",
    iconColor: "text-rose-500",
    badge: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
    impact: "Hari ini tetap dihitung sebagai keterlambatan.",
    impactColor: "text-rose-700 dark:text-rose-400",
  },
};

/**
 * Status tampilan tagihan fee membership. Pembayaran yang ditolak admin
 * (`cancelled`) membuat tagihan kembali `unpaid`; supaya driver tahu,
 * tagihan tanpa pembayaran valid yang punya riwayat ditolak ditampilkan
 * sebagai "Ditolak" beserta alasannya.
 */
const feeDisplayStatus = (
  f: FinanceItem,
): { key: string; reason: string | null } => {
  const rejected = (f.payments || []).filter((p) => p.status === "cancelled");
  const lastRejected = rejected[rejected.length - 1];
  const hasPaidPayment = (f.payments || []).some((p) => p.status === "paid");
  if (
    (f.status === "unpaid" || f.status === "rejected") &&
    !hasPaidPayment &&
    lastRejected
  ) {
    return { key: "rejected", reason: lastRejected.rejection_reason ?? null };
  }
  return { key: f.status, reason: null };
};

export function DriverPaymentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const driverId = user?.driver_id ?? null;
  const [dailyPage, setDailyPage] = useState(1);
  const [dailyPageSize, setDailyPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<"admin" | "daily" | "additional">(
    "daily",
  );
  const [feePage, setFeePage] = useState(1);
  const [feePageSize, setFeePageSize] = useState(10);
  const [addPage, setAddPage] = useState(1);
  const [addPageSize, setAddPageSize] = useState(10);
  const [detailFeeId, setDetailFeeId] = useState<string | null>(null);
  // Dialog ajukan izin telat bayar (per tagihan harian).
  const [izinTarget, setIzinTarget] = useState<DailyPaymentItem | null>(null);
  const [izinReason, setIzinReason] = useState("");
  const [izinProof, setIzinProof] = useState<{
    value: string | null;
    file: File | null;
  }>({ value: null, file: null });
  const [isSubmittingIzin, setIsSubmittingIzin] = useState(false);
  // Modal detail izin telat (status + catatan supervisor).
  const [izinDetail, setIzinDetail] = useState<DailyPaymentItem | null>(null);

  const adminFeeQuery = useQuery({
    queryKey: financeKeys.myAdminFee(),
    queryFn: async () => {
      const res = await financeApi.getMyAdminFee();
      const data = (res as { data?: FinanceItem })?.data ?? res;
      return (data as FinanceItem)?.id ? (data as FinanceItem) : null;
    },
    enabled: !!driverId,
  });

  const dailyQuery = useQuery({
    queryKey: financeKeys.myDailyPayments({
      page: dailyPage,
      limit: dailyPageSize,
    }),
    queryFn: async () => {
      const res = await financeApi.getMyDailyPayments({
        page: dailyPage,
        limit: dailyPageSize,
      });
      const data = (res as { data?: unknown })?.data ?? res;
      const items = Array.isArray(data)
        ? data
        : ((data as { data?: unknown })?.data ?? []);
      return {
        items: Array.isArray(items) ? (items as DailyPaymentItem[]) : [],
        meta: res?.meta,
      };
    },
    enabled: !!driverId,
  });

  const feeListQuery = useQuery({
    queryKey: financeKeys.myList({ page: feePage, limit: feePageSize, exclude_fee_kind: "additional_charge" }),
    queryFn: async () => {
      const res = await financeApi.getMyFinances({
        page: feePage,
        limit: feePageSize,
        // Tagihan tambahan punya tab sendiri — jangan dicampur ke sini.
        exclude_fee_kind: "additional_charge",
      });
      return {
        items: Array.isArray(res?.data) ? res.data : [],
        meta: res?.meta,
      };
    },
    enabled: !!driverId && activeTab === "admin",
  });

  const additionalQuery = useQuery({
    queryKey: financeKeys.myList({ page: addPage, limit: addPageSize, fee_kind: "additional_charge" }),
    queryFn: async () => {
      const res = await financeApi.getMyFinances({
        page: addPage,
        limit: addPageSize,
        fee_kind: "additional_charge",
      });
      return {
        items: Array.isArray(res?.data) ? res.data : [],
        meta: res?.meta,
      };
    },
    // Selalu aktif supaya penanda "ada tagihan tambahan" di tab ikut terisi.
    enabled: !!driverId,
  });

  const adminFee = adminFeeQuery.data ?? null;
  const dailyPayments = dailyQuery.data?.items ?? [];
  const dailyMeta = dailyQuery.data?.meta ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };
  const feeList = feeListQuery.data?.items ?? [];
  const feeMeta = feeListQuery.data?.meta ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };
  const additionalList = additionalQuery.data?.items ?? [];
  const additionalMeta = additionalQuery.data?.meta ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };
  const isLoading = !!driverId && adminFeeQuery.isLoading;
  const isLoadingDaily = dailyQuery.isFetching;
  const isLoadingFees = feeListQuery.isFetching;
  const isLoadingAdditional = additionalQuery.isFetching;

  const refreshDaily = () =>
    queryClient.invalidateQueries({ queryKey: financeKeys.all });

  const openIzinDialog = (dp: DailyPaymentItem) => {
    setIzinTarget(dp);
    setIzinReason("");
    setIzinProof({ value: null, file: null });
  };

  const submitIzin = async () => {
    if (!izinTarget) return;
    if (!izinReason.trim()) {
      toastError("Alasan izin wajib diisi");
      return;
    }
    setIsSubmittingIzin(true);
    try {
      await financeApi.createMyLatePayment({
        daily_payment_id: izinTarget.id,
        justification: izinReason.trim(),
        proof_image: izinProof.file,
      });
      toastSuccess(
        "Pengajuan izin telat terkirim, menunggu persetujuan supervisor",
      );
      setIzinTarget(null);
      setIzinReason("");
      setIzinProof({ value: null, file: null });
      refreshDaily();
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Gagal mengirim pengajuan izin",
      );
    } finally {
      setIsSubmittingIzin(false);
    }
  };

  const adminFeePaid = adminFee?.status === "paid";
  const hasAdminFee = !!adminFee?.id;
  const adminFeeUnpaid = hasAdminFee && !adminFeePaid;
  const totalUnpaidDaily = dailyPayments
    .filter((dp) => dp.status === "unpaid" || dp.status === "rejected")
    .reduce((sum, dp) => sum + dp.amount, 0);
  const totalUnpaidFee = feeList
    .filter((f) => f.status === "unpaid")
    .reduce((sum, f) => sum + (Number(f.fee_admin_join) || 0), 0);
  // Sisa tagihan tambahan (mengikuti cicilan yang sudah masuk).
  const totalUnpaidAdditional = additionalList
    .filter((f) => f.status !== "paid" && f.status !== "cancelled")
    .reduce((sum, f) => sum + (Number(f.remaining_amount) || 0), 0);
  const additionalUnpaid = additionalList.some(
    (f) => f.status === "unpaid" || f.status === "rejected",
  );

  const izinMeta = izinDetail?.izin
    ? izinStatusMeta[izinDetail.izin.status]
    : null;

  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full flex flex-col gap-8 pb-10">
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
            <button
              onClick={() => setActiveTab("additional")}
              className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "additional"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300"
              }`}
            >
              Tagihan Tambahan
              {additionalUnpaid && (
                <span className="w-2 h-2 rounded-full bg-orange-500" />
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
                            const display = feeDisplayStatus(f);
                            const st = statusConfig[display.key] || statusConfig.unpaid;
                            const sisa = Number(f.remaining_amount) || 0;
                            const canPay =
                              display.key === "unpaid" || display.key === "rejected";
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
                                  {display.key === "rejected" && display.reason && (
                                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 max-w-[220px] truncate" title={display.reason}>
                                      Alasan: {display.reason}
                                    </p>
                                  )}
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
                                    {canPay ? (
                                      <button
                                        onClick={() => router.push(`/dashboard/driver/payment/form?id=${f.id}`)}
                                        title={
                                          display.key === "rejected"
                                            ? "Ajukan Ulang Pembayaran"
                                            : "Bayar Fee Membership"
                                        }
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-[18px]">payments</span>
                                      </button>
                                    ) : display.key === "pending" ? (
                                      <span
                                        title="Menunggu verifikasi admin"
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                                      >
                                        <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                                      </span>
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

              {/* Tagihan Tambahan Tab — tagihan manual dari admin, terpisah dari Fee Membership */}
              {activeTab === "additional" && (
                isLoadingAdditional && additionalQuery.isLoading ? (
                  <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm p-12 text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block animate-spin">hourglass_empty</span>
                    <p className="text-sm text-slate-400">Memuat tagihan tambahan...</p>
                  </div>
                ) : additionalList.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm p-8 text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">receipt_long</span>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Belum Ada Tagihan Tambahan</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500">Tagihan tambahan (ganti rugi kendaraan, kecelakaan, kehilangan STNK, dll) akan muncul di sini.</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-orange-500 text-xl">receipt_long</span>
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-800 dark:text-white text-base">Tagihan Tambahan</h2>
                          <p className="text-xs text-slate-400">Tagihan manual dari admin, terpisah dari Fee Membership</p>
                        </div>
                      </div>
                      {totalUnpaidAdditional > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Total Belum Dibayar</p>
                          <p className="font-bold text-orange-600 dark:text-orange-400">{formatIDR(totalUnpaidAdditional)}</p>
                        </div>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1100px] text-left text-sm whitespace-nowrap">
                        <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                          <tr>
                            <th className="px-6 py-4">No. Referensi</th>
                            <th className="px-6 py-4">Nama Tagihan</th>
                            <th className="px-6 py-4">Alasan</th>
                            <th className="px-6 py-4">Jumlah</th>
                            <th className="px-6 py-4">Sisa Tagihan</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                            <th className="px-6 py-4">Tanggal Dibuat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                          {additionalList.map((f) => {
                            const display = feeDisplayStatus(f);
                            const st = statusConfig[display.key] || statusConfig.unpaid;
                            const sisa = Number(f.remaining_amount) || 0;
                            const canPay =
                              display.key === "unpaid" || display.key === "rejected";
                            return (
                              <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-mono font-semibold text-sm text-primary">{f.reference_number}</td>
                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white max-w-[260px] truncate" title={f.charge_name || f.notes}>
                                  {f.charge_name || f.notes || "-"}
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-[320px] truncate" title={f.reason || ""}>
                                  {f.reason || "-"}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatIDR(f.fee_admin_join || 0)}</td>
                                <td className={`px-6 py-4 font-bold ${sisa > 0 ? "text-orange-600 dark:text-orange-400" : "text-slate-400 dark:text-slate-500"}`}>
                                  {sisa > 0 ? formatIDR(sisa) : formatIDR(0)}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${st.bg} ${st.color}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                    {st.label}
                                  </span>
                                  {display.key === "rejected" && display.reason && (
                                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 max-w-[220px] truncate" title={display.reason}>
                                      Alasan: {display.reason}
                                    </p>
                                  )}
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
                                    {canPay ? (
                                      <button
                                        onClick={() => router.push(`/dashboard/driver/payment/form?id=${f.id}`)}
                                        title={display.key === "rejected" ? "Ajukan Ulang Pembayaran" : "Bayar Tagihan Tambahan"}
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-[18px]">payments</span>
                                      </button>
                                    ) : display.key === "pending" ? (
                                      <span
                                        title="Menunggu verifikasi admin"
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                                      >
                                        <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                                      </span>
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
                      currentPage={additionalMeta.page}
                      totalPages={additionalMeta.totalPages}
                      totalResults={additionalMeta.total}
                      resultsPerPage={addPageSize}
                      onPageChange={setAddPage}
                      onPageSizeChange={(size) => {
                        setAddPageSize(size);
                        setAddPage(1);
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
                                  <div className="inline-flex items-center justify-end gap-1.5">
                                    {(dp.status === "unpaid" ||
                                      dp.status === "rejected") && (
                                      <a
                                        href={`/dashboard/driver/payment/form?id=${dp.id}&type=daily`}
                                        title={
                                          dp.status === "rejected"
                                            ? "Ajukan Ulang Pembayaran"
                                            : "Bayar Tagihan Harian"
                                        }
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-[18px]">payments</span>
                                      </a>
                                    )}
                                    {dp.izin_status ? (
                                      <button
                                        type="button"
                                        onClick={() => setIzinDetail(dp)}
                                        title={
                                          dp.izin_status === "approved"
                                            ? "Izin telat disetujui — lihat detail"
                                            : dp.izin_status === "rejected"
                                              ? "Izin telat ditolak — lihat detail"
                                              : "Izin telat menunggu persetujuan — lihat detail"
                                        }
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-semibold whitespace-nowrap transition-colors ${
                                          dp.izin_status === "approved"
                                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-500 hover:text-white"
                                            : dp.izin_status === "rejected"
                                              ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-500 hover:text-white"
                                              : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-500 hover:text-white"
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-[14px]">
                                          {dp.izin_status === "approved"
                                            ? "task_alt"
                                            : dp.izin_status === "rejected"
                                              ? "event_busy"
                                              : "hourglass_top"}
                                        </span>
                                        Izin Telat
                                      </button>
                                    ) : dp.status === "unpaid" ||
                                      dp.status === "rejected" ? (
                                      <button
                                        type="button"
                                        onClick={() => openIzinDialog(dp)}
                                        title="Ajukan izin telat bayar"
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold whitespace-nowrap hover:bg-slate-500 hover:text-white hover:border-slate-500 transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-[14px]">event_busy</span>
                                        Izin Telat
                                      </button>
                                    ) : dp.status === "pending" ? (
                                      <span
                                        title="Menunggu verifikasi admin"
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                                      >
                                        <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                                      </span>
                                    ) : (
                                      <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-xl">check_circle</span>
                                    )}
                                  </div>
                                </td>
                                     <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                  {formatDateTime(dp.created_at)}
                                </td>
                                     <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                {dp.status === "paid"
                                  ? formatDateTime(dp.updated_at)
                                  : dp.paid_date
                                    ? formatDateOnly(dp.paid_date)
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

          {/* Dialog ajukan izin telat bayar */}
          {izinTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => !isSubmittingIzin && setIzinTarget(null)}
              />
              <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-500 text-xl">
                      event_busy
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Ajukan Izin Telat Bayar
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pengajuan akan disetujui oleh Supervisor
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm space-y-1.5">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400">
                      Kendaraan
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white text-right">
                      {izinTarget.vehicle_name}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400">
                      Plat
                    </span>
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                      {izinTarget.license_plate}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400">
                      Tanggal Tagihan
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatDateOnly(izinTarget.payment_date)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400">
                      Nominal
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatIDR(izinTarget.amount)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                    Alasan Izin <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={izinReason}
                    onChange={(e) => setIzinReason(e.target.value)}
                    rows={3}
                    maxLength={500}
                    disabled={isSubmittingIzin}
                    placeholder="Contoh: keperluan keluarga mendesak / kendala teknis"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                    Upload Evidence (opsional)
                  </label>
                  <ProofUpload
                    value={izinProof.value}
                    file={izinProof.file}
                    onChange={setIzinProof}
                    label="Evidence"
                    icon="image"
                    title="Tarik & letakkan foto evidence di sini"
                    note="Unggah foto/screenshot pendukung sebagai bukti (opsional)."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    onClick={() => setIzinTarget(null)}
                    disabled={isSubmittingIzin}
                    className="px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={submitIzin}
                    disabled={isSubmittingIzin}
                    className="px-4 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {isSubmittingIzin ? "hourglass_empty" : "send"}
                    </span>
                    {isSubmittingIzin ? "Mengirim..." : "Kirim Pengajuan"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal detail izin telat bayar (status + catatan supervisor) */}
          {izinDetail?.izin && izinMeta && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIzinDetail(null)}
              />
              <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${izinMeta.boxBg}`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${izinMeta.iconColor}`}
                    >
                      {izinMeta.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                      Detail Izin Telat Bayar
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {izinDetail.vehicle_name} • {izinDetail.license_plate}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIzinDetail(null)}
                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-xl">
                      close
                    </span>
                  </button>
                </div>

                <div className="p-5 space-y-4 overflow-y-auto">
                  {/* Status banner */}
                  <div
                    className={`rounded-xl border px-4 py-3 flex items-center justify-between gap-3 ${izinMeta.boxBg} ${izinMeta.boxBorder}`}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${izinMeta.badge}`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {izinMeta.icon}
                      </span>
                      {izinMeta.label}
                    </span>
                    <span
                      className={`text-xs font-medium text-right ${izinMeta.impactColor}`}
                    >
                      {izinMeta.impact}
                    </span>
                  </div>

                  {/* Info tagihan */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-4 py-3">
                      <p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight mb-1">
                        Tanggal Tagihan
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatDateOnly(izinDetail.payment_date)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-4 py-3">
                      <p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight mb-1">
                        Nominal
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatIDR(izinDetail.amount)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-4 py-3">
                      <p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight mb-1">
                        Keterlambatan
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {izinDetail.izin.late_days} hari
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-4 py-3">
                      <p className="text-[11px] text-slate-500 uppercase font-bold tracking-tight mb-1">
                        Diajukan
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatDateTime(izinDetail.izin.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Alasan driver */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Alasan Anda
                    </h5>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 space-y-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {izinDetail.izin.justification_reason ||
                          izinDetail.izin.justification ||
                          "-"}
                      </p>
                      {izinDetail.izin.proof_image && (
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            Evidence
                          </p>
                          <a
                            href={resolveImageUrl(izinDetail.izin.proof_image) || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:opacity-90 transition-opacity"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={resolveImageUrl(izinDetail.izin.proof_image) || ""}
                              alt="Bukti izin telat"
                              className="w-full max-h-56 object-contain bg-white dark:bg-slate-900"
                            />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Catatan supervisor — hanya jika ada */}
                  {izinDetail.izin.admin_note && (
                    <div>
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Catatan Supervisor
                      </h5>
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                          {izinDetail.izin.admin_note}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIzinDetail(null)}
                    className="px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
                  >
                    Tutup
                  </button>
                  {izinDetail.izin.status === "rejected" && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = izinDetail;
                        setIzinDetail(null);
                        openIzinDialog(target);
                      }}
                      className="px-4 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all active:scale-[0.98] flex items-center gap-2 text-sm"
                    >
                      <span className="material-symbols-outlined text-lg">
                        refresh
                      </span>
                      Ajukan Ulang
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

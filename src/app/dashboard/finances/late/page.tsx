"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CardDriver } from "@/components/finance/late-payment/card-driver";
import { StatsCard } from "@/components/finance/late-payment/card-stats";
import { financeApi } from "@/lib/api/finances";
import type { LatePaymentItem, LatePaymentStats } from "@/lib/types/finances";
import { resolveImageUrl } from "@/lib/utils/image";
import { formatDateOnly, formatDateTime } from "@/lib/utils/format";
import { getErrorMessage } from "@/lib/utils/error-message";
import {
  confirmToast,
  toastError,
  toastSuccess,
} from "@/components/ui/toast-provider";

function formatCurrency(amount: number): string {
  return `Rp ${Math.round(Number(amount) || 0).toLocaleString("id-ID")}`;
}

type Filter = "pending" | "approved" | "rejected" | "all";

const filterTabs: { value: Filter; label: string }[] = [
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
  { value: "all", label: "Semua" },
];

const statusBadge: Record<string, string> = {
  pending:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  approved:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  rejected:
    "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
};

const statusLabel: Record<string, string> = {
  pending: "Menunggu Persetujuan",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export default function LatePaymentPage() {
  const [requests, setRequests] = useState<LatePaymentItem[]>([]);
  const [stats, setStats] = useState<LatePaymentStats | null>(null);
  const [filter, setFilter] = useState<Filter>("pending");
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [reqRes, statsRes] = await Promise.all([
        financeApi.lateRequests(filter === "all" ? undefined : filter),
        financeApi.lateStats(),
      ]);
      const items = Array.isArray(reqRes?.data) ? reqRes.data : [];
      setRequests(items);
      setStats(statsRes?.data ?? null);
      setSelectedId((prev) =>
        items.some((r) => r.id === prev) ? prev : (items[0]?.id ?? ""),
      );
    } catch (err) {
      console.error("Gagal memuat pengajuan izin telat:", err);
      toastError(getErrorMessage(err, "Gagal memuat pengajuan izin telat."));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setAdminNote("");
  }, [selectedId]);

  const currentItem = useMemo(
    () => requests.find((r) => r.id === selectedId) || requests[0] || null,
    [requests, selectedId],
  );

  const handleApprove = async () => {
    if (!currentItem) return;
    const confirmed = await confirmToast({
      title: "Setujui Izin Telat",
      message: `Izin telat ${currentItem.driver_name} untuk tagihan ${formatDateOnly(
        currentItem.due_date,
      )} akan disetujui. Hari tersebut tidak dihitung sebagai keterlambatan.`,
      confirmText: "Ya, Setujui",
      cancelText: "Batal",
      variant: "info",
    });
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await financeApi.lateApprove(currentItem.id, adminNote || undefined);
      toastSuccess("Izin telat disetujui");
      setAdminNote("");
      fetchData();
    } catch (err) {
      console.error("Gagal menyetujui izin telat:", err);
      toastError(getErrorMessage(err, "Gagal menyetujui izin telat. Silakan coba lagi."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!currentItem) return;
    setIsSubmitting(true);
    try {
      await financeApi.lateReject(
        currentItem.id,
        rejectNote.trim() || adminNote || undefined,
      );
      toastSuccess("Izin telat ditolak");
      setRejectOpen(false);
      setRejectNote("");
      fetchData();
    } catch (err) {
      console.error("Gagal menolak izin telat:", err);
      toastError(getErrorMessage(err, "Gagal menolak izin telat. Silakan coba lagi."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Menunggu Persetujuan"
          value={String(stats?.pending ?? 0)}
          icon="hourglass_top"
          iconColor="text-amber-600"
          trend={{
            icon: "schedule",
            value: "Perlu ditinjau",
            trendColor: "text-amber-700",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
          }}
        />
        <StatsCard
          title="Disetujui"
          value={String(stats?.approved ?? 0)}
          icon="task_alt"
          iconColor="text-blue-600"
          trend={{
            icon: "check_circle",
            value: "Tidak dihitung telat",
            trendColor: "text-blue-700",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
          }}
        />
        <StatsCard
          title="Ditolak"
          value={String(stats?.rejected ?? 0)}
          icon="cancel"
          iconColor="text-red-600"
          trend={{
            icon: "info",
            value: "Tetap dihitung telat",
            trendColor: "text-red-700",
            bgColor: "bg-red-100 dark:bg-red-900/30",
          }}
        />
      </div>

      {/* Filter */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              filter === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-360px)] min-h-[560px]">
        {/* List */}
        <div className="w-full lg:w-4/12 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
          {loading ? (
            <div className="text-center text-slate-400 py-8">Memuat data...</div>
          ) : requests.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              Tidak ada pengajuan izin telat.
            </div>
          ) : (
            requests.map((item) => (
              <CardDriver
                key={item.id}
                id={
                  item.driver?.employee_id ||
                  item.driver_id?.slice(0, 8).toUpperCase() ||
                  "-"
                }
                name={item.driver_name || "-"}
                imageUrl={resolveImageUrl(item.driver?.profile_photo) || ""}
                amount={formatCurrency(item.amount)}
                time={formatDateTime(item.created_at)}
                status={item.status === "pending" ? "Perlu Review" : statusLabel[item.status]}
                isSelected={currentItem?.id === item.id}
                onClick={() => setSelectedId(item.id)}
              />
            ))
          )}
        </div>

        {/* Detail */}
        {currentItem ? (
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-500">
                  {currentItem.driver_name?.charAt(0)?.toUpperCase() || "D"}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {currentItem.driver_name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    NIK:{" "}
                    {currentItem.driver?.employee_id ||
                      currentItem.driver_id?.slice(0, 8)}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                  statusBadge[currentItem.status] ||
                  statusBadge.pending
                }`}
              >
                {statusLabel[currentItem.status] || currentItem.status}
              </span>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    receipt_long
                  </span>
                  Detail Pengajuan Izin
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tight mb-1">
                      Kendaraan
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {currentItem.vehicle || "-"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {currentItem.plate || "-"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tight mb-1">
                      Tanggal Tagihan
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatDateOnly(currentItem.due_date)}
                    </p>
                    <p className="text-xs text-slate-400">
                      Keterlambatan {currentItem.late_days ?? 0} hari
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tight mb-1">
                      Diajukan
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatDateOnly(currentItem.payment_date)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDateTime(currentItem.created_at)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-primary uppercase font-bold tracking-tight mb-1">
                      Nominal Tagihan
                    </p>
                    <p className="text-base font-black text-primary">
                      {formatCurrency(currentItem.amount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    chat_bubble_outline
                  </span>
                  Alasan Driver
                </h4>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800 space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-white">
                    {currentItem.justification_reason ||
                      currentItem.justification ||
                      "-"}
                  </h5>
                  {currentItem.message && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {currentItem.message}
                    </p>
                  )}
                </div>
              </div>

              {currentItem.proof_image && (
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">
                      image
                    </span>
                    Bukti / Evidence
                  </h4>
                  <a
                    href={resolveImageUrl(currentItem.proof_image) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:opacity-90 transition-opacity"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveImageUrl(currentItem.proof_image) || ""}
                      alt="Bukti izin telat"
                      className="w-full max-h-80 object-contain bg-white dark:bg-slate-900"
                    />
                  </a>
                </div>
              )}

              {currentItem.admin_note && currentItem.status !== "pending" && (
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">
                      sticky_note_2
                    </span>
                    Catatan Supervisor
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                    {currentItem.admin_note}
                  </div>
                </div>
              )}
            </div>

            {currentItem.status === "pending" && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                    Catatan untuk Driver (opsional)
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={2}
                    maxLength={500}
                    disabled={isSubmitting}
                    placeholder="Contoh: izin disetujui untuk 1 hari"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setRejectNote("");
                      setRejectOpen(true);
                    }}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-sm disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">
                      close
                    </span>
                    Tolak
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all active:scale-[0.98] text-sm disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">
                      check
                    </span>
                    Setujui Izin
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-400">
            Pilih pengajuan untuk melihat detail
          </div>
        )}
      </div>

      {/* Dialog tolak */}
      {rejectOpen && currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isSubmitting && setRejectOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-rose-500 text-xl">
                  cancel
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Tolak Izin Telat
                </h3>
                <p className="text-xs text-slate-400">
                  {currentItem.driver_name} —{" "}
                  {formatDateOnly(currentItem.due_date)}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium block mb-1.5">
                Alasan Penolakan (opsional)
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
                placeholder="Contoh: pengajuan tidak disertai bukti / di luar ketentuan"
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setRejectOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-lg">
                  {isSubmitting ? "hourglass_empty" : "cancel"}
                </span>
                {isSubmitting ? "Menyimpan..." : "Ya, Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

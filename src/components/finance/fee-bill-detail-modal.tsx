"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { financeApi } from "@/lib/api/finances";
import type { FinanceItem, FinancePaymentItem } from "@/lib/types/finances";
import { formatDateOnly, formatDateTime } from "@/lib/utils/format";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const methodLabel: Record<string, string> = {
  transfer: "Transfer Bank",
  cash: "Tunai",
  "e-wallet": "E-Wallet",
  saldo: "Koin Driver",
};

const paymentStatusStyle: Record<string, { label: string; cls: string }> = {
  paid: {
    label: "Diterima",
    cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  pending: {
    label: "Menunggu Verifikasi",
    cls: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
  cancelled: {
    label: "Dibatalkan",
    cls: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  },
};

const billStatusStyle: Record<string, { label: string; cls: string }> = {
  paid: {
    label: "Lunas",
    cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  partial: {
    label: "Dicicil",
    cls: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
  unpaid: {
    label: "Belum Dibayar",
    cls: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  },
  pending: {
    label: "Menunggu Verifikasi",
    cls: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
  cancelled: {
    label: "Dibatalkan",
    cls: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  },
};

interface FeeBillDetailModalProps {
  financeId: string | null;
  onClose: () => void;
  onPay?: (financeId: string) => void;
}

export const FeeBillDetailModal = ({
  financeId,
  onClose,
  onPay,
}: FeeBillDetailModalProps) => {
  const [detail, setDetail] = useState<FinanceItem | null>(null);
  const [error, setError] = useState("");
  const [loadedForId, setLoadedForId] = useState<string | null>(null);

  useEffect(() => {
    if (!financeId) return;
    let cancelled = false;
    financeApi
      .getDetail(financeId)
      .then((res) => {
        if (cancelled) return;
        setDetail(res?.data ?? null);
        setError("");
        setLoadedForId(financeId);
      })
      .catch(() => {
        if (cancelled) return;
        setDetail(null);
        setError("Gagal memuat detail pembayaran");
        setLoadedForId(financeId);
      });
    return () => {
      cancelled = true;
    };
  }, [financeId]);

  const isLoading = !!financeId && loadedForId !== financeId;
  const current = financeId && detail?.id === financeId ? detail : null;
  const loadError = financeId && loadedForId === financeId ? error : "";

  const total = Number(current?.fee_admin_join) || 0;
  const paid = current?.paid_amount ?? current?.amount_received ?? 0;
  const remaining = current?.remaining_amount ?? Math.max(0, total - paid);
  const isPartial = total > 0 && paid > 0 && remaining > 0;
  const statusKey =
    current?.status === "paid" || current?.status === "cancelled"
      ? current.status
      : isPartial
        ? "partial"
        : current?.status || "unpaid";
  const st = billStatusStyle[statusKey] || billStatusStyle.unpaid;
  const progress = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  const payments: FinancePaymentItem[] = current?.payments ?? [];
  const canPay =
    !!onPay && !!current && current.status !== "paid" && current.status !== "cancelled";

  return (
    <Modal isOpen={!!financeId} onClose={onClose} title="Detail Pembayaran" size="lg">
      {isLoading ? (
        <div className="p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block animate-spin">hourglass_empty</span>
          <p className="text-sm text-slate-400">Memuat detail pembayaran...</p>
        </div>
      ) : loadError || !current ? (
        <div className="p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">error</span>
          <p className="text-sm text-slate-400">{loadError || "Detail tidak ditemukan"}</p>
        </div>
      ) : (
        <div className="p-6 flex flex-col gap-6">
          {/* Ringkasan tagihan */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">admin_panel_settings</span>
                <p className="font-mono font-bold text-sm text-primary">{current.reference_number}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.cls}`}>
                  {st.label}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {current.notes || "Fee Membership"}
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>Dibuat {current.created_at ? formatDateTime(current.created_at) : "-"}</p>
              {current.driver && (
                <p className="mt-0.5">
                  Driver: <span className="font-semibold text-slate-600 dark:text-slate-300">{`${current.driver.first_name} ${current.driver.last_name}`.trim()}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Tagihan</p>
              <p className="font-bold text-lg text-slate-900 dark:text-white">{formatIDR(total)}</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Sudah Dibayar</p>
              <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{formatIDR(paid)}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4">
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Sisa Tagihan</p>
              <p className="font-bold text-lg text-amber-600 dark:text-amber-400">{formatIDR(remaining)}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Progres pembayaran</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${remaining === 0 ? "bg-emerald-500" : "bg-amber-500"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {remaining > 0 && (
              <p className="text-xs text-slate-400 mt-1.5">
                Tagihan ini dapat dibayar secara cicil — setiap pembayaran akan mengurangi sisa tagihan.
              </p>
            )}
          </div>

          {/* Riwayat uang masuk */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-slate-400 text-xl">history</span>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">Riwayat Pembayaran</h4>
              <span className="text-xs text-slate-400">({payments.length} pembayaran)</span>
            </div>
            {payments.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600 block mb-1">payments</span>
                <p className="text-sm text-slate-400">Belum ada pembayaran masuk.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3">Tanggal &amp; Jam</th>
                      <th className="px-4 py-3">Nominal</th>
                      <th className="px-4 py-3">Metode</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {payments.map((p) => {
                      const pst = paymentStatusStyle[p.status] || paymentStatusStyle.paid;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {formatDateTime(p.created_at)}
                            </p>
                            <p className="text-xs text-slate-400">Tanggal bayar: {formatDateOnly(p.payment_date)}</p>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{formatIDR(Number(p.amount) || 0)}</td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                            {methodLabel[p.payment_method] || p.payment_method}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${pst.cls}`}>
                              {pst.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400 max-w-[220px] truncate" title={p.reference_number || p.notes || ""}>
                            {p.reference_number || p.notes || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Tutup
            </button>
            {canPay && (
              <button
                onClick={() => onPay!(current.id)}
                className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">payments</span>
                {isPartial ? "Bayar Cicilan" : "Bayar Sekarang"}
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

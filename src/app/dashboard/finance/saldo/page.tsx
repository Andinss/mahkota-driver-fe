"use client";

import { useState, useEffect, useCallback } from "react";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { saldoApi } from "@/lib/api/saldo";
import { driverApi } from "@/lib/api/driver";
import type {
  DriverSaldo,
  SaldoTransaction,
  SaldoSummary,
} from "@/lib/types/saldo";
import type { DriverItem } from "@/lib/types/driver";
import { CurrencyInput } from "@/components/ui/currency-input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type TabType = "overview" | "transactions" | "topup";

const SaldoPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [summary, setSummary] = useState<SaldoSummary | null>(null);
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [driverBalance, setDriverBalance] = useState<DriverSaldo | null>(null);
  const [transactions, setTransactions] = useState<SaldoTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Top-up form
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [topUpNotes, setTopUpNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"topup" | "refund">(
    "topup",
  );
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundNotes, setRefundNotes] = useState<string>("");

  const fetchSummary = useCallback(async () => {
    try {
      const res = await saldoApi.getSummary();
      if ((res as any)?.success) {
        setSummary((res as any).data);
      }
    } catch (err) {
      console.error("Failed to fetch saldo summary:", err);
    }
  }, []);

  const fetchDrivers = useCallback(async () => {
    try {
      const res = await driverApi.getList({ limit: 9999 });
      const items = (res as any)?.data || [];
      setDrivers(items);
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchSummary(), fetchDrivers()]).finally(() =>
      setLoading(false),
    );
  }, [fetchSummary, fetchDrivers]);

  const fetchDriverBalance = useCallback(async (driverId: string) => {
    if (!driverId) {
      setDriverBalance(null);
      return;
    }
    setLoadingBalance(true);
    try {
      const res = await saldoApi.getBalance(driverId);
      if ((res as any)?.success) {
        setDriverBalance((res as any).data);
      }
    } catch (err) {
      console.error("Failed to fetch driver balance:", err);
      setDriverBalance(null);
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (driverId: string) => {
    if (!driverId) {
      setTransactions([]);
      return;
    }
    setLoadingTransactions(true);
    try {
      const res = await saldoApi.getTransactions(driverId, { limit: 50 });
      if ((res as any)?.success) {
        setTransactions((res as any).data || []);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDriverId) {
      fetchDriverBalance(selectedDriverId);
      if (activeTab === "transactions") {
        fetchTransactions(selectedDriverId);
      }
    }
  }, [selectedDriverId, activeTab, fetchDriverBalance, fetchTransactions]);

  const handleTopUp = async () => {
    if (!selectedDriverId || !topUpAmount) return;
    setIsSubmitting(true);
    try {
      const amount = parseInt(topUpAmount.replace(/\./g, ""), 10);
      await saldoApi.topUp({
        driver_id: selectedDriverId,
        amount,
        notes: topUpNotes || undefined,
      });
      setTopUpAmount("");
      setTopUpNotes("");
      fetchDriverBalance(selectedDriverId);
      fetchSummary();
      setShowConfirm(false);
    } catch (err) {
      console.error("Failed to top up:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedDriverId || !refundAmount) return;
    setIsSubmitting(true);
    try {
      const amount = parseInt(refundAmount.replace(/\./g, ""), 10);
      await saldoApi.refund({
        driver_id: selectedDriverId,
        amount,
        notes: refundNotes || undefined,
      });
      setRefundAmount("");
      setRefundNotes("");
      fetchDriverBalance(selectedDriverId);
      fetchSummary();
      setShowConfirm(false);
    } catch (err) {
      console.error("Failed to refund:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "transactions" && selectedDriverId) {
      fetchTransactions(selectedDriverId);
    }
  };

  const parseCurrency = (val: string) =>
    val ? parseInt(val.replace(/\./g, ""), 10) : 0;

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    
    <PermissionGuard permission="saldo.read">
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                Total Saldo
              </p>
              <p className="text-xl font-bold text-primary mt-1">
                Rp {Number(summary.total_balance).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                Driver Aktif
              </p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {summary.total_drivers_with_saldo}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                Total Top Up
              </p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                Rp {Number(summary.total_top_up).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                Total Pembayaran
              </p>
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                Rp {Number(summary.total_deductions).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        )}

        {/* Driver Selection */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Pilih Driver
          </label>
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="w-full md:w-96 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">-- Pilih Driver --</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.first_name} {d.last_name} ({d.employee_id})
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        {selectedDriverId && (
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <button
              onClick={() => handleTabChange("overview")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange("topup")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "topup"
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Top Up / Refund
            </button>
            <button
              onClick={() => handleTabChange("transactions")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "transactions"
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Riwayat Transaksi
            </button>
          </div>
        )}

        {/* Tab Content */}
        {selectedDriverId && activeTab === "overview" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            {loadingBalance ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                Memuat saldo...
              </div>
            ) : driverBalance ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {selectedDriver?.first_name?.charAt(0)}
                    {selectedDriver?.last_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">
                      {selectedDriver?.first_name} {selectedDriver?.last_name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {selectedDriver?.employee_id}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-xl">
                  <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Saldo Tersedia
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    Rp {Number(driverBalance.balance).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                Driver belum memiliki saldo
              </div>
            )}
          </div>
        )}

        {selectedDriverId && activeTab === "topup" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Up */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">
                  add_circle
                </span>
                Top Up Saldo
              </h3>
              <div className="space-y-4">
                <CurrencyInput
                  id="topUpAmount"
                  name="topUpAmount"
                  label="Jumlah Top Up"
                  placeholder="0"
                  value={topUpAmount}
                  onChange={setTopUpAmount}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Catatan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={topUpNotes}
                    onChange={(e) => setTopUpNotes(e.target.value)}
                    placeholder="Contoh: Top up dari mobile app"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <button
                  onClick={() => {
                    setConfirmAction("topup");
                    setShowConfirm(true);
                  }}
                  disabled={!topUpAmount || parseCurrency(topUpAmount) <= 0}
                  className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Top Up Sekarang
                </button>
              </div>
            </div>

            {/* Refund */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500">
                  replay
                </span>
                Refund ke Saldo
              </h3>
              <div className="space-y-4">
                <CurrencyInput
                  id="refundAmount"
                  name="refundAmount"
                  label="Jumlah Refund"
                  placeholder="0"
                  value={refundAmount}
                  onChange={setRefundAmount}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Catatan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={refundNotes}
                    onChange={(e) => setRefundNotes(e.target.value)}
                    placeholder="Contoh: Refund deposit rental"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <button
                  onClick={() => {
                    setConfirmAction("refund");
                    setShowConfirm(true);
                  }}
                  disabled={!refundAmount || parseCurrency(refundAmount) <= 0}
                  className="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Refund Sekarang
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedDriverId && activeTab === "transactions" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Riwayat Transaksi
              </h3>
            </div>
            {loadingTransactions ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Memuat transaksi...
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Belum ada transaksi
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                      <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                        Tipe
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">
                        Jumlah
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">
                        Saldo Sebelum
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">
                        Saldo Sesudah
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                        Catatan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-4 py-3 text-slate-900 dark:text-white">
                          {new Date(tx.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              tx.type === "top_up"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : tx.type === "rental_payment"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                  : tx.type === "refund"
                                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                            }`}
                          >
                            {tx.type === "top_up"
                              ? "Top Up"
                              : tx.type === "rental_payment"
                                ? "Pembayaran Rental"
                                : tx.type === "refund"
                                  ? "Refund"
                                  : tx.type}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-medium ${
                            tx.type === "top_up" || tx.type === "refund"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {tx.type === "top_up" || tx.type === "refund"
                            ? "+"
                            : "-"}{" "}
                          Rp {Number(tx.amount).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                          Rp {Number(tx.balance_before).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">
                          Rp {Number(tx.balance_after).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                          {tx.notes || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmAction === "topup" ? handleTopUp : handleRefund}
          title={
            confirmAction === "topup"
              ? "Konfirmasi Top Up"
              : "Konfirmasi Refund"
          }
          message={
            confirmAction === "topup"
              ? `Top up saldo Rp ${parseCurrency(topUpAmount).toLocaleString("id-ID")} untuk ${selectedDriver?.first_name} ${selectedDriver?.last_name}?`
              : `Refund saldo Rp ${parseCurrency(refundAmount).toLocaleString("id-ID")} untuk ${selectedDriver?.first_name} ${selectedDriver?.last_name}?`
          }
          confirmText={confirmAction === "topup" ? "Ya, Top Up" : "Ya, Refund"}
          cancelText="Batal"
          variant={confirmAction === "topup" ? "info" : "warning"}
        />
      </div>
    </PermissionGuard>
  );
};

export default SaldoPage;

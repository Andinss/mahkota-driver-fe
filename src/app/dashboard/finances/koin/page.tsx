"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { koinApi } from "@/lib/api/koin";
import { driverApi } from "@/lib/api/driver";
import type {
  DriverKoin,
  KoinTransaction,
  KoinSummary,
} from "@/lib/types/koin";
import type { DriverItem } from "@/lib/types/driver";
import { CurrencyInput } from "@/components/ui/currency-input";
import { confirmToast } from "@/components/ui/toast-provider";

type TabType = "overview" | "transactions" | "topup";

const TOPUP_PRESETS = [50000, 100000, 200000, 500000, 1000000];

const KoinPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [summary, setSummary] = useState<KoinSummary | null>(null);
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [driverBalance, setDriverBalance] = useState<DriverKoin | null>(null);
  const [transactions, setTransactions] = useState<KoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [topUpNotes, setTopUpNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundNotes, setRefundNotes] = useState<string>("");

  // Searchable driver select
  const [driverQuery, setDriverQuery] = useState<string>("");
  const [driverDropdownOpen, setDriverDropdownOpen] = useState(false);
  const driverSelectRef = useRef<HTMLDivElement>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await koinApi.getSummary();
      if ((res as any)?.success) {
        setSummary((res as any).data);
      }
    } catch (err) {
      console.error("Failed to fetch koin summary:", err);
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
      const res = await koinApi.getBalance(driverId);
      if ((res as any)?.success) {
        setDriverBalance((res as any).data);
      }
    } catch (err) {
      console.error("Failed to fetch driver koin balance:", err);
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
      const res = await koinApi.getTransactions(driverId, { limit: 50 });
      if ((res as any)?.success) {
        setTransactions((res as any).data || []);
      }
    } catch (err) {
      console.error("Failed to fetch koin transactions:", err);
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
      await koinApi.topUp({
        driver_id: selectedDriverId,
        amount,
        notes: topUpNotes || undefined,
      });
      setTopUpAmount("");
      setTopUpNotes("");
      fetchDriverBalance(selectedDriverId);
      fetchSummary();
    } catch (err) {
      console.error("Failed to top up koin:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedDriverId || !refundAmount) return;
    setIsSubmitting(true);
    try {
      const amount = parseInt(refundAmount.replace(/\./g, ""), 10);
      await koinApi.refund({
        driver_id: selectedDriverId,
        amount,
        notes: refundNotes || undefined,
      });
      setRefundAmount("");
      setRefundNotes("");
      fetchDriverBalance(selectedDriverId);
      fetchSummary();
    } catch (err) {
      console.error("Failed to refund koin:", err);
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

  const filteredDrivers = useMemo(() => {
    const q = driverQuery.trim().toLowerCase();
    if (!q) return drivers;
    return drivers.filter((d) =>
      `${d.first_name} ${d.last_name} ${d.employee_id || ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [drivers, driverQuery]);

  useEffect(() => {
    if (!driverDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        driverSelectRef.current &&
        !driverSelectRef.current.contains(e.target as Node)
      ) {
        setDriverDropdownOpen(false);
        setDriverQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [driverDropdownOpen]);

  const handleSelectDriver = (driverId: string) => {
    setSelectedDriverId(driverId);
    setDriverQuery("");
    setDriverDropdownOpen(false);
  };

  const handleClearDriver = () => {
    setSelectedDriverId("");
    setDriverQuery("");
    setDriverDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <PermissionGuard permission="koin.read">
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                Total Koin
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
                {summary.total_drivers_with_koin}
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

        {/* Driver Selection — searchable */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-xl">
                person_search
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                Pilih Driver
              </h2>
              <p className="text-xs text-slate-400">
                Cari nama atau ID karyawan, lalu pilih driver
              </p>
            </div>
            {drivers.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {drivers.length} driver
              </span>
            )}
          </div>

          <div ref={driverSelectRef} className="relative w-full md:max-w-xl">
            <div
              className={`flex items-center w-full rounded-lg border-[3px] bg-white dark:bg-slate-800 transition-all h-11 ring-1 ring-inset ring-transparent ${
                driverDropdownOpen
                  ? "border-primary ring-2 ring-inset ring-primary"
                  : selectedDriverId
                    ? "border-primary"
                    : "border-[#dbe0e6] dark:border-[#4b5563]"
              }`}
            >
              <div className="flex items-center justify-center pl-3.5 text-slate-400 dark:text-slate-500 shrink-0">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                placeholder={
                  selectedDriver
                    ? `${selectedDriver.first_name} ${selectedDriver.last_name}`
                    : "Cari nama driver atau ID karyawan..."
                }
                className="flex w-full flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 focus:ring-0 focus:outline-none h-full text-sm"
                value={
                  driverDropdownOpen
                    ? driverQuery
                    : selectedDriver
                      ? `${selectedDriver.first_name} ${selectedDriver.last_name} (${selectedDriver.employee_id})`
                      : driverQuery
                }
                onFocus={() => {
                  setDriverDropdownOpen(true);
                  setDriverQuery("");
                }}
                onChange={(e) => {
                  setDriverQuery(
                    e.target.value.replace(/[^a-zA-Z0-9\s'-]/g, ""),
                  );
                  setDriverDropdownOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filteredDrivers.length > 0) {
                    handleSelectDriver(filteredDrivers[0].id);
                  } else if (e.key === "Escape") {
                    setDriverDropdownOpen(false);
                    setDriverQuery("");
                  }
                }}
                autoComplete="off"
              />
              {(driverQuery || selectedDriverId) && (
                <button
                  type="button"
                  onClick={() => {
                    if (driverDropdownOpen && driverQuery) {
                      setDriverQuery("");
                    } else {
                      handleClearDriver();
                    }
                  }}
                  className="flex items-center justify-center mr-1 size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors shrink-0"
                  title="Hapus pilihan"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setDriverDropdownOpen((prev) => !prev);
                  setDriverQuery("");
                }}
                className="flex items-center justify-center mr-2 text-slate-400 shrink-0"
                title="Buka daftar driver"
              >
                <span
                  className={`material-symbols-outlined text-xl transition-transform ${driverDropdownOpen ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </button>
            </div>

            {driverDropdownOpen && (
              <div className="absolute z-20 w-full mt-1.5 bg-white dark:bg-slate-800 border-[3px] border-primary rounded-xl shadow-xl max-h-72 overflow-auto">
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((d) => {
                    const isSelected = d.id === selectedDriverId;
                    return (
                      <div
                        key={d.id}
                        onClick={() => handleSelectDriver(d.id)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors ${
                          isSelected
                            ? "bg-primary/10 dark:bg-primary/20"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        <div className="size-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {d.first_name?.charAt(0)}
                          {d.last_name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {d.first_name} {d.last_name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {d.employee_id || "-"}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-primary text-lg shrink-0">
                            check_circle
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center">
                    <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                      <span className="material-symbols-outlined text-2xl text-slate-400">
                        search_off
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Driver tidak ditemukan
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Coba dengan nama atau ID lain
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedDriver && driverBalance && (
            <div className="mt-3 flex items-center gap-3 w-full md:max-w-xl rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {selectedDriver.first_name?.charAt(0)}
                {selectedDriver.last_name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {selectedDriver.first_name} {selectedDriver.last_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Koin saat ini:{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    Rp {Number(driverBalance.balance).toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearDriver}
                className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors shrink-0"
              >
                Ganti
              </button>
            </div>
          )}
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
              Buat Top Up / Refund
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
                Memuat koin...
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
                    Koin Tersedia
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    Rp {Number(driverBalance.balance).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                Driver belum memiliki koin
              </div>
            )}
          </div>
        )}

        {selectedDriverId && activeTab === "topup" && (
          <div className="space-y-4">
            {/* Current balance banner */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 dark:border-primary/30 rounded-xl px-5 py-4">
              <div className="size-11 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold shrink-0">
                {selectedDriver?.first_name?.charAt(0)}
                {selectedDriver?.last_name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {selectedDriver?.first_name} {selectedDriver?.last_name} • Koin
                  saat ini
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {loadingBalance || !driverBalance ? (
                    <span className="text-sm font-medium text-slate-400">
                      Memuat...
                    </span>
                  ) : (
                    <>Rp {Number(driverBalance.balance).toLocaleString("id-ID")}</>
                  )}
                </p>
              </div>
              <span className="material-symbols-outlined text-primary/40 text-3xl hidden sm:block">
                account_balance_wallet
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Up */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-green-500 text-xl">
                      add_circle
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Buat Top Up Koin
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tambah koin ke dompet driver
                    </p>
                  </div>
                </div>
                <div className="space-y-4 mt-4 flex-1">
                  <CurrencyInput
                    id="topUpAmount"
                    name="topUpAmount"
                    label="Jumlah Top Up"
                    placeholder="0"
                    value={topUpAmount}
                    onChange={setTopUpAmount}
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                      Pilih nominal cepat
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TOPUP_PRESETS.map((nominal) => (
                        <button
                          key={nominal}
                          type="button"
                          onClick={() => setTopUpAmount(String(nominal))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            parseCurrency(topUpAmount) === nominal
                              ? "border-primary bg-primary text-white shadow-sm shadow-primary/30"
                              : "border-primary/40 dark:border-primary/50 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary"
                          }`}
                        >
                          Rp {nominal.toLocaleString("id-ID")}
                        </button>
                      ))}
                    </div>
                  </div>
                  {parseCurrency(topUpAmount) > 0 && driverBalance && (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3.5 py-3 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Koin saat ini</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          Rp {Number(driverBalance.balance).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Top up</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          + Rp {parseCurrency(topUpAmount).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-slate-200 dark:border-slate-700">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          Perkiraan setelah top up
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Rp{" "}
                          {(Number(driverBalance.balance) + parseCurrency(topUpAmount)).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1.5">
                      Catatan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={topUpNotes}
                      onChange={(e) => setTopUpNotes(e.target.value)}
                      placeholder="Contoh: Top up dari mobile app"
                      className="w-full rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-3 py-2 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const confirmed = await confirmToast({
                      title: "Konfirmasi Top Up",
                      message: `Top up koin Rp ${parseCurrency(topUpAmount).toLocaleString("id-ID")} untuk ${selectedDriver?.first_name} ${selectedDriver?.last_name}?`,
                      confirmText: "Ya, Top Up",
                      cancelText: "Batal",
                      variant: "info",
                    });
                    if (confirmed) await handleTopUp();
                  }}
                  disabled={
                    !topUpAmount ||
                    parseCurrency(topUpAmount) <= 0 ||
                    isSubmitting
                  }
                  className="mt-5 w-full h-11 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">
                    add_circle
                  </span>
                  {isSubmitting ? "Memproses..." : "Buat Top Up"}
                </button>
              </div>

              {/* Refund */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-orange-500 text-xl">
                      replay
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Refund ke Koin
                    </h3>
                    <p className="text-xs text-slate-400">
                      Kembalikan dana ke dompet driver
                    </p>
                  </div>
                  {driverBalance && Number(driverBalance.balance) > 0 && (
                    <button
                      type="button"
                      onClick={() => setRefundAmount(String(driverBalance.balance))}
                      className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline shrink-0"
                    >
                      Saldo penuh
                    </button>
                  )}
                </div>
                <div className="space-y-4 mt-4 flex-1">
                  <CurrencyInput
                    id="refundAmount"
                    name="refundAmount"
                    label="Jumlah Refund"
                    placeholder="0"
                    value={refundAmount}
                    onChange={setRefundAmount}
                  />
                  {parseCurrency(refundAmount) > 0 && driverBalance && (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3.5 py-3 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Koin saat ini</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          Rp {Number(driverBalance.balance).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Refund</span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          + Rp {parseCurrency(refundAmount).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-slate-200 dark:border-slate-700">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          Perkiraan setelah refund
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Rp{" "}
                          {(Number(driverBalance.balance) + parseCurrency(refundAmount)).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1.5">
                      Catatan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={refundNotes}
                      onChange={(e) => setRefundNotes(e.target.value)}
                      placeholder="Contoh: Refund deposit rental"
                      className="w-full rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-3 py-2 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const confirmed = await confirmToast({
                      title: "Konfirmasi Refund",
                      message: `Refund koin Rp ${parseCurrency(refundAmount).toLocaleString("id-ID")} untuk ${selectedDriver?.first_name} ${selectedDriver?.last_name}?`,
                      confirmText: "Ya, Refund",
                      cancelText: "Batal",
                      variant: "warning",
                    });
                    if (confirmed) await handleRefund();
                  }}
                  disabled={
                    !refundAmount ||
                    parseCurrency(refundAmount) <= 0 ||
                    isSubmitting
                  }
                  className="mt-5 w-full h-11 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">replay</span>
                  {isSubmitting ? "Memproses..." : "Refund Sekarang"}
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedDriverId && activeTab === "transactions" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Riwayat Transaksi Koin
              </h3>
            </div>
            {loadingTransactions ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Memuat transaksi koin...
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Belum ada transaksi koin
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white dark:bg-slate-800">
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
                        Nomor Referensi
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
                        className="hover:bg-white dark:hover:bg-slate-800/50"
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
                            : "-"} Rp {Number(tx.amount).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">
                          {tx.reference_number || "-"}
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
      </div>
    </PermissionGuard>
  );
};

export default KoinPage;
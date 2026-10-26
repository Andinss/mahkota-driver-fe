"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/lib/auth-context";
import { koinApi } from "@/lib/api/koin";
import { koinKeys } from "@/lib/query-keys";
import { KoinHistoryCard } from "@/components/drivers/detail/koin-history-card";
import type { KoinTransaction } from "@/lib/types/koin";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

/** Filter riwayat koin milik driver (disaring di klien). */
const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "top_up", label: "Koin Masuk (Reward)" },
  { key: "rental_payment", label: "Pembayaran Rental" },
  { key: "refund", label: "Refund" },
];

const ITEMS_PER_PAGE = 8;

/**
 * Halaman "Koin Saya" (portal driver).
 *
 * Menampilkan saldo + riwayat transaksi koin milik driver yang login
 * beserta **alasan** penambahan koin (reward / lainnya) yang diisi admin
 * saat top up. Data diambil lewat `GET /koin/my-transactions` sehingga
 * driver hanya bisa melihat transaksinya sendiri.
 */
export function DriverKoinPage() {
  const { user } = useAuth();
  const driverId = user?.driver_id ?? null;
  const [filter, setFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const balanceQuery = useQuery({
    queryKey: koinKeys.balance(driverId ?? ""),
    queryFn: async () => {
      const res = await koinApi.getBalance(driverId!);
      const data = (res as { data?: unknown })?.data ?? res;
      const balance = Number(
        (data as { balance?: string | number })?.balance,
      );
      return Number.isFinite(balance) ? balance : 0;
    },
    enabled: !!driverId,
  });

  const txQuery = useQuery({
    queryKey: koinKeys.myTransactions(),
    queryFn: async () => {
      const res = await koinApi.getMyTransactions({ limit: 100 });
      const data = (res as { data?: unknown })?.data ?? res;
      const items = Array.isArray(data)
        ? data
        : ((data as { data?: unknown })?.data ?? []);
      return Array.isArray(items) ? (items as KoinTransaction[]) : [];
    },
    enabled: !!driverId,
  });

  const balance = balanceQuery.data ?? 0;
  const transactions: KoinTransaction[] = useMemo(
    () => txQuery.data ?? [],
    [txQuery.data],
  );

  const { totalIn, totalOut } = useMemo(() => {
    let inSum = 0;
    let outSum = 0;
    for (const tx of transactions) {
      const amount = Number(tx.amount) || 0;
      if (tx.type === "top_up" || tx.type === "refund") inSum += amount;
      else outSum += amount;
    }
    return { totalIn: inSum, totalOut: outSum };
  }, [transactions]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? transactions
        : transactions.filter((tx) => tx.type === filter),
    [transactions, filter],
  );

  const visible = filtered.slice(0, visibleCount);

  const handleFilter = (key: string) => {
    setFilter(key);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  if (!driverId) {
    return (
      <div className="m-8">
        <PageHeader
          title="Koin Saya"
          description="Riwayat koin Anda beserta alasannya"
        />
        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Akun Anda belum terhubung dengan profil driver.
        </div>
      </div>
    );
  }

  const isLoadingTx = txQuery.isLoading || txQuery.isFetching;

  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full flex flex-col gap-8 pb-10">
          <PageHeader
            title="Koin Saya"
            description="Saldo dan riwayat koin yang Anda terima, beserta alasannya"
          />

          {/* Saldo + ringkasan */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-2xl">
                  toll
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Saldo Koin
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight break-words">
                  {balanceQuery.isLoading
                    ? "…"
                    : `${balance.toLocaleString("id-ID")} Koin`}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {balanceQuery.isLoading
                    ? "Memuat saldo…"
                    : `Setara ${formatIDR(balance)}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:ml-auto sm:shrink-0">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Koin Masuk
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  + {totalIn.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Koin Keluar
                </p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  - {totalOut.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => handleFilter(f.key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  filter === f.key
                    ? "border-primary bg-primary text-white shadow-sm shadow-primary/30"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400">
              {filtered.length} transaksi
            </span>
          </div>

          {/* Riwayat */}
          {isLoadingTx && transactions.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-400">
              Memuat riwayat koin…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2 block">
                account_balance_wallet
              </span>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Belum ada riwayat koin
                {filter === "all" ? "" : " untuk filter ini"}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {visible.map((tx) => (
                <KoinHistoryCard key={tx.id} item={tx} />
              ))}
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                className="px-5 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
              >
                Muat lebih banyak ({filtered.length - visibleCount} lagi)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

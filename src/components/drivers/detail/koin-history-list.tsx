"use client";

import { useState, useEffect, useMemo } from "react";
import { koinApi } from "@/lib/api/koin";
import type { KoinTransaction } from "@/lib/types/koin";
import { KoinHistoryCard } from "./koin-history-card";

interface KoinHistoryListProps {
  driverId: string;
}

const ITEMS_PER_PAGE = 8;

export function KoinHistoryList({ driverId }: KoinHistoryListProps) {
  const [transactions, setTransactions] = useState<KoinTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    if (!driverId) return;

    setLoading(true);
    setVisibleCount(ITEMS_PER_PAGE);
    koinApi
      .getTransactions(driverId, { limit: 100 })
      .then((res: any) => {
        setTransactions(res?.data || []);
      })
      .catch((err) => {
        console.error("Failed to load koin transactions:", err);
        setTransactions([]);
      })
      .finally(() => setLoading(false));
  }, [driverId]);

  const visibleItems = useMemo(
    () => transactions.slice(0, visibleCount),
    [transactions, visibleCount],
  );
  const hasMore = visibleCount < transactions.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-500 text-xl">
              account_balance_wallet
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Koin History
            </h2>
            <p className="text-xs text-slate-400">
              {transactions.length} transaksi
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Memuat transaksi koin...
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-slate-400 text-4xl">
              account_balance_wallet
            </span>
          </div>
          <p className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Belum ada transaksi Koin
          </p>
          <p className="text-sm text-slate-400">
            Transaksi Koin akan muncul di sini
          </p>
        </div>
      ) : (
        <>
          {/* Grid — 4 kolom */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleItems.map((item) => (
              <KoinHistoryCard key={item.id} item={item} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
                Load More ({transactions.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
"use client";

import Link from "next/link";
import { RekeningStatusBadge, RekeningTypeBadge } from "@/components/rekenings/rekening-badges";
import { formatRupiah } from "@/lib/utils/format";
import type { Rekening } from "@/lib/types/rekening";

interface RekeningHeaderProps {
  rekening: Rekening;
  onBack: () => void;
}

export const RekeningHeader = ({ rekening, onBack }: RekeningHeaderProps) => {
  const isUtama = rekening.type === "utama";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">
              arrow_back
            </span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Detail Rekening
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {rekening.name} - {rekening.code}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RekeningStatusBadge isActive={rekening.is_active} />
          <Link
            href={`/dashboard/rekenings/new?id=${rekening.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Edit
          </Link>
        </div>
      </div>

      <div
        className={`rounded-2xl border p-6 relative overflow-hidden ${
          isUtama
            ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/50"
            : "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
              isUtama
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            }`}
          >
            <span className="material-symbols-outlined text-3xl">
              account_balance
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {rekening.name}
              </h2>
              <RekeningTypeBadge type={rekening.type} />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {rekening.description || "Tidak ada deskripsi"}
            </p>
            <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-2">
              {rekening.bank_name} &middot; {rekening.account_number}
            </p>
          </div>
          <div className="sm:ml-auto text-right shrink-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Saldo Saat Ini
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatRupiah(rekening.balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
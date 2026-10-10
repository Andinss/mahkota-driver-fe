"use client";

import Link from "next/link";
import {
  RekeningMethodBadge,
  RekeningStatusBadge,
  methodMeta,
} from "@/components/rekenings/rekening-badges";
import type { Rekening } from "@/lib/types/rekening";
import { resolveImageUrl } from "@/lib/utils/image";

interface RekeningHeaderProps {
  rekening: Rekening;
  onBack: () => void;
}

export const RekeningHeader = ({ rekening, onBack }: RekeningHeaderProps) => {
  const isQris = rekening.method === "qris";
  const { icon } = methodMeta(rekening.method);

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
              Detail Metode Pembayaran
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

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-amber-400 to-slate-900"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
            {isQris && rekening.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(rekening.image_url) ?? undefined}
                alt={rekening.name}
                className="w-full h-full object-contain bg-white p-1"
              />
            ) : (
              <span className="material-symbols-outlined text-3xl text-primary">
                {icon}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {rekening.name}
              </h2>
              <RekeningMethodBadge method={rekening.method} />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {rekening.description || "Tidak ada deskripsi"}
            </p>
            {!isQris && (
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-2">
                {rekening.provider} &middot; {rekening.account_number}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
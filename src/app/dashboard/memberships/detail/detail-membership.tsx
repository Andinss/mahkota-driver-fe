"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MembershipStatusBadge } from "@/components/memberships/badges";
import { membershipApi } from "@/lib/api/membership";
import { formatDateOnly, formatRupiah } from "@/lib/utils/format";
import type { Membership } from "@/lib/types/membership";

interface MembershipDetailProps {
  id: string | null;
}

const MembershipDetail = ({ id }: MembershipDetailProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const res = await membershipApi.getById(id);
        if (!cancelled) setMembership(res.data);
      } catch {
        if (!cancelled) setMembership(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 animate-spin">
              progress_activity
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Memuat data membership...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard/memberships")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Detail Membership
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Membership tidak ditemukan
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">
              search_off
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Data membership tidak ditemukan
            </p>
            <button
              onClick={() => router.push("/dashboard/memberships")}
              className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Kembali ke Daftar Membership
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPremium = membership.level > 1;
  const activityLogs = [
    {
      icon: "card_membership",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      title: "Membership dibuat",
      date: formatDateOnly(membership.created_at),
      description: `Tipe membership ${membership.name} ditambahkan ke sistem.`,
    },
    {
      icon: "payments",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      title: `Fee ditetapkan ${formatRupiah(membership.fee)}`,
      date: formatDateOnly(membership.created_at),
      description: `Berlaku untuk seluruh member tipe ${membership.name}.`,
    },
    {
      icon: "edit",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      title: "Terakhir diperbarui",
      date: formatDateOnly(membership.updated_at),
      description: "Perubahan data membership terakhir disimpan.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard/memberships")}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Detail Membership
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {membership.name} - {membership.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MembershipStatusBadge isActive={membership.is_active} />
            <Link
              href={`/dashboard/memberships/new?id=${membership.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Edit
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className={`rounded-2xl border p-6 relative overflow-hidden ${
              isPremium
                ? "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/50"
                : "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                  isPremium
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                }`}
              >
                <span className="material-symbols-outlined text-3xl">
                  {isPremium ? "workspace_premium" : "military_tech"}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {membership.name}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {membership.description || "Tidak ada deskripsi"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 p-5">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Fee</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {formatRupiah(membership.fee)}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/50 p-5">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Jumlah Benefit</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                {membership.benefits.length} benefit
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 text-xl">info</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Informasi Membership
                </h3>
                <p className="text-xs text-slate-400">Ringkasan data tipe membership</p>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              <div className="flex items-center justify-between px-6 py-4 gap-4">
                <span className="text-slate-500 dark:text-slate-400">ID Membership</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {membership.id}
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4 gap-4">
                <span className="text-slate-500 dark:text-slate-400">Nama Membership</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {membership.name}
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4 gap-4">
                <span className="text-slate-500 dark:text-slate-400">Fee</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(membership.fee)}
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4 gap-4">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <MembershipStatusBadge isActive={membership.is_active} />
              </div>
              <div className="flex items-center justify-between px-6 py-4 gap-4">
                <span className="text-slate-500 dark:text-slate-400">Tanggal Dibuat</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatDateOnly(membership.created_at)}
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4 gap-4">
                <span className="text-slate-500 dark:text-slate-400">Terakhir Diperbarui</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatDateOnly(membership.updated_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-500 text-xl">
                  workspace_premium
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Benefit Membership
                </h3>
                <p className="text-xs text-slate-400">
                  Hak akses sesuai tipe {membership.name}
                </p>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {membership.benefits.length > 0 ? (
                membership.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="material-symbols-outlined text-emerald-500 text-lg">
                      check_circle
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Benefit tidak tersedia.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 text-xl">history</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Riwayat Membership
                </h3>
                <p className="text-xs text-slate-400">Aktivitas terakhir tipe membership</p>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activityLogs.map((log) => (
                <div key={log.title} className="flex items-start gap-4 px-6 py-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${log.bg}`}
                  >
                    <span className={`material-symbols-outlined text-lg ${log.color}`}>
                      {log.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {log.title}
                      </p>
                      <span className="text-xs text-slate-400">{log.date}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {log.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipDetail;

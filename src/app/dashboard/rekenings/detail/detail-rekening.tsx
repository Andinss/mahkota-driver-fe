"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RekeningHeader } from "@/components/rekenings/detail/rekening-header";
import { RekeningInfo } from "@/components/rekenings/detail/rekening-info";
import { RekeningActivity } from "@/components/rekenings/detail/rekening-activity";
import { rekeningApi } from "@/lib/api/rekening";
import type { Rekening } from "@/lib/types/rekening";

interface RekeningDetailProps {
  id: string | null;
}

const RekeningDetail = ({ id }: RekeningDetailProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [rekening, setRekening] = useState<Rekening | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const res = await rekeningApi.getById(id);
        if (!cancelled) setRekening(res.data);
      } catch {
        if (!cancelled) setRekening(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleBack = () => {
    router.push("/dashboard/rekenings");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 animate-spin">
              progress_activity
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Memuat data rekening...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!rekening) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
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
                  Rekening tidak ditemukan
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">
              search_off
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Data rekening tidak ditemukan
            </p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Kembali ke Daftar Rekening
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <RekeningHeader rekening={rekening} onBack={handleBack} />

        <div className="space-y-6 mt-6">
          <RekeningInfo rekening={rekening} />
          <RekeningActivity rekening={rekening} />
        </div>
      </div>
    </div>
  );
};

export default RekeningDetail;
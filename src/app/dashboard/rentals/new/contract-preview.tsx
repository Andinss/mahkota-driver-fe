"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { rentalContractApi } from "@/lib/api/rental-contract";
import { HttpClientError } from "@/lib/api-http";

interface ContractPreviewProps {
  rentalId?: string;
  driverId?: string;
  vehicleId?: string;
  driverLabel?: string;
  vehicleLabel?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  dailyRate?: number;
  rentalDuration?: string;
  rentalService?: string;
}

const ContractPreview = ({
  rentalId,
  driverId,
  vehicleId,
  driverLabel,
  vehicleLabel,
  startDate,
  endDate,
  duration,
  dailyRate,
  rentalDuration,
  rentalService,
}: ContractPreviewProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const urlRef = useRef<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasPreview, setHasPreview] = useState(false);
  // Nomor penanda untuk memicu ulang preview saat pengguna menekan "Coba lagi".
  const [retryToken, setRetryToken] = useState(0);
  // Nama file unduhan dari backend (ikut kode rental / rental_number).
  const [downloadName, setDownloadName] = useState("kontrak-sewa.docx");
  // Zoom dokumen preview (1 = 100%).
  const [zoom, setZoom] = useState(1);

  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 2;
  const ZOOM_STEP = 0.1;

  const clampZoom = (value: number) =>
    Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 100) / 100));

  const handleZoomOut = () => setZoom((value) => clampZoom(value - ZOOM_STEP));
  const handleZoomIn = () => setZoom((value) => clampZoom(value + ZOOM_STEP));
  const handleZoomReset = () => setZoom(1);

  const isReady = Boolean(driverId && vehicleId && startDate && endDate);

  const releaseUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  useEffect(() => {
    if (!isReady) {
      releaseUrl();
      setHasPreview(false);
      setError("");
      if (bodyRef.current) bodyRef.current.innerHTML = "";
      return;
    }

    let cancelled = false;
    let createdUrl: string | null = null;
    let adopted = false;

    setLoading(true);
    setError("");

    const timer = window.setTimeout(async () => {
      try {
        const { blob, filename } = await rentalContractApi.getPreview({
          driver_id: driverId,
          vehicle_id: vehicleId,
          rental_id: rentalId,
          start_date: startDate,
          end_date: endDate,
          total_duration: duration,
          daily_rate: dailyRate,
          rental_duration: rentalDuration || undefined,
          rental_service: rentalService || undefined,
        });

        if (cancelled) return;

        const buffer = await blob.arrayBuffer();
        const { renderAsync } = await import("docx-preview");
        if (cancelled || !bodyRef.current) return;

        bodyRef.current.innerHTML = "";
        await renderAsync(buffer, bodyRef.current);

        if (cancelled || !bodyRef.current) return;

        createdUrl = URL.createObjectURL(blob);
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = createdUrl;
        adopted = true;
        setPreviewUrl(createdUrl);
        setDownloadName(filename);
        setHasPreview(true);
      } catch (err) {
        if (cancelled) return;
        setHasPreview(false);
        setError(
          err instanceof HttpClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Gagal memuat preview kontrak",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 600);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (createdUrl && !adopted) URL.revokeObjectURL(createdUrl);
    };
  }, [
    isReady,
    retryToken,
    driverId,
    vehicleId,
    rentalId,
    startDate,
    endDate,
    duration,
    dailyRate,
    rentalDuration,
    rentalService,
    releaseUrl,
  ]);

  useEffect(() => () => releaseUrl(), [releaseUrl]);

  const handleRetry = () => {
    setError("");
    setHasPreview(false);
    setRetryToken((token) => token + 1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-violet-500 text-xl">description</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Preview Kontrak Sewa
            </h3>
            <p className="text-xs text-slate-400">
              {driverLabel && vehicleLabel
                ? `${driverLabel} • ${vehicleLabel}`
                : "Diperbarui otomatis mengikuti form"}
            </p>
          </div>
        </div>

        {hasPreview && previewUrl && (
          <a
            href={previewUrl}
            download={downloadName}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Unduh
          </a>
        )}
      </div>

      {/* Toolbar zoom */}
      <div className="flex items-center justify-end gap-3 px-6 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={!hasPreview || zoom <= ZOOM_MIN}
            aria-label="Zoom out"
            title="Perkecil"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-lg">zoom_out</span>
          </button>

          <button
            type="button"
            onClick={handleZoomReset}
            disabled={!hasPreview || zoom === 1}
            title="Kembalikan ke 100%"
            className="min-w-[54px] px-2 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:hover:bg-transparent tabular-nums"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={!hasPreview || zoom >= ZOOM_MAX}
            aria-label="Zoom in"
            title="Perbesar"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-lg">zoom_in</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="h-[65vh] min-h-[420px] overflow-auto bg-slate-100 dark:bg-slate-950 p-4">
          {!isReady ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-400 text-3xl">draft</span>
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Belum ada preview
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                Pilih driver, kendaraan, dan periode sewa untuk melihat isi kontrak
              </p>
            </div>
          ) : (
            <>
              <div
                ref={bodyRef}
                style={{ zoom }}
                className="min-h-full"
              />

              {loading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
                  <span className="material-symbols-outlined animate-spin text-violet-500 text-3xl">
                    progress_activity
                  </span>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Menyiapkan preview kontrak...
                  </p>
                </div>
              )}

              {!loading && error && (
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <span className="material-symbols-outlined text-red-400 text-3xl">
                    error
                  </span>
                  <p className="text-sm text-red-500 dark:text-red-400 font-medium">{error}</p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Coba lagi
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base">info</span>
          Preview mengikuti data driver & kendaraan terpilih
        </p>
        <span
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            hasPreview ? "text-emerald-500" : "text-slate-400"
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {hasPreview ? "check_circle" : "radio_button_unchecked"}
          </span>
          {hasPreview ? "Siap diunduh" : "Menunggu data"}
        </span>
      </div>
    </div>
  );
};

export default ContractPreview;

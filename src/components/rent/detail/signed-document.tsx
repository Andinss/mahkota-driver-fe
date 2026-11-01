"use client";

import { useState } from "react";
import { toastError, toastSuccess } from "@/components/ui/toast-provider";
import { getErrorMessage } from "@/lib/utils/error-message";

interface DocumentSignProps {
  documentUrl?: string;
  checklistPreUrl?: string;
  checklistPostUrl?: string;
  onUploadPost?: (file: File) => Promise<void>;
}

const DocumentSign = ({
  documentUrl,
  checklistPreUrl,
  checklistPostUrl,
  onUploadPost,
}: DocumentSignProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const hasContract = !!documentUrl;
  const hasPre = !!checklistPreUrl;
  const hasPost = !!checklistPostUrl;

  const imageBase = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  ).replace(/\/api\/?$/, "");
  const resolveUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    return `${imageBase}/${path.replace(/^\//, "")}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toastError("Ukuran file maksimal 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      await onUploadPost?.(file);
      toastSuccess("Checklist Post-Rental berhasil diunggah.");
    } catch (err) {
      console.error(err);
      toastError(
        getErrorMessage(err, "Gagal mengunggah checklist post-rental."),
      );
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="material-symbols-outlined text-slate-400 text-lg">
          folder_open
        </span>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Dokumen & Checklist
        </p>
      </div>

      <div className="space-y-3">
        {/* 1. Kontrak Sewa */}
        <div className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                hasContract
                  ? "bg-red-100 dark:bg-red-900/20"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  hasContract
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-400"
                }`}
              >
                picture_as_pdf
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Kontrak Sewa
              </p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                {hasContract ? "Tersedia" : "Belum diunggah"}
              </p>
            </div>
          </div>
          {hasContract ? (
            <a
              href={resolveUrl(documentUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
              title="Buka di tab baru"
            >
              <span className="material-symbols-outlined text-lg">
                open_in_new
              </span>
            </a>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-lg">
                open_in_new
              </span>
            </div>
          )}
        </div>

        {/* 2. Checklist Pre-Rental */}
        <div
          className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
            hasPre
              ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-primary/30"
              : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                hasPre
                  ? "bg-amber-100 dark:bg-amber-900/20"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  hasPre
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-400"
                }`}
              >
                checklist
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Checklist Pre-Rental
              </p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                {hasPre ? "Tersedia (Saat Pengambilan)" : "Belum diunggah"}
              </p>
            </div>
          </div>
          {hasPre ? (
            <a
              href={resolveUrl(checklistPreUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
              title="Buka di tab baru"
            >
              <span className="material-symbols-outlined text-lg">
                open_in_new
              </span>
            </a>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-lg">
                open_in_new
              </span>
            </div>
          )}
        </div>

        {/* 3. Checklist Post-Rental */}
        <div
          className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
            hasPost
              ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-primary/30"
              : "bg-white dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                hasPost
                  ? "bg-blue-100 dark:bg-blue-900/20"
                  : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  hasPost
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400"
                }`}
              >
                fact_check
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Checklist Post-Rental
              </p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                {hasPost ? "Tersedia (Saat Pengembalian)" : "Belum diunggah"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasPost ? (
              <a
                href={resolveUrl(checklistPostUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                title="Buka di tab baru"
              >
                <span className="material-symbols-outlined text-lg">
                  open_in_new
                </span>
              </a>
            ) : (
              <label
                className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isUploading
                    ? "bg-slate-100 text-slate-400 cursor-wait"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {isUploading ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">
                      progress_activity
                    </span>
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">
                      upload
                    </span>
                    Upload
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg, image/png, application/pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSign;

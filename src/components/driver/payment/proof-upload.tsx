"use client";

import { useRef, useState } from "react";
import { resolveImageUrl } from "@/lib/utils/image";

interface ProofUploadValue {
  /** Preview: `blob:` untuk file baru. */
  value: string | null;
  /** File bukti bayar yang akan dikirim ke backend. */
  file: File | null;
}

interface ProofUploadProps {
  value: string | null;
  file: File | null;
  onChange: (next: ProofUploadValue) => void;
  error?: string;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB — sesuai limit backend

/**
 * Upload bukti pembayaran (screenshot transfer / struk).
 * File disimpan sebagai `File` dan dikirim sebagai FormData ke backend
 * (pola vendor-vehicle) — bukan data-URL base64.
 */
export const ProofUpload = ({
  value,
  file,
  onChange,
  error,
}: ProofUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const revokePreview = (preview?: string | null) => {
    if (preview?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(preview);
      } catch {
        // abaikan
      }
    }
  };

  const readFile = (nextFile?: File | null) => {
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) {
      setLocalError("File harus berupa gambar (PNG, JPG, WEBP).");
      return;
    }
    if (nextFile.size > MAX_SIZE) {
      setLocalError("Ukuran gambar maksimal 5 MB.");
      return;
    }
    setLocalError(null);
    revokePreview(value);
    onChange({
      value: URL.createObjectURL(nextFile),
      file: nextFile,
    });
  };

  const handleRemove = () => {
    setLocalError(null);
    revokePreview(value);
    onChange({ value: null, file: null });
  };

  const message = localError ?? error ?? null;

  if (value) {
    const displaySrc = resolveImageUrl(value);

    return (
      <div className="space-y-2">
        <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="w-28 h-28 rounded-xl bg-white border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displaySrc ?? undefined}
              alt="Pratinjau bukti pembayaran"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {file ? "Bukti pembayaran siap dikirim" : "Bukti pembayaran"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pastikan nominal, tanggal, dan tujuan transfer terlihat jelas.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">upload</span>
                Ganti Foto
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Hapus
              </button>
            </div>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            readFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {message && (
          <p className="text-xs font-semibold text-red-600 dark:text-red-400">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          readFile(e.dataTransfer.files?.[0]);
        }}
        className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : message
              ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
              : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-primary hover:bg-primary/5"
        }`}
      >
        <span className="material-symbols-outlined text-4xl text-slate-400">
          receipt_long
        </span>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-2">
          Tarik &amp; letakkan foto bukti pembayaran di sini
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          atau klik untuk memilih file &middot; PNG, JPG, WEBP &middot; maks 5 MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          readFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {message && (
        <p className="text-xs font-semibold text-red-600 dark:text-red-400">
          {message}
        </p>
      )}
    </div>
  );
};

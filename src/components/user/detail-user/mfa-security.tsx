"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  confirmToast,
  toastError,
  toastSuccess,
} from "@/components/ui/toast-provider";
import { usersApi } from "@/lib/api/users";
import { getErrorMessage } from "@/lib/utils/error-message";
import type { UserItem } from "@/lib/types/user";

interface MfaSecurityProps {
  user: UserItem;
  onReset?: () => void;
}

const MfaSecurity = ({ user, onReset }: MfaSecurityProps) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    const confirmed = await confirmToast({
      title: "Reset MFA?",
      message:
        "MFA pengguna akan dinonaktifkan. Pengguna harus mengaktifkan dan memindai QR code baru untuk login dengan MFA.",
      confirmText: "Reset MFA",
      cancelText: "Batal",
      variant: "warning",
    });

    if (!confirmed) return;

    setIsResetting(true);
    try {
      const result = await usersApi.resetMfa(user.id);
      toastSuccess(result.message || "MFA berhasil direset.");
      onReset?.();
    } catch (error) {
      toastError(getErrorMessage(error, "Gagal mereset MFA pengguna."));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a2632] p-6 lg:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h4 className="text-[0.7rem] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
        <span className="w-4 h-px bg-gray-300 dark:bg-slate-600"></span>
        Keamanan Akun
      </h4>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={`material-symbols-outlined mt-0.5 ${
              user.mfa_enabled ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {user.mfa_enabled ? "verified_user" : "shield"}
          </span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              Autentikasi Dua Faktor (MFA)
            </p>
            <p className="text-xs text-gray-600 dark:text-slate-400">
              {user.mfa_enabled
                ? "MFA aktif. Pengguna wajib memasukkan kode authenticator saat login."
                : "MFA belum aktif untuk pengguna ini."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
              user.mfa_enabled
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {user.mfa_enabled ? "Aktif" : "Nonaktif"}
          </span>

          {user.mfa_enabled && (
            <Button
              variant="danger"
              size="sm"
              icon="restart_alt"
              onClick={handleReset}
              disabled={isResetting}
            >
              {isResetting ? "Memproses…" : "Reset MFA"}
            </Button>
          )}
        </div>
      </div>

      {user.mfa_enabled && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          Gunakan reset hanya jika pengguna kehilangan perangkat authenticator
          dan kode pemulihan. Setelah reset, pengguna perlu memindai ulang QR
          code.
        </p>
      )}
    </div>
  );
};

export default MfaSecurity;

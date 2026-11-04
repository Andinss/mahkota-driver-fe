"use client";

import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PasswordInput } from "@/components/ui/password-input";
import { authApi } from "@/lib/api/auth";
import { HttpClientError } from "@/lib/api-http";
import { getErrorMessage } from "@/lib/utils/error-message";
import {
  confirmToast,
  toastError,
  toastSuccess,
  toastWarning,
} from "@/components/ui/toast-provider";
import type { MfaSetupResponse } from "@/lib/types/auth";

const MfaSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const [setupData, setSetupData] = useState<MfaSetupResponse | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [recoveryModalMode, setRecoveryModalMode] = useState<
    "enable" | "regenerate"
  >("enable");
  const [recoveryAcknowledged, setRecoveryAcknowledged] = useState(false);

  const [password, setPassword] = useState("");
  const [disableCode, setDisableCode] = useState("");

  const reportError = useCallback((error: unknown, fallback: string) => {
    if (error instanceof HttpClientError) {
      toastError(getErrorMessage(error, fallback));
      return;
    }
    toastError(getErrorMessage(error, fallback));
  }, []);

  useEffect(() => {
    let cancelled = false;

    authApi
      .getMfaStatus()
      .then((status) => {
        if (cancelled) return;
        setIsEnabled(!!status.mfa_enabled);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        reportError(error, "Gagal memuat status MFA.");
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reportError]);

  const handleStartSetup = async () => {
    setIsBusy(true);
    setRecoveryCodes([]);
    try {
      const data = await authApi.setupMfa();
      setSetupData(data);
      setVerifyCode("");
    } catch (error) {
      reportError(error, "Gagal memulai pengaturan MFA.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleEnable = async () => {
    const code = verifyCode.trim();
    if (!/^\d{6}$/.test(code)) {
      toastWarning("Masukkan 6 digit kode dari aplikasi authenticator.");
      return;
    }

    setIsBusy(true);
    try {
      const result = await authApi.enableMfa(code);
      setIsEnabled(true);
      setSetupData(null);
      setVerifyCode("");
      setRecoveryCodes(result.recovery_codes || []);
      setRecoveryModalMode("enable");
      setRecoveryAcknowledged(false);
      setIsRecoveryModalOpen(true);
      toastSuccess(result.message || "MFA berhasil diaktifkan.");
    } catch (error) {
      reportError(error, "Gagal mengaktifkan MFA.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDisable = async () => {
    if (!password || !disableCode.trim()) {
      toastWarning("Masukkan password dan kode MFA untuk menonaktifkan.");
      return;
    }

    setIsBusy(true);
    try {
      const result = await authApi.disableMfa(password, disableCode.trim());
      setIsEnabled(false);
      setPassword("");
      setDisableCode("");
      setRecoveryCodes([]);
      setSetupData(null);
      toastSuccess(result.message || "MFA berhasil dinonaktifkan.");
    } catch (error) {
      reportError(error, "Gagal menonaktifkan MFA.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleRegenerate = async () => {
    if (!password) {
      toastWarning("Masukkan password Anda terlebih dahulu.");
      return;
    }

    setIsBusy(true);
    try {
      const result = await authApi.regenerateRecoveryCodes(password);
      setRecoveryCodes(result.recovery_codes || []);
      setPassword("");
      setRecoveryModalMode("regenerate");
      setRecoveryAcknowledged(false);
      setIsRecoveryModalOpen(true);
      toastSuccess(result.message || "Kode pemulihan baru berhasil dibuat.");
    } catch (error) {
      reportError(error, "Gagal membuat kode pemulihan baru.");
    } finally {
      setIsBusy(false);
    }
  };

  const copyRecoveryCodes = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join("\n"));
      toastSuccess("Kode pemulihan disalin ke clipboard.");
    } catch {
      toastError("Gagal menyalin. Salin kode secara manual.");
    }
  };

  const downloadRecoveryCodes = () => {
    const content = [
      "Kode Pemulihan MFA - Mahkota Drive",
      `Dibuat: ${new Date().toLocaleString("id-ID")}`,
      "",
      "Setiap kode hanya dapat digunakan satu kali.",
      "",
      ...recoveryCodes,
      "",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kode-pemulihan-mfa.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const closeRecoveryModal = async () => {
    if (!recoveryAcknowledged) {
      const confirmed = await confirmToast({
        title: "Kode pemulihan belum disimpan?",
        message:
          "Kode ini hanya ditampilkan sekali. Jika ditutup sekarang, kode tidak bisa dilihat lagi.",
        confirmText: "Tutup",
        cancelText: "Kembali",
        variant: "warning",
      });
      if (!confirmed) return;
    }

    setIsRecoveryModalOpen(false);
    setRecoveryCodes([]);
    setRecoveryAcknowledged(false);
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-600">
            verified_user
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Autentikasi Dua Faktor (MFA)
            </h3>
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Tambahkan lapisan keamanan dengan aplikasi authenticator.
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
            isEnabled
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {isEnabled ? "check_circle" : "shield"}
          </span>
          {isEnabled ? "Aktif" : "Nonaktif"}
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Memuat status MFA…</p>
      ) : !isEnabled && !setupData ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 dark:bg-slate-800 p-4">
            <p className="text-sm text-gray-700 dark:text-slate-300">
              MFA belum aktif. Setelah diaktifkan, Anda akan diminta memasukkan
              kode 6 digit dari aplikasi authenticator setiap kali login.
            </p>
          </div>
          <Button onClick={handleStartSetup} disabled={isBusy} icon="qr_code_2">
            {isBusy ? "Menyiapkan…" : "Aktifkan MFA"}
          </Button>
        </div>
      ) : setupData ? (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700">
              <QRCodeSVG value={setupData.otpauth_url} size={180} level="M" />
            </div>
            <div className="flex-1 space-y-3">
              <ol className="list-decimal space-y-1 pl-4 text-sm text-gray-700 dark:text-slate-300">
                <li>Buka aplikasi authenticator di ponsel Anda.</li>
                <li>Pindai QR code di samping.</li>
                <li>Masukkan kode 6 digit yang muncul untuk verifikasi.</li>
              </ol>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Atau masukkan kode manual
                </p>
                <code className="mt-1 block break-all rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  {setupData.secret}
                </code>
              </div>
            </div>
          </div>

          <div className="max-w-xs">
            <Input
              id="mfa-verify-code"
              name="mfa-verify-code"
              label="Kode Verifikasi"
              placeholder="000000"
              value={verifyCode}
              onChange={(e) =>
                setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="text-center tracking-[0.4em] font-mono text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleEnable}
              disabled={isBusy || verifyCode.length !== 6}
              icon="check"
            >
              {isBusy ? "Memverifikasi…" : "Verifikasi & Aktifkan"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSetupData(null);
                setVerifyCode("");
              }}
              disabled={isBusy}
            >
              Batal
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-gray-700 dark:text-slate-300">
              MFA aktif. Login baru akan meminta kode dari aplikasi
              authenticator Anda.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-5 dark:border-slate-700">
            <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              Buat ulang kode pemulihan
            </h4>
            <p className="mb-3 text-xs text-gray-600 dark:text-slate-400">
              Kode lama akan langsung tidak berlaku.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="w-full max-w-xs">
                <PasswordInput
                  id="mfa-regen-password"
                  name="mfa-regen-password"
                  label="Password"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                variant="secondary"
                onClick={handleRegenerate}
                disabled={isBusy || !password}
                icon="refresh"
              >
                {isBusy ? "Memproses…" : "Buat ulang"}
              </Button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5 dark:border-slate-700">
            <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              Nonaktifkan MFA
            </h4>
            <p className="mb-3 text-xs text-gray-600 dark:text-slate-400">
              Konfirmasi dengan password dan kode MFA yang sedang aktif.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="w-full max-w-xs">
                <PasswordInput
                  id="mfa-disable-password"
                  name="mfa-disable-password"
                  label="Password"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="w-full max-w-[180px]">
                <Input
                  id="mfa-disable-code"
                  name="mfa-disable-code"
                  label="Kode MFA"
                  placeholder="000000"
                  value={disableCode}
                  onChange={(e) =>
                    setDisableCode(
                      e.target.value.replace(/[^A-Za-z0-9-]/g, "").toUpperCase(),
                    )
                  }
                  autoComplete="one-time-code"
                />
              </div>
              <Button
                variant="danger"
                onClick={handleDisable}
                disabled={isBusy || !password || !disableCode.trim()}
                icon="shield_off"
              >
                {isBusy ? "Memproses…" : "Nonaktifkan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isRecoveryModalOpen}
        onClose={closeRecoveryModal}
        title={
          recoveryModalMode === "enable"
            ? "MFA Berhasil Diaktifkan"
            : "Kode Pemulihan Baru"
        }
        size="md"
      >
        <div className="space-y-5 p-6">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <span className="material-symbols-outlined text-amber-600 text-xl shrink-0">
              key
            </span>
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                Simpan kode pemulihan ini sekarang
              </p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                Kode ini hanya ditampilkan sekali. Setiap kode hanya bisa dipakai
                satu kali jika Anda kehilangan akses ke aplikasi authenticator.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {recoveryCodes.map((code) => (
              <code
                key={code}
                className="rounded-lg bg-slate-100 px-2 py-1.5 text-center font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                {code}
              </code>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon="content_copy"
              onClick={copyRecoveryCodes}
            >
              Salin semua
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon="download"
              onClick={downloadRecoveryCodes}
            >
              Unduh .txt
            </Button>
          </div>

          <Checkbox
            label="Saya sudah menyimpan kode pemulihan di tempat yang aman"
            checked={recoveryAcknowledged}
            onChange={(e) => setRecoveryAcknowledged(e.target.checked)}
          />

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
            <Button variant="secondary" onClick={closeRecoveryModal}>
              Tutup
            </Button>
            <Button
              onClick={closeRecoveryModal}
              disabled={!recoveryAcknowledged}
              icon="check"
            >
              Selesai
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default MfaSettings;

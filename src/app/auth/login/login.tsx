"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toastSuccess, toastError, toastWarning } from "@/components/ui/toast-provider";
import { useAuth } from "@/lib/auth-context";
import { HttpClientError } from "@/lib/api-http";
import {
  LOGIN_FAILED_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  getErrorMessage,
  getLoginErrorMessage,
} from "@/lib/utils/error-message";
import { sanitizeEmailInput, containsInvalidEmailChars } from "@/lib/utils/validation";
import type { User } from "@/lib/types/auth";

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { login, completeMfaLogin } = useAuth();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [checked, setChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleEmailChange = (value: string) => {
    const sanitized = sanitizeEmailInput(value);
    setFormValues((prev) => ({ ...prev, email: sanitized }));
    if (hasSubmitted && errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setFormValues((prev) => ({ ...prev, password: value }));
    if (hasSubmitted && errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleMfaCodeChange = (value: string) => {
    const next = useRecoveryCode
      ? value.toUpperCase().replace(/[^A-Z0-9-]/g, "")
      : value.replace(/\D/g, "").slice(0, 6);
    setMfaCode(next);
    if (mfaError) setMfaError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const emailValue = formValues.email.trim();
    const passwordValue = formValues.password;

    if (!emailValue) {
      newErrors.email = "Email or Employee ID is required";
      isValid = false;
    } else if (containsInvalidEmailChars(emailValue)) {
      newErrors.email = "Email or Employee ID cannot contain symbols";
      isValid = false;
    } else if (emailValue.length < 3) {
      newErrors.email = "Email or Employee ID must be at least 3 characters";
      isValid = false;
    }

    if (!passwordValue) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (passwordValue.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const redirectAfterLogin = (userData: User) => {
    toastSuccess("Welcome back! You are being redirected to the dashboard.");
    const isDriver = userData?.role?.code === "DRIVER";
    setTimeout(() => router.push(isDriver ? "/dashboard/driver" : "/dashboard"), 500);
  };

  const handleMfaSubmit = async () => {
    if (!mfaToken) return;

    const code = mfaCode.trim();
    if (!code) {
      setMfaError(
        useRecoveryCode
          ? "Masukkan kode pemulihan Anda."
          : "Masukkan 6 digit kode verifikasi.",
      );
      return;
    }

    if (!useRecoveryCode && code.length !== 6) {
      setMfaError("Kode verifikasi harus 6 digit.");
      return;
    }

    setIsSubmitting(true);
    setMfaError(null);

    try {
      const userData = await completeMfaLogin(mfaToken, code, checked);
      redirectAfterLogin(userData);
    } catch (error) {
      if (error instanceof HttpClientError) {
        if (error.statusCode === 0) {
          setMfaError(NETWORK_ERROR_MESSAGE);
          toastError(NETWORK_ERROR_MESSAGE);
        } else if (error.statusCode === 401) {
          const message =
            "Kode verifikasi salah atau sudah kedaluwarsa. Silakan coba lagi.";
          setMfaError(message);
          toastError(message);
        } else {
          const message = getErrorMessage(
            error,
            "Verifikasi MFA gagal. Silakan coba lagi.",
          );
          setMfaError(message);
          toastError(message);
        }
      } else {
        const message = getErrorMessage(
          error,
          "Verifikasi MFA gagal. Silakan coba lagi.",
        );
        setMfaError(message);
        toastError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mfaToken) {
      await handleMfaSubmit();
      return;
    }

    setHasSubmitted(true);

    if (!validateForm()) {
      return;
    }

    if (!turnstileToken) {
      setTurnstileError(
        "Verifikasi keamanan belum selesai. Selesaikan dulu, lalu klik Masuk.",
      );
      toastWarning("Verifikasi keamanan belum selesai. Silakan selesaikan dulu.");
      turnstileRef.current?.reset();
      return;
    }

    setTurnstileError(null);
    setIsSubmitting(true);

    try {
      const result = await login(
        formValues.email.trim(),
        formValues.password,
        turnstileToken,
        checked,
      );

      if ("mfa_required" in result) {
        setMfaToken(result.mfa_token);
        setMfaCode("");
        setMfaError(null);
        setUseRecoveryCode(false);
        toastSuccess("Password benar. Masukkan kode verifikasi MFA Anda.");
        return;
      }

      redirectAfterLogin(result);
    } catch (error) {
      turnstileRef.current?.reset();
      setTurnstileToken("");
      if (error instanceof HttpClientError) {
        const msg = (error.message || "").toLowerCase();
        const isSecurityIssue =
          msg.includes("turnstile") ||
          msg.includes("captcha") ||
          msg.includes("security check");
        if (isSecurityIssue) {
          const securityMessage =
            "Verifikasi keamanan gagal. Silakan selesaikan ulang verifikasi.";
          setTurnstileError(securityMessage);
          toastError(securityMessage);
        } else if (error.statusCode === 401) {
          // Jangan pernah tampilkan pesan backend (bisa bocorkan data akun).
          toastError(LOGIN_FAILED_MESSAGE);
        } else if (error.statusCode === 0) {
          toastError(NETWORK_ERROR_MESSAGE);
        } else {
          toastError(getLoginErrorMessage(error));
        }
      } else {
        toastError(getLoginErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCredentials = () => {
    setMfaToken(null);
    setMfaCode("");
    setMfaError(null);
    setUseRecoveryCode(false);
    setTurnstileToken("");
    turnstileRef.current?.reset();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          {mfaToken ? "Verifikasi Dua Faktor" : "Selamat Datang"}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {mfaToken
            ? "Masukkan kode dari aplikasi authenticator Anda untuk melanjutkan."
            : "Masuk ke akun Mahkota Drive Anda"}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {mfaToken ? (
          <>
            <div className="flex items-start gap-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-3 py-2">
              <span className="material-symbols-outlined text-blue-500 text-base shrink-0">
                verified_user
              </span>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                {useRecoveryCode
                  ? "Masukkan salah satu kode pemulihan yang Anda simpan saat mengaktifkan MFA."
                  : "Buka Google Authenticator, Microsoft Authenticator, atau aplikasi TOTP lainnya."}
              </p>
            </div>

            <Input
              id="mfa-code"
              name="mfa-code"
              label={useRecoveryCode ? "Kode Pemulihan" : "Kode Verifikasi"}
              placeholder={useRecoveryCode ? "XXXX-XXXX-XXXX-XXXX" : "000000"}
              value={mfaCode}
              onChange={(e) => handleMfaCodeChange(e.target.value)}
              inputMode={useRecoveryCode ? "text" : "numeric"}
              autoComplete="one-time-code"
              maxLength={useRecoveryCode ? 19 : 6}
              className="text-center tracking-[0.4em] font-mono text-lg"
              autoFocus
            />

            {mfaError && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 px-3 py-2">
                <span className="material-symbols-outlined text-rose-500 text-base shrink-0">
                  error
                </span>
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                  {mfaError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !mfaCode.trim()}
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center justify-center gap-2 text-sm"
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  isSubmitting ? "animate-spin" : ""
                }`}
              >
                {isSubmitting ? "progress_activity" : "shield_lock"}
              </span>
              {isSubmitting ? "Memverifikasi…" : "Verifikasi"}
            </button>

            <div className="flex flex-col gap-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setUseRecoveryCode((prev) => !prev);
                  setMfaCode("");
                  setMfaError(null);
                }}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                {useRecoveryCode
                  ? "Gunakan kode authenticator"
                  : "Gunakan kode pemulihan"}
              </button>
              <button
                type="button"
                onClick={handleBackToCredentials}
                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Kembali ke halaman login
              </button>
            </div>
          </>
        ) : (
          <>
            <Input
              id="email"
              name="email"
              label="Email"
              placeholder="Masukkan email Anda"
              value={formValues.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              error={hasSubmitted ? errors.email : undefined}
            />

            <PasswordInput
              id="password"
              name="password"
              label="Password"
              placeholder="Masukkan password Anda"
              value={formValues.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={hasSubmitted ? errors.password : undefined}
            />

            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <Checkbox
                    label="Ingat Saya"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                </div>
              </label>
              <a
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                href="/auth/forgot"
              >
                Lupa Password?
              </a>
            </div>

            <div className="flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setTurnstileError(null);
                }}
                onError={() => {
                  setTurnstileToken("");
                  setTurnstileError(
                    "Verifikasi keamanan gagal dimuat. Muat ulang halaman lalu coba lagi.",
                  );
                  toastWarning("Verifikasi keamanan gagal dimuat. Muat ulang halaman lalu coba lagi.");
                }}
                onExpire={() => {
                  setTurnstileToken("");
                  setTurnstileError(
                    "Verifikasi keamanan kedaluwarsa. Selesaikan ulang verifikasi.",
                  );
                  toastWarning("Verifikasi keamanan kedaluwarsa. Silakan selesaikan ulang.");
                }}
              />
            </div>

            {turnstileError && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 px-3 py-2">
                <span className="material-symbols-outlined text-rose-500 text-base shrink-0">
                  error
                </span>
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                  {turnstileError}
                </p>
              </div>
            )}

            {!turnstileToken && !turnstileError && (
              <p className="text-center text-xs text-slate-400">
                Menunggu verifikasi keamanan…
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center justify-center gap-2 text-sm"
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  isSubmitting ? "animate-spin" : ""
                }`}
              >
                {isSubmitting ? "progress_activity" : "login"}
              </span>
              {isSubmitting ? "Memverifikasi & masuk…" : "Masuk"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};
export default LoginPage;

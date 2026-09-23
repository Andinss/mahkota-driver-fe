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
import { sanitizeEmailInput, containsInvalidEmailChars } from "@/lib/utils/validation";

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [checked, setChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!validateForm()) {
      return;
    }

    if (!turnstileToken) {
      toastWarning("Please complete the security verification.");
      turnstileRef.current?.reset();
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = await login(
        formValues.email.trim(),
        formValues.password,
        turnstileToken,
        checked,
      );
      toastSuccess("Welcome back! You are being redirected to the dashboard.");
      const isDriver = userData?.role?.code === "DRIVER";
      setTimeout(() => router.push(isDriver ? "/dashboard/driver" : "/dashboard"), 500);
    } catch (error) {
      turnstileRef.current?.reset();
      setTurnstileToken("");
      if (error instanceof HttpClientError) {
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("turnstile") || msg.includes("security")) {
          toastError(error.message);
        } else if (error.statusCode === 401) {
          toastError(error.message && error.message !== "Unauthorized"
            ? error.message
            : "Email atau password salah.");
        } else if (error.statusCode === 0) {
          toastError("Tidak bisa terhubung ke server. Periksa koneksi Anda.");
        } else {
          toastError(error.message || "Login gagal. Coba lagi.");
        }
      } else {
        toastError("Tidak bisa terhubung ke server. Periksa koneksi Anda.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Selamat Datang
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Masuk ke akun Mahkota Drive Anda
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => {
              setTurnstileToken("");
              toastWarning("Security check gagal. Silakan coba muat ulang halaman.");
            }}
            onExpire={() => {
              setTurnstileToken("");
              toastWarning("Security check expired — silakan selesaikan ulang.");
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center justify-center gap-2 text-sm"
        >
          <span className="material-symbols-outlined text-xl">
            {isSubmitting ? "hourglass_empty" : "login"}
          </span>
          {isSubmitting ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </div>
  );
};
export default LoginPage;

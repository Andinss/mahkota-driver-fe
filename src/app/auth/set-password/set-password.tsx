"use client";
import { PasswordInput } from "@/components/ui/password-input";
import { useState, useEffect } from "react";
import { toastSuccess, toastError } from "@/components/ui/toast-provider";
import { authApi } from "@/lib/api/auth";
import { HttpClientError } from "@/lib/api-http";
import { sanitizeInput, containsSymbols } from "@/lib/utils/validation";
import { useRouter } from "next/navigation";

interface FormErrors {
  password?: string;
  password_confirmation?: string;
}

interface SetPasswordPageProps {
  token: string;
}

const SetPasswordPage = ({ token }: SetPasswordPageProps) => {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    authApi
      .verifySetToken(token)
      .then((res) => {
        if (!res.valid) {
          router.replace("/auth/login");
        } else {
          setIsTokenValid(true);
        }
      })
      .catch((err) => {
        if (err instanceof HttpClientError && (err.statusCode === 404 || err.statusCode === 400)) {
          setIsTokenValid(true);
        } else {
          router.replace("/auth/login");
        }
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [token, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { password, password_confirmation } = formValues;

    if (!password) {
      newErrors.password = "Password is required";
    } else if (containsSymbols(password)) {
      newErrors.password = "Password cannot contain symbols";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (password !== password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.setPassword({
        token,
        password: formValues.password,
        password_confirmation: formValues.password_confirmation,
      });
      toastSuccess("Your password has been created. Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      if (error instanceof HttpClientError) {
        toastError(error.message);
      } else {
        toastError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormValues((prev) => ({ ...prev, [field]: sanitized }));
    if (hasSubmitted && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isVerifying) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center min-h-[250px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Verifying link...</p>
      </div>
    );
  }

  if (!isTokenValid) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Buat Password
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Buat password untuk akun Anda
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <PasswordInput
          id="password"
          name="password"
          label="Password Baru"
          placeholder="Masukkan password baru"
          value={formValues.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          error={hasSubmitted ? errors.password : undefined}
        />

        <PasswordInput
          id="password_confirmation"
          name="password_confirmation"
          label="Konfirmasi Password"
          placeholder="Konfirmasi password baru"
          value={formValues.password_confirmation}
          onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
          error={hasSubmitted ? errors.password_confirmation : undefined}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center justify-center gap-2 text-sm"
        >
          <span className="material-symbols-outlined text-xl">
            {isSubmitting ? "hourglass_empty" : "lock"}
          </span>
          {isSubmitting ? "Menyimpan..." : "Simpan Password"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a
          href="/auth/login"
          className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Kembali ke Login
        </a>
      </div>
    </div>
  );
};
export default SetPasswordPage;

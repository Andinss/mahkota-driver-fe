"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toastSuccess, toastError } from "@/components/ui/toast-provider";
import { authApi } from "@/lib/api/auth";
import { HttpClientError } from "@/lib/api-http";
import { sanitizeEmailInput, containsInvalidEmailChars } from "@/lib/utils/validation";

interface FormErrors {
  email?: string;
}

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({ email: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (value: string) => {
    const sanitized = sanitizeEmailInput(value);
    setFormValues({ email: sanitized });
    if (errors.email) {
      setErrors({ email: undefined });
    }
  };

  const validateEmail = (): boolean => {
    const newErrors: FormErrors = {};
    const emailValue = formValues.email.trim();

    if (!emailValue) {
      newErrors.email = "Email is required";
    } else if (containsInvalidEmailChars(emailValue)) {
      newErrors.email = "Email cannot contain symbols";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.forgotPassword({ email: formValues.email.trim() });
      toastSuccess("Password reset instructions have been sent to your email.");
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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Lupa Password?
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Masukkan email Anda untuk menerima instruksi reset password
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          id="email"
          name="email"
          label="Email"
          placeholder="Masukkan email Anda"
          type="email"
          value={formValues.email}
          onChange={(e) => handleInputChange(e.target.value)}
          error={hasSubmitted ? errors.email : undefined}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center justify-center gap-2 text-sm"
        >
          <span className="material-symbols-outlined text-xl">
            {isSubmitting ? "hourglass_empty" : "send"}
          </span>
          {isSubmitting ? "Mengirim..." : "Kirim Instruksi"}
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
export default ForgotPasswordPage;

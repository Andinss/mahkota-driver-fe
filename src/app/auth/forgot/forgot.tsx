"use client";
import { Button } from "@/components/ui/button";
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
    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-[1px]">
      <div className="bg-white dark:bg-[#1a2632] rounded-xl p-5 sm:p-12 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary-container dark:text-blue-400 mb-6">
            <span className="material-symbols-outlined" data-icon="lock_reset">
              lock_reset
            </span>
            <span className="text-xs font-bold tracking-widest uppercase">
              Security Portal
            </span>
          </div>
          <h1 className="text-on-surface dark:text-white text-[2rem] font-black leading-tight tracking-tight mb-4">
            Forgot Password?
          </h1>
          <p className="text-on-surface-variant dark:text-gray-400 text-base leading-relaxed max-w-sm">
            Enter your email to receive password reset instructions.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Input
              id="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={formValues.email}
              onChange={(e) => handleInputChange(e.target.value)}
              error={hasSubmitted ? errors.email : undefined}
            />
          </div>

          <Button
            type="submit"
            icon="lock_reset"
            className="editorial-gradient"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Instructions"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;

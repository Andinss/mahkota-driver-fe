"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FormErrors {
  email?: string;
}

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({ email: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (value: string) => {
    setFormValues({ email: value });
    if (errors.email) {
      setErrors({ email: undefined });
    }
  };

  const validateEmail = (): boolean => {
    const newErrors: FormErrors = {};
    const emailValue = formValues.email.trim();

    if (!emailValue) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);
    setSuccessMessage("");

    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        "Password reset instructions have been sent to your email.",
      );
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl p-[1px]">
      <div className="bg-white rounded-xl p-5 sm:p-12 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary-container mb-6">
            <span className="material-symbols-outlined" data-icon="lock_reset">
              lock_reset
            </span>
            <span className="text-xs font-bold tracking-widest uppercase">
              Security Portal
            </span>
          </div>
          <h1 className="text-on-surface text-[2rem] font-black leading-tight tracking-tight mb-4">
            Forgot Password?
          </h1>
          <p className="text-on-surface-variant text-base leading-relaxed max-w-sm">
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

          {successMessage && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
              {successMessage}
            </div>
          )}

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

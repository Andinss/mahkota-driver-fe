"use client";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { AlertDialog } from "@/components/ui/alert";
import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { HttpClientError } from "@/lib/api-http";
import { useRouter } from "next/navigation";

interface FormErrors {
  password?: string;
  password_confirmation?: string;
}

interface ResetPasswordPageProps {
  token: string;
}

const ResetPasswordPage = ({ token }: ResetPasswordPageProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { password, password_confirmation } = formValues;

    if (!password) {
      newErrors.password = "Password is required";
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
    setAlert((prev) => ({ ...prev, isOpen: false }));

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.resetPassword({
        token,
        password: formValues.password,
        password_confirmation: formValues.password_confirmation,
      });
      setAlert({
        isOpen: true,
        type: "success",
        title: "Password Reset Successful",
        message: "Your password has been reset. Redirecting to login...",
      });
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      if (error instanceof HttpClientError) {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Reset Failed",
          message: error.message,
        });
      } else {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Reset Failed",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setAlert((prev) => ({ ...prev, isOpen: false }));
    if (hasSubmitted && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-xl p-[1px]">
      <div className="bg-white rounded-xl p-6 sm:p-12 flex flex-col">
        <div className="flex items-center gap-2 mb-1 text-primary"></div>
        <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-on-surface mb-2">
          Reset Password
        </h1>
        <p className="text-on-surface-variant font-body leading-relaxed opacity-80">
          Enter your new password below.
        </p>
        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <PasswordInput
              id="password"
              name="password"
              label="New Password"
              placeholder="Enter your new password"
              value={formValues.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={hasSubmitted ? errors.password : undefined}
            />
          </div>
          <div className="flex flex-col gap-2">
            <PasswordInput
              id="password_confirmation"
              name="password_confirmation"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={formValues.password_confirmation}
              onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
              error={hasSubmitted ? errors.password_confirmation : undefined}
            />
          </div>

          <AlertDialog
            isOpen={alert.isOpen}
            onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
            type={alert.type}
            title={alert.title}
            message={alert.message}
          />

          <Button
            type="submit"
            icon="login"
            className="editorial-gradient"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default ResetPasswordPage;

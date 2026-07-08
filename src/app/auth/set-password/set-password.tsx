"use client";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { AlertDialog } from "@/components/ui/alert";
import { useState, useEffect } from "react";
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
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

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
    setAlert((prev) => ({ ...prev, isOpen: false }));

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
      setAlert({
        isOpen: true,
        type: "success",
        title: "Password Set Successfully",
        message: "Your password has been created. Redirecting to login...",
      });
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      if (error instanceof HttpClientError) {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Failed",
          message: error.message,
        });
      } else {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Failed",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormValues((prev) => ({ ...prev, [field]: sanitized }));
    setAlert((prev) => ({ ...prev, isOpen: false }));
    if (hasSubmitted && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isVerifying) {
    return (
      <div className="bg-white dark:bg-[#1a2632] rounded-xl p-[1px]">
        <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-on-surface-variant dark:text-gray-400">Verifying link...</p>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-[1px]">
      <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 sm:p-12 flex flex-col">
        <div className="flex items-center gap-2 mb-1 text-primary dark:text-blue-400"></div>
        <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-on-surface dark:text-white mb-2">
          Set Your Password
        </h1>
        <p className="text-on-surface-variant dark:text-gray-400 font-body leading-relaxed opacity-80">
          Create a password for your account to get started.
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
            {isSubmitting ? "Setting Password..." : "Set Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default SetPasswordPage;

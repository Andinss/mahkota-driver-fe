"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    uppercase: false,
    numberOrSymbol: false,
  });

  const checkPasswordRequirements = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password) && /[a-z]/.test(password),
      numberOrSymbol: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { currentPassword, newPassword, confirmPassword } = formValues;

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (hasSubmitted && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (field === "newPassword") {
      checkPasswordRequirements(value);
    }
  };

  return (
    <div className="bg-white rounded-xl p-[1px]">
      <div className="bg-white rounded-xl p-6 sm:p-12 flex flex-col">
        <div className="flex items-center gap-2 mb-1 text-primary"></div>
        <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-on-surface mb-2">
          Change Password
        </h1>
        <p className="text-on-surface-variant font-body leading-relaxed opacity-80">
          For your account security, please create a strong and unique new
          password.
        </p>
        <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              label="Current Password"
              placeholder="Enter your current password"
              value={formValues.currentPassword}
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              error={hasSubmitted ? errors.currentPassword : undefined}
            />
          </div>
          <div className="flex flex-col gap-2">
            <PasswordInput
              id="newPassword"
              name="newPassword"
              label="New Password"
              placeholder="Enter your new password"
              value={formValues.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              error={hasSubmitted ? errors.newPassword : undefined}
            />
          </div>
          <div className="flex flex-col gap-2">
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={formValues.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              error={hasSubmitted ? errors.confirmPassword : undefined}
            />
          </div>

          <Button
            type="submit"
            icon="login"
            className="editorial-gradient"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Changing Password..." : "Change Password"}
          </Button>
          <div className="bg-blue-50 p-5 rounded-md space-y-3">
            <p className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider">
              Security Requirements:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span
                  className={`material-symbols-outlined text-[18px] ${passwordRequirements.minLength ? "text-green-600" : "text-outline-variant"}`}
                >
                  {passwordRequirements.minLength
                    ? "check_circle"
                    : "radio_button_unchecked"}
                </span>
                Minimum 8 characters
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span
                  className={`material-symbols-outlined text-[18px] ${passwordRequirements.uppercase ? "text-green-600" : "text-outline-variant"}`}
                >
                  {passwordRequirements.uppercase
                    ? "check_circle"
                    : "radio_button_unchecked"}
                </span>
                Combination of uppercase & lowercase letters
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span
                  className={`material-symbols-outlined text-[18px] ${passwordRequirements.numberOrSymbol ? "text-green-600" : "text-outline-variant"}`}
                >
                  {passwordRequirements.numberOrSymbol
                    ? "check_circle"
                    : "radio_button_unchecked"}
                </span>
                At least one number or symbol
              </li>
            </ul>
          </div>
        </form>
        <div className="mt-10 flex justify-end">
          <a
            className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors font-medium text-sm"
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back
          </a>
        </div>
      </div>
    </div>
  );
};
export default ChangePasswordPage;

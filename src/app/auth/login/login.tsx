"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AlertDialog } from "@/components/ui/alert";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { HttpClientError } from "@/lib/api-http";

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setAlert((prev) => ({ ...prev, isOpen: false }));
    if (hasSubmitted && errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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
    } else if (emailValue.length < 3) {
      newErrors.email = "Email or Employee ID must be at least 3 characters";
      isValid = false;
    }

    if (!passwordValue) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (passwordValue.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      setAlert({
        isOpen: true,
        type: "error",
        title: "Verification Required",
        message: "Please complete the security verification.",
      });
      return;
    }

    setIsSubmitting(true);
    setAlert((prev) => ({ ...prev, isOpen: false }));

    try {
      await login(formValues.email.trim(), formValues.password, turnstileToken);
      setAlert({
        isOpen: true,
        type: "success",
        title: "Login Successful",
        message: "Welcome back! You are being redirected to the dashboard.",
      });
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (error) {
      turnstileRef.current?.reset();
      setTurnstileToken("");
      if (error instanceof HttpClientError) {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Login Failed",
          message: error.message,
        });
      } else {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Login Failed",
          message: "Please check your credentials and try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-[1px]">
      <div className="bg-white dark:bg-[#1a2632] rounded-xl p-5 sm:p-12 flex flex-col">
        <div className="mb-4">
          <h1 className="text-4xl font-black text-on-surface dark:text-white tracking-tighter leading-none mb-4 font-headline">
            Sign In
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-base">
            Please sign in to manage your vehicle fleet.
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Input
              id="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              value={formValues.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={hasSubmitted ? errors.email : undefined}
            />
          </div>

          <div className="flex flex-col gap-2">
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formValues.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={hasSubmitted ? errors.password : undefined}
            />
          </div>

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <Checkbox
                  label="Remember Me"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              </div>
            </label>
            <a
              className="text-sm font-bold text-primary-container dark:text-blue-400 hover:text-primary dark:hover:text-blue-300 transition-colors"
              href="/auth/forgot"
            >
              Forgot Password?
            </a>
          </div>

          <div className="flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken("")}
              onExpire={() => setTurnstileToken("")}
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
            className="editorial-gradient w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;

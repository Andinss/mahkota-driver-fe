"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AlertDialog } from "@/components/ui/alert";

export interface UserFormData {
  username: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  avatar?: string;
}

interface AddUserFormProps {
  mode?: "add" | "edit";
  initialData?: UserFormData;
  onSubmit?: (data: UserFormData) => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
  isSubmitting?: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export function AddUserForm({
  mode = "add",
  initialData,
  onSubmit,
  onCancel,
  onSaveDraft,
  isSubmitting = false,
}: AddUserFormProps) {
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [formValues, setFormValues] = useState({
    username: initialData?.username || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    role: initialData?.role || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [avatar, setAvatar] = useState<string>(initialData?.avatar || "");
  const [isDraftAlertOpen, setIsDraftAlertOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setIsActive(initialData.isActive);
      setFormValues({
        username: initialData.username || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        role: initialData.role || "",
      });
      setAvatar(initialData.avatar || "");
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.username?.trim()) {
      newErrors.username = "Username is required";
    } else if (formValues.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }

    if (!formValues.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formValues.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formValues.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10-15 digits";
    }

    if (!formValues.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data: UserFormData = {
      username: formValues.username,
      email: formValues.email,
      phone: formValues.phone,
      role: formValues.role,
      isActive: isActive,
      avatar: avatar,
    };

    onSubmit?.(data);
  };

  const handleSaveDraft = () => {
    const draftData: UserFormData = {
      username: formValues.username,
      email: formValues.email,
      phone: formValues.phone,
      role: formValues.role,
      isActive: isActive,
      avatar: avatar,
    };

    // Simpan ke localStorage
    localStorage.setItem("user_draft", JSON.stringify(draftData));
    setIsDraftAlertOpen(true);
    onSaveDraft?.();
  };

  const handleDraftAlertClose = () => {
    setIsDraftAlertOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatar("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const buttonText = isSubmitting
    ? "Processing..."
    : mode === "add"
      ? "Create User"
      : "Update User";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Left Side */}
        <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/50 p-8 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            {/* Avatar Upload Section - SAMA PERSIS DENGAN VEHICLE */}
            <div>
              <h3 className="text-[#111418] dark:text-white text-lg font-bold mb-4">
                Personal Photo
              </h3>
              <div className="relative group">
                <div
                  className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-6 py-16 hover:border-primary transition-colors cursor-pointer ${
                    avatar ? "py-8" : ""
                  }`}
                  onClick={handleClick}
                >
                  {avatar ? (
                    <div className="w-full">
                      <img
                        src={avatar}
                        alt="User preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          className="flex-1 px-4 py-2 bg-[#f0f2f4] dark:bg-[#2a3845] text-[#111418] dark:text-white rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-[#3a4855] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                          }}
                        >
                          Change Photo
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-primary text-3xl">
                          add_a_photo
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-[#111418] dark:text-white font-bold">
                          Upload Personal Photo
                        </p>
                        <p className="text-[#617589] text-sm mt-1">
                          Click to browse or drag & drop
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-4 px-4 py-2 bg-[#f0f2f4] dark:bg-[#2a3845] text-[#111418] dark:text-white rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-[#3a4855] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick();
                        }}
                      >
                        Select File
                      </button>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  type="file"
                  onChange={handleFileSelect}
                />
              </div>
              <p className="text-xs text-[#617589] dark:text-slate-400 mt-3 italic text-center">
                Accepted formats: JPG, PNG. Max size 5MB.
              </p>
            </div>

            {/* Icon Blue Box */}
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 dark:shadow-none mt-6">
              <span
                className="material-symbols-outlined text-white text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {mode === "add" ? "person_add" : "edit"}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {mode === "add" ? "User Onboarding" : "Edit User"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {mode === "add"
                ? "Ensure the email address is correct as an invitation link will be sent automatically to the new user."
                : "Update user information and permissions."}
            </p>
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-blue-600 text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span className="text-xs font-medium text-slate-500">
                Secure access control
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-blue-600 text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span className="text-xs font-medium text-slate-500">
                Role-based permissions
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:col-span-8 p-8 md:p-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="username"
                name="username"
                label="Username"
                placeholder="Enter username"
                required
                value={formValues.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                error={errors.username}
              />

              <Input
                id="email"
                name="email"
                label="Email Address"
                placeholder="Enter email address"
                type="email"
                required
                value={formValues.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
              />

              <Input
                id="phone"
                name="phone"
                label="Phone Number"
                placeholder="Enter phone number"
                type="tel"
                required
                value={formValues.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={errors.phone}
              />

              <Select
                id="role"
                name="role"
                label="Assign Role"
                required
                value={formValues.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                error={errors.role}
              >
                <option value="">Select a role</option>
                <option value="administrator">Administrator</option>
                <option value="fleet_manager">Fleet Manager</option>
                <option value="staff">Staff</option>
                <option value="driver">Driver</option>
              </Select>
            </div>

            <hr className="border-slate-100 dark:border-slate-800 my-6" />

            {/* Account Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-blue-600 dark:text-blue-400"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Account Status
                  </p>
                  <p className="text-xs text-slate-500">
                    Enable immediate login access
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  checked={isActive}
                  className="sr-only peer"
                  type="checkbox"
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active
                </span>
              </label>
            </div>

            {/* Actions Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              {mode === "add" && onSaveDraft && (
                <button
                  type="button"
                  className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  Save Draft
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <span>{buttonText}</span>
                <span className="material-symbols-outlined text-sm">
                  {mode === "add" ? "send" : "save"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <AlertDialog
        isOpen={isDraftAlertOpen}
        onClose={handleDraftAlertClose}
        title="Draft Saved Successfully"
        message="Your user data has been saved as draft. You can continue later."
        type="success"
        confirmText="OK"
        autoCloseDelay={3000}
      />
    </div>
  );
}

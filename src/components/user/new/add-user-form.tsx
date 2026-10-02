"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toastSuccess } from "@/components/ui/toast-provider";
import {
  containsSymbols,
  containsInvalidEmailChars,
  containsNameSymbols,
  sanitizeInput,
  sanitizeEmailInput,
  sanitizeNameInput,
} from "@/lib/utils/validation";

export interface UserFormData {
  username: string;
  fullname: string;
  email: string;
  role: string;
  isActive: boolean;
  phoneNumber?: string;
  driver_id?: string;
}

interface Option {
  id: string;
  name: string;
}

interface DriverOption {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone?: string;
}

interface AddUserFormProps {
  mode?: "add" | "edit";
  initialData?: UserFormData;
  onSubmit?: (data: UserFormData) => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
  isSubmitting?: boolean;
  roles?: Option[];
  drivers?: DriverOption[];
  selectedDriverId?: string;
  onDriverChange?: (driverId: string) => void;
}

interface FormErrors {
  username?: string;
  fullname?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
}

export function AddUserForm({
  mode = "add",
  initialData,
  onSubmit,
  onCancel,
  onSaveDraft,
  isSubmitting = false,
  roles = [],
  drivers = [],
  selectedDriverId,
  onDriverChange,
}: AddUserFormProps) {
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [formValues, setFormValues] = useState({
    username: initialData?.username || "",
    fullname: initialData?.fullname || "",
    email: initialData?.email || "",
    role: initialData?.role || "",
    phoneNumber: initialData?.phoneNumber || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [localDriverId, setLocalDriverId] = useState<string>(selectedDriverId || initialData?.driver_id || "");

  useEffect(() => {
    if (initialData) {
      setIsActive(initialData.isActive);
      setFormValues({
        username: initialData.username || "",
        fullname: initialData.fullname || "",
        email: initialData.email || "",
        role: initialData.role || "",
        phoneNumber: initialData.phoneNumber || "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (selectedDriverId !== undefined) {
      setLocalDriverId(selectedDriverId);
    }
  }, [selectedDriverId]);

  const isDriver = roles.find(role => role.id === formValues.role)?.name?.toLowerCase() === "driver";

  useEffect(() => {
    if (isDriver && localDriverId) {
      const driver = drivers.find((d) => d.id === localDriverId);
      if (driver) {
        setFormValues((prev) => {
          if (mode === "add") {
            return {
              ...prev,
              username: driver.employeeId,
              fullname: driver.name,
              email: driver.email,
              phoneNumber: driver.phone || prev.phoneNumber || "",
            };
          }
          // Saat edit: ambil dari kolom users, jangan override
          // fullname/email/username dengan data driver. Telepon hanya
          // diisi kalau masih kosong (users tidak punya kolom phone).
          return {
            ...prev,
            phoneNumber: prev.phoneNumber || driver.phone || "",
          };
        });
      }
    }
  }, [localDriverId, isDriver, drivers, mode]);

  useEffect(() => {
    if (!isDriver && mode === "add") {
      setLocalDriverId("");
      // Reset field yang ter-fill dari driver
      setFormValues((prev) => ({
        ...prev,
        username: "",
        fullname: "",
        email: "",
        phoneNumber: "",
      }));
    }
  }, [isDriver, mode]);

  const handleDriverSelect = (driverId: string) => {
    setLocalDriverId(driverId);
    onDriverChange?.(driverId);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.username?.trim()) {
      newErrors.username = "Username is required";
    } else if (!isDriver && containsSymbols(formValues.username.trim())) {
      newErrors.username = "Username can only contain letters and numbers";
    } else if (formValues.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }

    if (!formValues.fullname?.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (containsNameSymbols(formValues.fullname.trim())) {
      newErrors.fullname = "Full name can only contain letters and spaces";
    } else if (formValues.fullname.trim().length < 2) {
      newErrors.fullname = "Full name must be at least 2 characters";
    }

    if (!formValues.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (containsInvalidEmailChars(formValues.email.trim())) {
      newErrors.email = "Email contains invalid characters";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formValues.role) {
      newErrors.role = "Please select a role";
    }

    if (isDriver) {
      if (!formValues.phoneNumber?.trim()) {
        newErrors.phoneNumber = "Phone number is required for driver";
      } else if (!/^[0-9+\-\s()]+$/.test(formValues.phoneNumber.trim())) {
        newErrors.phoneNumber = "Please enter a valid phone number";
      } else if (formValues.phoneNumber.trim().length < 10) {
        newErrors.phoneNumber = "Phone number must be at least 10 characters";
      }
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
      fullname: formValues.fullname,
      email: formValues.email,
      role: formValues.role,
      isActive: isActive,
      phoneNumber: isDriver ? formValues.phoneNumber : undefined,
      driver_id: isDriver && localDriverId ? localDriverId : undefined,
    };

    onSubmit?.(data);
  };

  const handleSaveDraft = () => {
    const draftData: UserFormData = {
      username: formValues.username,
      fullname: formValues.fullname,
      email: formValues.email,
      role: formValues.role,
      isActive: isActive,
      phoneNumber: formValues.phoneNumber,
      driver_id: localDriverId,
    };

    // Simpan ke localStorage
    localStorage.setItem("user_draft", JSON.stringify(draftData));
    toastSuccess("Your user data has been saved as draft. You can continue later.");
    onSaveDraft?.();
  };

  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    let sanitized = value;
    if (field === "username") {
      sanitized = sanitizeInput(value);
    } else if (field === "fullname") {
      sanitized = sanitizeNameInput(value);
    } else if (field === "email") {
      sanitized = sanitizeEmailInput(value);
    } else if (field === "phoneNumber") {
      sanitized = value.replace(/[^0-9+\-\s()]/g, "");
    }
    setFormValues((prev) => ({ ...prev, [field]: sanitized }));
  };

  const buttonText = isSubmitting
    ? "Processing..."
    : mode === "add"
      ? "Create User"
      : "Update User";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">
            {mode === "add" ? "person_add" : "edit"}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            {mode === "add" ? "Data Pengguna" : "Edit Pengguna"}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === "add"
              ? "Masukkan informasi pengguna baru"
              : "Perbarui informasi pengguna"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role */}
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
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Select>

          {/* Driver Select — kalau role driver */}
          {isDriver && (
            <div className="space-y-2">
              <Select
                id="driver_id"
                name="driver_id"
                label="Pilih Driver"
                required
                value={localDriverId}
                onChange={(e) => handleDriverSelect(e.target.value)}
              >
                <option value="">Pilih driver yang ingin dibuatkan akun</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.employeeId})
                  </option>
                ))}
              </Select>
              {drivers.length === 0 && (
                <p className="text-xs text-amber-500 italic">
                  Semua driver sudah memiliki akun
                </p>
              )}
            </div>
          )}

          {/* Username */}
          <Input
            id="username"
            name="username"
            label="Username"
            placeholder="Enter username"
            required
            value={formValues.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            error={errors.username}
            disabled={isDriver}
          />

          {/* Full Name */}
          <Input
            id="fullname"
            name="fullname"
            label="Full Name"
            placeholder="Enter full name"
            required
            value={formValues.fullname}
            onChange={(e) => handleInputChange("fullname", e.target.value)}
            error={errors.fullname}
            disabled={isDriver}
          />

          {/* Email */}
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

          {/* Phone Number */}
          <Input
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter phone number"
            type="tel"
            value={formValues.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            error={errors.phoneNumber}
          />
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
              name="is_active"
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
            className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Batal
          </button>
          {mode === "add" && onSaveDraft && (
            <button
              type="button"
              className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              Save Draft
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-xl">
              {isSubmitting ? "hourglass_empty" : "check_circle"}
            </span>
            <span>{isSubmitting ? "Menyimpan..." : mode === "add" ? "Simpan User" : "Update User"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

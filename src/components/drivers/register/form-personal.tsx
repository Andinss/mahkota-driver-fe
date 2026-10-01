"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { sanitizeNameInput, containsNameSymbols, sanitizeEmailInput } from "@/lib/utils/validation";
import { membershipApi } from "@/lib/api/membership";
import type { Membership } from "@/lib/types/membership";

export interface PersonalFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  employeeId: string;
  citizenship: string;
  phoneNumber: string;
  email: string;
  membershipId?: string; 
  membership?: { id: string; name: string; fee: number } | null;
}

type FormMode = "add" | "edit";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  employeeId?: string;
  citizenship?: string;
  phoneNumber?: string;
  email?: string;
  membershipId?: string; 
}

interface PersonalDetailsFormProps {
  mode?: FormMode;
  initialValues?: Partial<PersonalFormData>;
  onSubmit?: (data: PersonalFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function PersonalDetailsForm({
  mode = "add",
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PersonalDetailsFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [firstName, setFirstName] = useState(sanitizeNameInput(initialValues?.firstName || ""));
  const [lastName, setLastName] = useState(sanitizeNameInput(initialValues?.lastName || ""));
  const [employeeId, setEmployeeId] = useState(initialValues?.employeeId || "");
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loadingMemberships, setLoadingMemberships] = useState(false);
  const [membershipId, setMembershipId] = useState(
    initialValues?.membershipId || "",
  );

  /* Fetch list membership aktif */
  useEffect(() => {
    setLoadingMemberships(true);
    membershipApi
      .getList()
      .then((res: any) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        setMemberships(list.filter((m: Membership) => m.is_active));
      })
      .catch((err: any) => {
        console.error("Failed to load memberships:", err);
        setMemberships([]);
      })
      .finally(() => setLoadingMemberships(false));
  }, []);

  useEffect(() => {
    if (initialValues) {
      setFirstName(sanitizeNameInput(initialValues.firstName || ""));
      setLastName(sanitizeNameInput(initialValues.lastName || ""));
      setEmployeeId(initialValues.employeeId || "");
      setMembershipId(initialValues.membershipId || "");
    }
  }, [
    initialValues?.firstName,
    initialValues?.lastName,
    initialValues?.employeeId,
    initialValues?.membershipId,
  ]);

  const currentMembership =
    memberships.find((m) => m.id === initialValues?.membershipId) || null;
  const selectedMembership =
    memberships.find((m) => m.id === membershipId) || null;

  const rupiah = (value: number) =>
    `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

  const validateForm = (): boolean => {
    const formData = new FormData(formRef.current || undefined);
    const newErrors: FormErrors = {};

    const dateOfBirth = formData.get("dateOfBirth") as string;
    const gender = formData.get("gender") as string;
    const citizenship = formData.get("citizenship") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;

    if (!firstName?.trim()) {
      newErrors.firstName = "First name is required";
    } else if (containsNameSymbols(firstName.trim())) {
      newErrors.firstName = "First name cannot contain symbols";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (containsNameSymbols(lastName.trim())) {
      newErrors.lastName = "Last name cannot contain symbols";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (employeeId && !/^[a-zA-Z0-9-]+$/.test(employeeId)) {
      newErrors.employeeId = "Employee ID can only contain letters, numbers, and hyphens";
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!gender) {
      newErrors.gender = "Gender is required";
    }

    if (!citizenship) {
      newErrors.citizenship = "Citizenship is required";
    }

    if (!phoneNumber?.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone number must be 10-15 digits";
    }

    if (!email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const membershipId = formData.get("membershipId") as string;
    const selectedMembership = memberships.find((m) => m.id === membershipId) || null;

    const data: PersonalFormData = {
      firstName,
      lastName,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
      employeeId: employeeId === "DRV-" ? "" : employeeId,
      citizenship: formData.get("citizenship") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      membershipId: membershipId || undefined,
      membership: selectedMembership
        ? { id: selectedMembership.id, name: selectedMembership.name, fee: selectedMembership.fee }
        : null,
    };
    onSubmit?.(data);
  };

  const buttonText = isSubmitting
    ? "Saving..."
    : mode === "add"
      ? "Save Driver"
      : "Update Driver";

  return (
    <div className="w-full flex flex-col">
      <form
        ref={formRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
        id="personalForm"
        onSubmit={handleSubmit}
      >
        <Input
          id="firstName"
          name="firstName"
          label="First Name"
          placeholder="Enter first name"
          value={firstName}
          onChange={(e) => setFirstName(sanitizeNameInput(e.target.value))}
          required
          error={errors.firstName}
        />

        <Input
          id="lastName"
          name="lastName"
          label="Last Name"
          placeholder="Enter last name"
          value={lastName}
          onChange={(e) => setLastName(sanitizeNameInput(e.target.value))}
          required
          error={errors.lastName}
        />

        <DateInput
          id="dateOfBirth"
          name="dateOfBirth"
          label="Date of Birth"
          defaultValue={initialValues?.dateOfBirth}
          required
          error={errors.dateOfBirth}
        />

        <Select id="gender" name="gender" label="Gender"
          defaultValue={initialValues?.gender} error={errors.gender}
          key={"gender-" + (initialValues?.gender || "")} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </Select>

        <div>
          <Input
            id="employeeId"
            name="employeeId"
            label="Employee ID"
            placeholder="DRV-0000"
            value={employeeId}
            onFocus={() => {
              if (!employeeId) setEmployeeId("DRV-");
            }}
            onChange={(e) => {
              let val = e.target.value.replace(/[^a-zA-Z0-9-]/g, "");
              val = val.replace(/^(DRV)+-?/i, "");
              setEmployeeId(val ? "DRV-" + val : "DRV-");
            }}
            error={errors.employeeId}
          />
          <p className="text-xs text-slate-400">
            DRV- will be added automatically. Leave just &quot;DRV-&quot; to auto-generate.
          </p>
        </div>

        <Select id="citizenship" name="citizenship" label="Citizenship"
          defaultValue={initialValues?.citizenship} error={errors.citizenship}
          key={"citizenship-" + (initialValues?.citizenship || "")} required>
          <option value="">Select Citizenship</option>
          <option value="Indonesian (WNI)">Indonesian (WNI)</option>
          <option value="Foreigner (WNA)">Foreigner (WNA)</option>
        </Select>

        <Input
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          placeholder="Enter phone number"
          type="tel"
          defaultValue={initialValues?.phoneNumber}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, "");
            const nativeInput = e.target;
            nativeInput.value = val;
          }}
          required
          error={errors.phoneNumber}
        />

        <Input
          id="email"
          name="email"
          label="Email Address"
          placeholder="Enter email address"
          type="email"
          defaultValue={initialValues?.email}
          onChange={(e) => {
            const val = sanitizeEmailInput(e.target.value);
            const nativeInput = e.target;
            nativeInput.value = val;
          }}
          required
          error={errors.email}
        />

        {/* Membership — NEW */}
        <div>
          <Select
            id="membershipId"
            name="membershipId"
            label="Membership"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
            error={errors.membershipId}
            key={"membership-" + (initialValues?.membershipId || "")}
          >
            <option value="">
              {loadingMemberships ? "Loading..." : "Select Membership (Optional)"}
            </option>
            {memberships.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — Rp {Number(m.fee).toLocaleString("id-ID")}
              </option>
            ))}
          </Select>

          {selectedMembership &&
            selectedMembership.id !== currentMembership?.id && (
              <div
                className={`mt-2 rounded-xl border p-3 flex items-start gap-2 ${
                  !currentMembership
                    ? "border-purple-100 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/10"
                    : selectedMembership.level > currentMembership.level
                      ? "border-amber-100 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-lg ${
                    !currentMembership
                      ? "text-purple-600 dark:text-purple-400"
                      : selectedMembership.level > currentMembership.level
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {!currentMembership
                    ? "card_membership"
                    : selectedMembership.level > currentMembership.level
                      ? "upgrade"
                      : "south"
                }
                </span>
                <div>
                  {!currentMembership ? (
                    <>
                      <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                        Biaya membership: {rupiah(selectedMembership.fee)}
                      </p>
                      <p className="text-xs text-purple-600/80 dark:text-purple-300/80 mt-0.5">
                        Fee penuh {selectedMembership.name} (Level{" "}
                        {selectedMembership.level}) — driver belum punya
                        membership.
                      </p>
                    </>
                  ) : selectedMembership.level > currentMembership.level ? (
                    <>
                      <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                        Biaya upgrade:{" "}
                        {rupiah(
                          Math.max(
                            0,
                            Number(selectedMembership.fee) -
                              Number(currentMembership.fee),
                          ),
                        )}
                      </p>
                      <p className="text-xs text-amber-600/80 dark:text-amber-300/80 mt-0.5">
                        {currentMembership.name} (Level {currentMembership.level}){" "}
                        → {selectedMembership.name} (Level{" "}
                        {selectedMembership.level}) — selisih fee membership.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Downgrade ke {selectedMembership.name} — tanpa biaya
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Level turun dari {currentMembership.name} (Level{" "}
                        {currentMembership.level}) ke {selectedMembership.name}{" "}
                        (Level {selectedMembership.level}) — tidak ada refund.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
        </div>
      </form>
    </div>
  );
}
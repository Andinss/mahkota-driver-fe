"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface PersonalFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  employeeId: string;
  citizenship: string;
  phoneNumber: string;
  email: string;
}

type FormMode = "add" | "edit";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  citizenship?: string;
  phoneNumber?: string;
  email?: string;
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

  const validateForm = (): boolean => {
    const formData = new FormData(formRef.current || undefined);
    const newErrors: FormErrors = {};

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const gender = formData.get("gender") as string;
    const citizenship = formData.get("citizenship") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;

    if (!firstName?.trim()) {
      newErrors.firstName = "First name is required";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
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
    const data: PersonalFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
      employeeId: formData.get("employeeId") as string,
      citizenship: formData.get("citizenship") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
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
          defaultValue={initialValues?.firstName}
          required
          error={errors.firstName}
        />

        <Input
          id="lastName"
          name="lastName"
          label="Last Name"
          placeholder="Enter last name"
          defaultValue={initialValues?.lastName}
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
         key={"gender-" + (initialValues?.gender || "")}>
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
            defaultValue={initialValues?.employeeId}
          />
          <p className="text-[11px] text-slate-400">
            Leave blank to auto-generate.
          </p>
        </div>

        <Select id="citizenship" name="citizenship" label="Citizenship"
        defaultValue={initialValues?.citizenship} error={errors.citizenship}
        key={"citizenship-" + (initialValues?.citizenship || "")}>
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
          required
          error={errors.email}
        />
      </form>
    </div>
  );
}

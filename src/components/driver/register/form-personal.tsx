"use client";

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        />

        <Input
          id="lastName"
          name="lastName"
          label="Last Name"
          placeholder="Enter last name"
          defaultValue={initialValues?.lastName}
          required
        />

        <DateInput
          id="dateOfBirth"
          name="dateOfBirth"
          label="Date of Birth"
          defaultValue={initialValues?.dateOfBirth}
          required
        />

        <Select id="gender" name="gender" label="Gender"
         defaultValue={initialValues?.gender}>
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
        defaultValue={initialValues?.citizenship}>
          <option value="">Select Citizenship</option>
          <option value="Indonesian (WNI)">Indonesian (WNI)</option>
          <option value="Foreigner (WNA)">Foreigner (WNA)</option>
        </Select>
      </form>
    </div>
  );
}

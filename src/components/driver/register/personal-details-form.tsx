"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DriverProfileUpload } from "./upload-profile";
import {
  PersonalDetailsForm as PersonalFormComponent,
  PersonalFormData,
} from "./form-personal";

export interface PersonalDetailsData extends PersonalFormData {
  profilePhoto?: File;
}

interface PersonalDetailsFormProps {
  onNext: (data: PersonalDetailsData) => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
  initialData?: Partial<PersonalDetailsData>;
  initialProfilePhotoUrl?: string;
  mode?: "add" | "edit";
}

export function PersonalDetailsForm({
  onNext,
  onBack,
  onSaveDraft,
  initialData,
  initialProfilePhotoUrl,
  mode = "add",
}: PersonalDetailsFormProps) {
  const [profilePhoto, setProfilePhoto] = useState<File | undefined>(
    initialData?.profilePhoto,
  );
  const [photoPreview, setPhotoPreview] = useState<string>(
    initialProfilePhotoUrl || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoSelect = (file: File | null) => {
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePhoto(undefined);
      setPhotoPreview("");
    }
  };

  const handleSubmit = (data: PersonalFormData) => {
    setIsSubmitting(true);
    const fullData: PersonalDetailsData = {
      ...data,
      profilePhoto: profilePhoto,
    };
    onNext(fullData);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">badge</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Step 1: Personal Information</h3>
          <p className="text-xs text-slate-400">Isi data diri driver dengan lengkap</p>
        </div>
      </div>

      {/* Profile Photo Upload */}
      <div className="mb-6">
        <DriverProfileUpload
          onImageSelect={handlePhotoSelect}
          initialImageUrl={initialProfilePhotoUrl}
          acceptedFormats={["JPG", "JPEG", "PNG"]}
          maxSizeMB={5}
        />
      </div>

      {/* Personal Form Fields */}
      <PersonalFormComponent
        mode={mode}
        initialValues={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Buttons */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
        <Link href="/dashboard/driver">
          <button
            type="button"
            className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
          >
            Batal
          </button>
        </Link>
        <Button
          variant="primary"
          type="submit"
          form="personalForm"
          icon="arrow_forward"
          iconPosition="right"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}

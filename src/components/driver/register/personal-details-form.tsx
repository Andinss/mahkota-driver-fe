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
}

export function PersonalDetailsForm({
  onNext,
  onBack,
  onSaveDraft,
  initialData,
  initialProfilePhotoUrl,
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">badge</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Step 1: Personal Information
          </h2>
        </div>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-primary text-[10px] font-bold rounded-full border border-blue-100 dark:border-blue-800 uppercase tracking-widest">
          Draft Auto-saved
        </span>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 bg-gray-50/50 dark:bg-slate-800/50 p-8 border-r border-[#f0f2f4] dark:border-slate-800">
          <DriverProfileUpload
            onImageSelect={handlePhotoSelect}
            initialImageUrl={initialProfilePhotoUrl}
            acceptedFormats={["JPG", "PNG"]}
            maxSizeMB={5}
          />
        </div>

        <div className="w-full md:w-2/3 p-8 flex flex-col justify-between">
          <PersonalFormComponent
            mode="add"
            initialValues={initialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <div className="mt-6 flex items-center justify-end gap-6">
            <Link href="/dashboard/driver">
              <button
                type="button"
                className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                Cancel
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
      </div>
    </div>
  );
}

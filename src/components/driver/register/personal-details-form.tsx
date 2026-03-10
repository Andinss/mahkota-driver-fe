"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface PersonalDetailsData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  employeeId: string;
  citizenship: string;
}

interface PersonalDetailsFormProps {
  onNext: (data: PersonalDetailsData) => void;
  onCancel?: () => void;
}

export function PersonalDetailsForm({
  onNext,
  onCancel,
}: PersonalDetailsFormProps) {
  const [profilePhoto, setProfilePhoto] = useState<File | undefined>();
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(undefined);
    setPhotoPreview("");
  };

  const triggerPhotoUpload = () => {
    document.getElementById("profilePhotoInput")?.click();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: PersonalDetailsData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
      employeeId: formData.get("employeeId") as string,
      citizenship: formData.get("citizenship") as string,
    };
    onNext(data);
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
      <div className="px-8 pb-8">
        <form
          id="personalDetailsForm"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          <Input
            id="firstName"
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            required
          />

          <Input
            id="lastName"
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            required
          />

          <DateInput
            id="dateOfBirth"
            name="dateOfBirth"
            label="Date of Birth"
            required
          />

          <Select id="gender" name="gender" label="Gender">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Select>

          <div>
            <Input
              id="employeeId"
              name="employeeId"
              label="Employee ID"
              placeholder="DRV-0000"
            />
            <p className="text-[11px] text-slate-400">
              Leave blank to auto-generate.
            </p>
          </div>

          <Select id="citizenship" name="citizenship" label="Citizenship">
            <option>Indonesian (WNI)</option>
            <option>Foreigner (WNA)</option>
          </Select>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold mb-6 text-slate-800 dark:text-white">
            Profile Photo
          </h3>
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 dark:bg-slate-800 relative cursor-pointer overflow-hidden hover:border-primary transition-colors"
              onClick={triggerPhotoUpload}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-3xl text-slate-300">
                  add_a_photo
                </span>
              )}
              <input
                id="profilePhotoInput"
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                  onClick={triggerPhotoUpload}
                >
                  Choose File
                </button>
                {photoPreview && (
                  <button
                    type="button"
                    className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                    onClick={handleRemovePhoto}
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                JPG, GIF or PNG. 1MB max. This photo will be used for the
                driver's digital ID card.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-end gap-6">
          <button
            type="button"
            className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <Button
            variant="primary"
            type="submit"
            form="personalDetailsForm"
            icon="arrow_forward"
            iconPosition="right"
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
}

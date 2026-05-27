"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Radio } from "@/components/ui/radio";

export interface ContactInfoData {
  phoneNumber: string;
  email: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  permanentAddress: string;
  addressType: string;
}

interface FormErrors {
  phoneNumber?: string;
  email?: string;
  emergencyContactNumber?: string;
  emergencyContactEmail?: string;
  house?: string;
  readyToSignContract?: string;
  permanentAddress?: string;
  willingToBeSurveyed?: string;
}

interface ContactInfoFormProps {
  onNext: (data: ContactInfoData) => void;
  onBack: () => void;
  onSaveDraft?: () => void;
  initialData?: ContactInfoData;
}

export function ContactInfoForm({
  onNext,
  onBack,
  onSaveDraft,
  initialData,
}: ContactInfoFormProps) {
  const [readyToSignContract, setReadyToSignContract] = useState<string>("");
  const [willingToBeSurveyed, setWillingToBeSurveyed] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (initialData) {
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const formData = new FormData(formRef.current || undefined);
    const newErrors: FormErrors = {};

    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;
    const emergencyContactNumber = formData.get(
      "emergencyContactNumber",
    ) as string;
    const emergencyContactEmail = formData.get(
      "emergencyContactEmail",
    ) as string;
    const house = formData.get("house") as string;
    const permanentAddress = formData.get("permanentAddress") as string;

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

    if (!emergencyContactNumber?.trim()) {
      newErrors.emergencyContactNumber = "Emergency contact number is required";
    } else if (!/^\d{10,15}$/.test(emergencyContactNumber.replace(/\D/g, ""))) {
      newErrors.emergencyContactNumber =
        "Emergency contact number must be 10-15 digits";
    }

    if (!emergencyContactEmail?.trim()) {
      newErrors.emergencyContactEmail = "Emergency contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emergencyContactEmail)) {
      newErrors.emergencyContactEmail = "Please enter a valid email address";
    }

    if (!house) {
      newErrors.house = "Please select house type";
    }

    if (!readyToSignContract) {
      newErrors.readyToSignContract =
        "Please select if you are ready to sign contract";
    }

    if (!permanentAddress?.trim()) {
      newErrors.permanentAddress = "Permanent address is required";
    } else if (permanentAddress.trim().length < 10) {
      newErrors.permanentAddress = "Please enter a complete address";
    }

    if (!willingToBeSurveyed) {
      newErrors.willingToBeSurveyed =
        "Please select if you are willing to be surveyed";
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
    const data: ContactInfoData = {
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      emergencyContactName: formData.get("emergencyContactNumber") as string,
      emergencyContactRelationship: formData.get(
        "emergencyContactEmail",
      ) as string,
      permanentAddress: formData.get("permanentAddress") as string,
      addressType: formData.get("house") as string,
    };

    onNext(data);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">badge</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Step 2: Contact Information
          </h2>
        </div>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-primary text-[10px] font-bold rounded-full border border-blue-100 dark:border-blue-800 uppercase tracking-widest">
          Draft Auto-saved
        </span>
      </div>

      <div className="p-8">
        <form
          ref={formRef}
          id="contactInfoForm"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              placeholder="e.g. +62 812 3456 7890"
              type="tel"
              defaultValue={initialData?.phoneNumber}
              required
              error={errors.phoneNumber}
            />

            <Input
              id="emergencyContactNumber"
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="Phone number of emergency contact"
              defaultValue={initialData?.emergencyContactName}
              required
              error={errors.emergencyContactNumber}
            />

            <Input
              id="email"
              name="email"
              label="Email Address"
              placeholder="e.g. driver@email.com"
              type="email"
              defaultValue={initialData?.email}
              required
              error={errors.email}
            />

            <Input
              id="emergencyContactEmail"
              name="emergencyContactEmail"
              label="Emergency Contact Email"
              placeholder="Email address of emergency contact"
              type="email"
              defaultValue={initialData?.emergencyContactRelationship}
              required
              error={errors.emergencyContactEmail}
            />

            <div>
              <Select
                id="house"
                name="house"
                label="House"
                error={errors.house}
              >
                <option value="">Select house type</option>
                <option value="contract">Contract</option>
                <option value="property_parent">Property Parent</option>
                <option value="own_yourself">Own Yourself</option>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Ready To Sign Contract <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <Radio
                  id="readyToSignYes"
                  name="readyToSignContract"
                  value="true"
                  label="Yes"
                  checked={readyToSignContract === "true"}
                  onChange={(e) => setReadyToSignContract(e.target.value)}
                />
                <Radio
                  id="readyToSignNo"
                  name="readyToSignContract"
                  value="false"
                  label="No"
                  checked={readyToSignContract === "false"}
                  onChange={(e) => setReadyToSignContract(e.target.value)}
                />
              </div>
              {errors.readyToSignContract && (
                <p className="text-xs text-red-500">
                  {errors.readyToSignContract}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-[#111418] dark:text-white mb-1.5"
                htmlFor="permanentAddress"
              >
                Permanent Address <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`w-full rounded-lg border bg-white dark:bg-[#1a2632] px-3 py-2 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary h-auto ${errors.permanentAddress ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-[#dbe0e6] dark:border-[#4b5563]"}`}
                placeholder="Enter full permanent address including city, state, and zip code"
                name="permanentAddress"
                id="permanentAddress"
                rows={2}
              />
              {errors.permanentAddress && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.permanentAddress}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Willing To Be Surveyed
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <Radio
                      id="willingToSurveyYes"
                      name="willingToBeSurveyed"
                      value="true"
                      label="Yes"
                      checked={willingToBeSurveyed === "true"}
                      onChange={(e) => setWillingToBeSurveyed(e.target.value)}
                    />
                    <Radio
                      id="willingToSurveyNo"
                      name="willingToBeSurveyed"
                      value="false"
                      label="No"
                      checked={willingToBeSurveyed === "false"}
                      onChange={(e) => setWillingToBeSurveyed(e.target.value)}
                    />
                  </div>
                  {errors.willingToBeSurveyed && (
                    <p className="text-xs text-red-500">
                      {errors.willingToBeSurveyed}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <Button variant="ghost" onClick={onBack} icon="arrow_back">
              Back
            </Button>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={onSaveDraft}>
                Save Draft
              </Button>
              <Button
                variant="primary"
                type="submit"
                form="contactInfoForm"
                icon="arrow_forward"
                iconPosition="right"
              >
                Next Step
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

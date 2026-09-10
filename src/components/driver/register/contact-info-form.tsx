"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Radio } from "@/components/ui/radio";
import { sanitizeEmailInput } from "@/lib/utils/validation";

export interface ContactInfoData {
  emergencyContactName: string;
  emergencyContactRelationship: string;
  permanentAddress: string;
  addressType: string;
  readySignContract: string;
  willingToBeSurveyed: string;
  email?: string;
  phoneNumber?: string;
}

interface FormErrors {
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
  const [readyToSignContract, setReadyToSignContract] = useState<string>(initialData?.readySignContract || "");
  const [willingToBeSurveyed, setWillingToBeSurveyed] = useState<string>(initialData?.willingToBeSurveyed || "");
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

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
      emergencyContactName: formData.get("emergencyContactNumber") as string,
      emergencyContactRelationship: formData.get(
        "emergencyContactEmail",
      ) as string,
      permanentAddress: formData.get("permanentAddress") as string,
      addressType: formData.get("house") as string,
      readySignContract: formData.get("readyToSignContract") as string,
      willingToBeSurveyed: formData.get("willingToBeSurveyed") as string,
    };

    onNext(data);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-emerald-500 text-xl">contact_mail</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Step 2: Contact Information</h3>
          <p className="text-xs text-slate-400">Masukkan data kontak dan alamat driver</p>
        </div>
      </div>

      <form
        ref={formRef}
        id="contactInfoForm"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="emergencyContactNumber"
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="Phone number of emergency contact"
            defaultValue={initialData?.emergencyContactName}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              const nativeInput = e.target;
              nativeInput.value = val;
            }}
            required
            error={errors.emergencyContactNumber}
          />

          <Input
            id="emergencyContactEmail"
            name="emergencyContactEmail"
            label="Emergency Contact Email"
            placeholder="Email address of emergency contact"
            type="email"
            defaultValue={initialData?.emergencyContactRelationship}
            onChange={(e) => {
              const val = sanitizeEmailInput(e.target.value);
              const nativeInput = e.target;
              nativeInput.value = val;
            }}
            required
            error={errors.emergencyContactEmail}
          />

          <div>
            <Select
              id="house"
              name="house"
              label="House"
              defaultValue={initialData?.addressType || ""}
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
              defaultValue={initialData?.permanentAddress || ""}
            />
            {errors.permanentAddress && (
              <p className="text-xs text-red-500 mt-1">
                {errors.permanentAddress}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
          >
            Back
          </button>
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
      </form>
    </div>
  );
}

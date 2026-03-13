"use client";

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

interface ContactInfoFormProps {
  onNext: (data: ContactInfoData) => void;
  onBack: () => void;
  onSaveDraft?: () => void;
}

export function ContactInfoForm({
  onNext,
  onBack,
  onSaveDraft,
}: ContactInfoFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: ContactInfoData = {
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      emergencyContactName: formData.get("emergencyContactName") as string,
      emergencyContactRelationship: formData.get(
        "emergencyContactRelationship",
      ) as string,
      permanentAddress: formData.get("permanentAddress") as string,
      addressType: formData.get("addressType") as string,
    };
    onNext(data);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-primary">
              contact_mail
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Step 2: Contact Information
          </h2>
        </div>
        <div className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-medium">
          Draft Auto-saved
        </div>
      </div>

      <div className="p-8">
        <form
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
              required
            />

            <Input
              id="emergencyContactName"
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Name of emergency contact"
              required
            />
            <Input
              id="email"
              name="email"
              label="Email Address"
              placeholder="e.g. driver@email.com"
              type="email"
              required
            />
            <Input
              id="emergencyContactNumber"
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="Phone number of emergency contact"
              required
            />
            <div>
              <label
                className="block text-sm font-medium text-[#111418] dark:text-white mb-1.5"
                htmlFor="permanentAddress"
              >
                Permanent Address <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-lg border border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-3 py-2 text-sm text-[#111418] dark:text-white placeholder:text-[#617589] focus:outline-none ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary min-h-[120px]"
                placeholder="Enter full permanent address including city, state, and zip code"
                name="permanentAddress"
                id="permanentAddress"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Ready To Sign Contract <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <Radio
                  id="readyToSignYes"
                  name="readyToSignContract"
                  value="true"
                  label="Yes"
                  required
                />
                <Radio
                  id="readyToSignNo"
                  name="readyToSignContract"
                  value="false"
                  label="No"
                  required
                />
              </div>
            </div>
            <div>
              <Select id="house" name="house" label="House">
                <option>Contract</option>
                <option>Property Parent</option>
                <option>Own Youself</option>
              </Select>
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Willing To Be Surveyed<span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <Radio
                      id="willingToSurveyYes"
                      name="willingToBeSurveyed"
                      value="true"
                      label="Yes"
                      required
                    />
                    <Radio
                      id="willingToSurveyNo"
                      name="willingToBeSurveyed"
                      value="false"
                      label="No"
                      required
                    />
                  </div>
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

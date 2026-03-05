"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";

export interface DocumentsData {
  simFront?: File;
  simExpiry: string;
  ktpFront?: File;
}

interface DocumentsFormProps {
  onNext: (data: DocumentsData) => void;
  onBack: () => void;
  onSaveDraft?: () => void;
}

export function DocumentsForm({
  onNext,
  onBack,
  onSaveDraft,
}: DocumentsFormProps) {
  const [simFile, setSimFile] = useState<File | undefined>();
  const [ktpFile, setKtpFile] = useState<File | undefined>();

  const handleSimUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSimFile(file);
    }
  };

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKtpFile(file);
    }
  };

  const triggerSimUpload = () => {
    document.getElementById("simFileInput")?.click();
  };

  const triggerKtpUpload = () => {
    document.getElementById("ktpFileInput")?.click();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: DocumentsData = {
      simFront: simFile,
      simExpiry: formData.get("simExpiry") as string,
      ktpFront: ktpFile,
    };
    onNext(data);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Step 3: Document Upload
              </h2>
              <p className="text-sm text-slate-400">
                Provide legal identification and permit documents.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-primary text-xs font-bold rounded-lg uppercase tracking-wider">
            Draft Auto-saved
          </span>
        </div>

        <form
          id="documentsForm"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {/* SIM Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Driver&apos;s License (SIM)
            </label>
            <div
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              onClick={triggerSimUpload}
            >
              <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-3xl">
                  cloud_upload
                </span>
              </div>
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                Upload Front Side of SIM
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Drag &amp; drop or{" "}
                <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-4 italic">
                JPG, PNG or PDF. Max size 2MB.
              </p>
              <input
                id="simFileInput"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={handleSimUpload}
              />
            </div>
            <div className="pt-4">
              <DateInput
                id="simExpiry"
                name="simExpiry"
                label="License Expiry Date"
                required
              />
            </div>
          </div>

          {/* KTP Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              National ID Card (KTP)
            </label>
            <div
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              onClick={triggerKtpUpload}
            >
              <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-3xl">
                  badge
                </span>
              </div>
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                Upload Front Side of KTP
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Drag &amp; drop or{" "}
                <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-4 italic">
                JPG, PNG or PDF. Max size 2MB.
              </p>
              <input
                id="ktpFileInput"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={handleKtpUpload}
              />
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 mt-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-blue-500 text-xl">
                  info
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ensure all details on your ID cards are clearly visible and
                  not cut off. Reflections or blurriness may cause registration
                  delays.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center md:col-span-2">
            <Button variant="ghost" onClick={onBack} icon="arrow_back">
              Previous Step
            </Button>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={onSaveDraft}>
                Save as Draft
              </Button>
              <Button
                variant="primary"
                type="submit"
                form="documentsForm"
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

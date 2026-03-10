"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";

export interface DocumentsData {
  simFront?: File;
  simExpiry: string;
  ktpFront?: File;
  npwpFront?: File;
  houseGaragePhoto?: File;
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
  const [npwpFile, setNpwpFile] = useState<File | undefined>();
  const [houseGarageFile, setHouseGarageFile] = useState<File | undefined>();

  const [simPreview, setSimPreview] = useState<string>("");
  const [ktpPreview, setKtpPreview] = useState<string>("");
  const [npwpPreview, setNpwpPreview] = useState<string>("");
  const [houseGaragePreview, setHouseGaragePreview] = useState<string>("");

  const handleSimUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSimFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSimPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKtpFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNpwpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNpwpFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNpwpPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHouseGarageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHouseGarageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHouseGaragePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSim = () => {
    setSimFile(undefined);
    setSimPreview("");
  };

  const handleRemoveKtp = () => {
    setKtpFile(undefined);
    setKtpPreview("");
  };

  const handleRemoveNpwp = () => {
    setNpwpFile(undefined);
    setNpwpPreview("");
  };

  const handleRemoveHouseGarage = () => {
    setHouseGarageFile(undefined);
    setHouseGaragePreview("");
  };

  const triggerSimUpload = () => {
    document.getElementById("simFileInput")?.click();
  };

  const triggerKtpUpload = () => {
    document.getElementById("ktpFileInput")?.click();
  };

  const triggerNpwpUpload = () => {
    document.getElementById("npwpFileInput")?.click();
  };

  const triggerHouseGarageUpload = () => {
    document.getElementById("houseGarageFileInput")?.click();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: DocumentsData = {
      simFront: simFile,
      simExpiry: formData.get("simExpiry") as string,
      ktpFront: ktpFile,
      npwpFront: npwpFile,
      houseGaragePhoto: houseGarageFile,
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
            {simPreview ? (
              <div className="border-2 border-solid border-primary bg-primary/5 rounded-2xl p-4 relative">
                <img
                  src={simPreview}
                  alt="SIM preview"
                  className="w-full h-40 object-contain rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveSim}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  {simFile?.name}
                </p>
              </div>
            ) : (
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
            )}
          </div>

          {/* KTP Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              National ID Card (KTP)
            </label>
            {ktpPreview ? (
              <div className="border-2 border-solid border-primary bg-primary/5 rounded-2xl p-4 relative">
                <img
                  src={ktpPreview}
                  alt="KTP preview"
                  className="w-full h-40 object-contain rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveKtp}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  {ktpFile?.name}
                </p>
              </div>
            ) : (
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
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Driver&apos;s NPWP
            </label>
            {npwpPreview ? (
              <div className="border-2 border-solid border-primary bg-primary/5 rounded-2xl p-4 relative">
                <img
                  src={npwpPreview}
                  alt="NPWP preview"
                  className="w-full h-40 object-contain rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveNpwp}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  {npwpFile?.name}
                </p>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                onClick={triggerNpwpUpload}
              >
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-3xl">
                    cloud_upload
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Upload Front Side of NPWP
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Drag &amp; drop or{" "}
                  <span className="text-primary font-medium">browse</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-4 italic">
                  JPG, PNG or PDF. Max size 2MB.
                </p>
                <input
                  id="npwpFileInput"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={handleNpwpUpload}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Driver&apos;s House &amp; Garage
            </label>
            {houseGaragePreview ? (
              <div className="border-2 border-solid border-primary bg-primary/5 rounded-2xl p-4 relative">
                <img
                  src={houseGaragePreview}
                  alt="House & Garage preview"
                  className="w-full h-40 object-contain rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveHouseGarage}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  {houseGarageFile?.name}
                </p>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                onClick={triggerHouseGarageUpload}
              >
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-3xl">
                    cloud_upload
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Upload Image House &amp; Garage
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Drag &amp; drop or{" "}
                  <span className="text-primary font-medium">browse</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-4 italic">
                  JPG, PNG or PDF. Max size 2MB.
                </p>
                <input
                  id="houseGarageFileInput"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={handleHouseGarageUpload}
                />
              </div>
            )}
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

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";


export interface DocumentsData {
  simFront?: File;
  ktpFront?: File;
  npwpFront?: File;
  houseGaragePhoto?: File;
}

export interface DocumentsUrlData {
  sim?: string;
  ktp?: string;
  npwp?: string;
  house?: string;
}

interface FormErrors {
  simFront?: string;
  ktpFront?: string;
  npwpFront?: string;
}

interface DocumentsFormProps {
  onNext: (data: DocumentsData) => void;
  onBack: () => void;
  onSaveDraft?: () => void;
  initialData?: DocumentsData;
  initialUrlData?: DocumentsUrlData;
}

export function DocumentsForm({
  onNext,
  onBack,
  onSaveDraft,
  initialData,
  initialUrlData,
}: DocumentsFormProps) {
  const [simFile, setSimFile] = useState<File | undefined>(initialData?.simFront);
  const [ktpFile, setKtpFile] = useState<File | undefined>(initialData?.ktpFront);
  const [npwpFile, setNpwpFile] = useState<File | undefined>(initialData?.npwpFront);
  const [houseGarageFile, setHouseGarageFile] = useState<File | undefined>(initialData?.houseGaragePhoto);
  const [errors, setErrors] = useState<FormErrors>({});

  const [simPreview, setSimPreview] = useState<string>(initialUrlData?.sim || "");
  const [ktpPreview, setKtpPreview] = useState<string>(initialUrlData?.ktp || "");
  const [npwpPreview, setNpwpPreview] = useState<string>(initialUrlData?.npwp || "");
  const [houseGaragePreview, setHouseGaragePreview] = useState<string>(initialUrlData?.house || "");

  const [simUrlRemoved, setSimUrlRemoved] = useState(false);
  const [ktpUrlRemoved, setKtpUrlRemoved] = useState(false);
  const [npwpUrlRemoved, setNpwpUrlRemoved] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const readFile = (file: File | undefined, setter: (v: string) => void) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    };
    readFile(initialData?.simFront, setSimPreview);
    readFile(initialData?.ktpFront, setKtpPreview);
    readFile(initialData?.npwpFront, setNpwpPreview);
    readFile(initialData?.houseGaragePhoto, setHouseGaragePreview);
  }, []);

  useEffect(() => {
    if (!simFile && initialUrlData?.sim) setSimPreview(initialUrlData.sim);
    if (!ktpFile && initialUrlData?.ktp) setKtpPreview(initialUrlData.ktp);
    if (!npwpFile && initialUrlData?.npwp) setNpwpPreview(initialUrlData.npwp);
    if (!houseGarageFile && initialUrlData?.house) setHouseGaragePreview(initialUrlData.house);
  }, [initialUrlData, simFile, ktpFile, npwpFile, houseGarageFile]);

  // show existing file name from URL
  const fileNameFromUrl = (url?: string) => url ? url.split("/").pop() || "Existing file" : "";

  const handleSimUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          simFront: "File size must be less than 2MB",
        }));
        return;
      }
      setSimFile(file);
      setErrors((prev) => ({ ...prev, simFront: undefined }));
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
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          ktpFront: "File size must be less than 2MB",
        }));
        return;
      }
      setKtpFile(file);
      setErrors((prev) => ({ ...prev, ktpFront: undefined }));
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
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          npwpFront: "File size must be less than 2MB",
        }));
        return;
      }
      setNpwpFile(file);
      setErrors((prev) => ({ ...prev, npwpFront: undefined }));
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
      if (file.size > 2 * 1024 * 1024) {
        return;
      }
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
    setSimUrlRemoved(true);
  };

  const handleRemoveKtp = () => {
    setKtpFile(undefined);
    setKtpPreview("");
    setKtpUrlRemoved(true);
  };

  const handleRemoveNpwp = () => {
    setNpwpFile(undefined);
    setNpwpPreview("");
    setNpwpUrlRemoved(true);
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

  const hasExistingSim = !simUrlRemoved && !!initialUrlData?.sim;
  const hasExistingKtp = !ktpUrlRemoved && !!initialUrlData?.ktp;
  const hasExistingNpwp = !npwpUrlRemoved && !!initialUrlData?.npwp;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!simFile && !hasExistingSim) {
      newErrors.simFront = "Driver's License (SIM) is required";
    }

    if (!ktpFile && !hasExistingKtp) {
      newErrors.ktpFront = "National ID Card (KTP) is required";
    }

    if (!npwpFile && !hasExistingNpwp) {
      newErrors.npwpFront = "NPWP is required";
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
    const data: DocumentsData = {
      simFront: simFile,
      ktpFront: ktpFile,
      npwpFront: npwpFile,
      houseGaragePhoto: houseGarageFile,
    };
    onNext(data);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-violet-500 text-xl">upload_file</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Step 3: Document Upload</h3>
          <p className="text-xs text-slate-400">Unggah dokumen penting driver (SIM, KTP, NPWP)</p>
        </div>
      </div>

      <form
        ref={formRef}
        id="documentsForm"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
          {/* SIM Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Driver&apos;s License (SIM){" "}
              <span className="text-red-500">*</span>
            </label>
            {errors.simFront && (
              <p className="text-xs text-red-500">{errors.simFront}</p>
            )}
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
                  {simFile?.name || fileNameFromUrl(initialUrlData?.sim)}
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
              National ID Card (KTP) <span className="text-red-500">*</span>
            </label>
            {errors.ktpFront && (
              <p className="text-xs text-red-500">{errors.ktpFront}</p>
            )}
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
                  {ktpFile?.name || fileNameFromUrl(initialUrlData?.ktp)}
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
              Driver&apos;s NPWP <span className="text-red-500">*</span>
            </label>
            {errors.npwpFront && (
              <p className="text-xs text-red-500">{errors.npwpFront}</p>
            )}
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
                  {npwpFile?.name || fileNameFromUrl(initialUrlData?.npwp)}
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
                  {houseGarageFile?.name || fileNameFromUrl(initialUrlData?.house)}
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
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 md:col-span-2">
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

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center md:col-span-2">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Back
            </button>
            <div className="flex gap-3">
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
  );
}

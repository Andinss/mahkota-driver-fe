"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmToast, toastError } from "@/components/ui/toast-provider";
import { Input } from "@/components/ui/input";
import { vendorApi } from "@/lib/api/vendor-vehicle";
import { renameFile } from "@/lib/utils/file";
import { HttpClientError } from "@/lib/api-http";

interface NewVendorFormProps {
  id: string | null;
}

interface FormErrors {
  name?: string;
  ownerName?: string;
  logo?: string;
}

const imageBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

function VendorLogoUpload({
  initialLogoUrl,
  onLogoChange,
  hasSubmitted,
  error,
}: {
  initialLogoUrl?: string;
  onLogoChange: (file: File | null) => void;
  hasSubmitted: boolean;
  error?: string;
}) {
  const [preview, setPreview] = useState<string | null>(initialLogoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFile = (file: File) => {
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toastError("File size exceeds 5MB limit");
      return false;
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const mime = file.type.split("/")[1]?.toLowerCase() || "";
    if (!["jpg", "jpeg", "png", "webp", "svg"].includes(ext) && !["jpg", "jpeg", "png", "webp", "svg+xml"].includes(mime)) {
      toastError("Invalid file format. Accepted: JPG, PNG, WEBP, SVG");
      return false;
    }
    return true;
  };

  const processFile = (file: File) => {
    if (!isValidFile(file)) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    onLogoChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#111418] dark:text-white">
        Logo Vendor {hasSubmitted && <span className="text-red-500">*</span>}
      </label>
      <div className="relative" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <div
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-6 py-10 hover:border-primary transition-colors cursor-pointer ${error ? "border-red-500" : ""}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Logo preview" className="w-24 h-24 rounded-2xl object-cover" />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#f0f2f4] dark:bg-[#2a3845] text-[#111418] dark:text-white rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-[#3a4855] transition-colors"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Change Logo
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    onLogoChange(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">add_photo_alternate</span>
              </div>
              <div className="text-center">
                <p className="text-[#111418] dark:text-white font-bold">Upload Logo Vendor</p>
                <p className="text-[#617589] text-sm mt-1">Click to browse or drag & drop</p>
              </div>
              <button
                type="button"
                className="mt-1 px-4 py-2 bg-[#f0f2f4] dark:bg-[#2a3845] text-[#111418] dark:text-white rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-[#3a4855] transition-colors"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                Select Logo
              </button>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          accept=".jpg,.jpeg,.png,.webp,.svg"
          className="hidden"
          type="file"
          onChange={handleFileSelect}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        <p className="text-xs text-[#617589] dark:text-slate-400 italic">
          Accepted formats: JPG, PNG, WEBP, SVG. Max size 5MB.
        </p>
      )}
    </div>
  );
}

const NewVendorForm = ({ id }: NewVendorFormProps) => {
  const router = useRouter();

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [initialLogoUrl, setInitialLogoUrl] = useState<string | undefined>(undefined);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      setMode("edit");
      vendorApi
        .getById(id)
        .then((res) => {
          const vendor = res.data;
          setName(vendor.name || "");
          setOwnerName(vendor.owner_name || "");
          const rawLogo = vendor.logo || "";
          setInitialLogoUrl(
            rawLogo
              ? rawLogo.startsWith("http")
                ? rawLogo
                : `${imageBase}/${rawLogo.replace(/^\//, "")}`
              : undefined,
          );
        })
        .catch((err: any) => {
          const msg =
            err instanceof HttpClientError
              ? err.message
              : "Failed to load vendor data.";
          toastError(msg);
        })
        .finally(() => setIsLoading(false));
    } else {
      setMode("add");
    }
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Nama vendor wajib diisi";
      isValid = false;
    }
    if (!ownerName.trim()) {
      newErrors.ownerName = "Nama pemilik wajib diisi";
      isValid = false;
    }
    if (!logoFile && !initialLogoUrl) {
      newErrors.logo = "Logo vendor wajib diunggah";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    if (!validateForm()) return;

    const confirmed = await confirmToast({
      title: mode === "add" ? "Confirm Registration" : "Confirm Update",
      message:
        mode === "add"
          ? `Are you sure you want to add vendor ${name}? Please review all information carefully.`
          : `Are you sure you want to update vendor ${name}? Please review all information carefully.`,
      confirmText: mode === "add" ? "Yes, Add Vendor" : "Yes, Update Vendor",
      cancelText: "Review Again",
      variant: "info",
    });

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("owner_name", ownerName.trim());
      if (logoFile) fd.append("logo", renameFile(logoFile, "vendor_logo"));

      if (mode === "edit" && id) {
        await vendorApi.update(id, fd);
      } else {
        await vendorApi.create(fd);
      }

      const action = mode === "edit" ? "updated" : "registered";
      router.push(
        `/dashboard/vendor-vehicle?success=${action}&name=${encodeURIComponent(name.trim())}`,
      );
    } catch (err) {
      console.error("Failed to save vendor:", err);
      setIsSubmitting(false);
      toastError("Failed to save vendor. Please try again.");
    }
  };

  const handleReset = () => {
    setName("");
    setOwnerName("");
    setLogoFile(null);
    setInitialLogoUrl(undefined);
    setHasSubmitted(false);
    setErrors({});
  };

  const handleBack = () => {
    router.push("/dashboard/vendor-vehicle");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {mode === "add" ? "Tambah Vendor Vehicle Baru" : "Edit Vendor Vehicle"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mode === "add"
                  ? "Lengkapi form di bawah untuk mendaftarkan vendor vehicle baru"
                  : "Perbarui informasi vendor vehicle"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 text-xl">storefront</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Informasi Vendor</h3>
                <p className="text-xs text-slate-400">Lengkapi identitas vendor vehicle</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Vendor"
                required
                placeholder="Contoh: CV Armada Jaya"
                id="vendor-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (hasSubmitted && errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={hasSubmitted ? errors.name : undefined}
              />
              <Input
                label="Nama Pemilik"
                required
                placeholder="Contoh: Budi Santoso"
                id="vendor-owner"
                value={ownerName}
                onChange={(e) => {
                  setOwnerName(e.target.value);
                  if (hasSubmitted && errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: undefined }));
                }}
                error={hasSubmitted ? errors.ownerName : undefined}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-500 text-xl">image</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Logo Vendor</h3>
                <p className="text-xs text-slate-400">Unggah logo resmi vendor</p>
              </div>
            </div>
            <VendorLogoUpload
              initialLogoUrl={initialLogoUrl}
              onLogoChange={setLogoFile}
              hasSubmitted={hasSubmitted}
              error={hasSubmitted ? errors.logo : undefined}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={handleReset}
              disabled={isSubmitting || mode === "edit"}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm disabled:opacity-50"
            >
              Reset Form
            </button>
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                {isSubmitting ? "hourglass_empty" : "check_circle"}
              </span>
              {isSubmitting ? "Menyimpan..." : mode === "add" ? "Simpan Vendor" : "Update Vendor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVendorForm;
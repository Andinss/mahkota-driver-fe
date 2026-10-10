"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmToast, toastError } from "@/components/ui/toast-provider";
import {
  RekeningForm,
  type RekeningFormErrors,
  type RekeningFormValues,
} from "@/components/rekenings/new/rekening-form";
import { RekeningPreview } from "@/components/rekenings/new/rekening-preview";
import { rekeningApi } from "@/lib/api/rekening";
import type { Rekening } from "@/lib/types/rekening";

interface NewRekeningFormProps {
  id: string | null;
}

const emptyValues: RekeningFormValues = {
  name: "",
  method: "bank",
  provider: "",
  account_number: "",
  account_holder: "",
  image_url: "",
  image_file: null,
  description: "",
  is_active: "1",
};

const NewRekening = ({ id }: NewRekeningFormProps) => {
  const router = useRouter();

  const mode: "add" | "edit" = id ? "edit" : "add";
  const [isLoadingExisting, setIsLoadingExisting] = useState(mode === "edit");
  const [existing, setExisting] = useState<Rekening | null>(null);
  const [values, setValues] = useState<RekeningFormValues>(emptyValues);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState<RekeningFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await rekeningApi.getById(id);
        if (cancelled) return;
        const data = res.data;
        setExisting(data);
        setValues({
          name: data.name,
          method: data.method,
          provider: data.provider ?? "",
          account_number: data.account_number ?? "",
          account_holder: data.account_holder ?? "",
          image_url: data.image_url ?? "",
          image_file: null,
          description: data.description ?? "",
          is_active: data.is_active ? "1" : "0",
        });
      } catch {
        if (!cancelled) setExisting(null);
      } finally {
        if (!cancelled) setIsLoadingExisting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const notFound = mode === "edit" && !isLoadingExisting && !existing;

  const handleClearError = (field: keyof RekeningFormErrors) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const validateForm = (): boolean => {
    const newErrors: RekeningFormErrors = {};
    let isValid = true;

    if (!values.name.trim()) {
      newErrors.name = "Nama metode wajib diisi";
      isValid = false;
    }

    if (values.method === "qris") {
      if (!values.image_url && !values.image_file) {
        newErrors.image_url = "Gambar QRIS wajib diunggah";
        isValid = false;
      }
    } else {
      if (!values.provider) {
        newErrors.provider = values.method === "e_wallet"
          ? "Nama e-wallet wajib dipilih"
          : "Nama bank wajib dipilih";
        isValid = false;
      }
      if (!values.account_number.trim()) {
        newErrors.account_number =
          values.method === "e_wallet"
            ? "Nomor e-wallet wajib diisi"
            : "Nomor rekening wajib diisi";
        isValid = false;
      }
      if (!values.account_holder.trim()) {
        newErrors.account_holder = "Atas nama wajib diisi";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    if (!validateForm()) return;

    const detail =
      values.method === "qris"
        ? "QRIS"
        : `${values.provider} ${values.account_number}`;

    const confirmed = await confirmToast({
      title: mode === "add" ? "Confirm Registration" : "Confirm Update",
      message:
        mode === "add"
          ? `Are you sure you want to add ${values.name} (${detail})?`
          : `Are you sure you want to update ${values.name}?`,
      confirmText: mode === "add" ? "Yes, Add Rekening" : "Yes, Update Rekening",
      cancelText: "Review Again",
      variant: "info",
    });
    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", values.name.trim());
      fd.append("method", values.method);
      fd.append("description", values.description.trim());
      fd.append("is_active", values.is_active === "1" ? "true" : "false");

      if (values.method === "qris") {
        if (values.image_file) {
          // File baru -> backend simpan ke image/method-payment/<slug>/
          fd.append("image", values.image_file);
        } else {
          // Pertahankan gambar lama ("" berarti gambar dihapus)
          fd.append("image_url", values.image_url);
        }
      } else {
        fd.append("provider", values.provider.trim());
        fd.append("account_number", values.account_number.trim());
        fd.append("account_holder", values.account_holder.trim());
        // Buang gambar QRIS lama saat berpindah metode
        fd.append("image_url", "");
      }

      if (mode === "edit" && id) {
        await rekeningApi.update(id, fd);
      } else {
        await rekeningApi.create(fd);
      }

      const action = mode === "edit" ? "updated" : "registered";
      router.push(
        `/dashboard/rekenings?success=${action}&name=${encodeURIComponent(values.name.trim())}`,
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to save rekening. Please try again.";
      toastError(message);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setValues(emptyValues);
    setHasSubmitted(false);
    setErrors({});
  };

  const handleBack = () => {
    router.push("/dashboard/rekenings");
  };

  if (isLoadingExisting) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 animate-spin">
              progress_activity
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Memuat data metode...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">
              search_off
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Data metode tidak ditemukan
            </p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Kembali ke Daftar Metode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">
                arrow_back
              </span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {mode === "add" ? "Tambah Metode Baru" : "Edit Metode"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mode === "add"
                  ? "Pilih metode pembayaran (QRIS, Bank, atau E-Wallet), lalu isi datanya"
                  : `Perbarui informasi ${existing?.code ?? ""}`}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <RekeningPreview
            name={values.name}
            method={values.method}
            provider={values.provider}
            accountNumber={values.account_number}
            accountHolder={values.account_holder}
            imageUrl={values.image_url}
          />

          <RekeningForm
            values={values}
            errors={errors}
            hasSubmitted={hasSubmitted}
            onChange={setValues}
            onClearError={handleClearError}
          />

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
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                {isSubmitting ? "hourglass_empty" : "check_circle"}
              </span>
              {isSubmitting
                ? "Menyimpan..."
                : mode === "add"
                  ? "Simpan Metode"
                  : "Update Metode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRekening;
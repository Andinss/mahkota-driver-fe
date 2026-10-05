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
import { formatRupiah } from "@/lib/utils/format";
import type { Rekening, RekeningInput } from "@/lib/types/rekening";

interface NewRekeningFormProps {
  id: string | null;
}

const emptyValues: RekeningFormValues = {
  name: "",
  bank_name: "",
  account_number: "",
  account_holder: "",
  type: "reguler",
  balance: "",
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
          bank_name: data.bank_name,
          account_number: data.account_number,
          account_holder: data.account_holder,
          type: data.type,
          balance: String(data.balance),
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
      newErrors.name = "Nama rekening wajib diisi";
      isValid = false;
    }
    if (!values.bank_name) {
      newErrors.bank_name = "Nama bank wajib dipilih";
      isValid = false;
    }
    if (!values.account_number.trim()) {
      newErrors.account_number = "Nomor rekening wajib diisi";
      isValid = false;
    }
    if (!values.account_holder.trim()) {
      newErrors.account_holder = "Atas nama wajib diisi";
      isValid = false;
    }
    if (values.balance && Number(values.balance) < 0) {
      newErrors.balance = "Saldo awal tidak boleh negatif";
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
          ? `Are you sure you want to add ${values.name} (${values.bank_name} ${values.account_number})?`
          : `Are you sure you want to update ${values.name}?`,
      confirmText: mode === "add" ? "Yes, Add Rekening" : "Yes, Update Rekening",
      cancelText: "Review Again",
      variant: "info",
    });
    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const payload: RekeningInput = {
        name: values.name.trim(),
        bank_name: values.bank_name,
        account_number: values.account_number.trim(),
        account_holder: values.account_holder.trim(),
        type: values.type,
        balance: Number(values.balance || 0),
        description: values.description.trim(),
        is_active: values.is_active === "1",
      };

      if (mode === "edit" && id) {
        await rekeningApi.update(id, payload);
      } else {
        await rekeningApi.create(payload);
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
              Memuat data rekening...
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
              Data rekening tidak ditemukan
            </p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Kembali ke Daftar Rekening
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
                {mode === "add" ? "Tambah Rekening Baru" : "Edit Rekening"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mode === "add"
                  ? "Lengkapi form di bawah untuk menambahkan rekening bank baru"
                  : `Perbarui informasi rekening ${existing?.code ?? ""}`}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <RekeningPreview
            name={values.name}
            bankName={values.bank_name}
            accountNumber={values.account_number}
            accountHolder={values.account_holder}
            balance={Number(values.balance || 0)}
            type={values.type}
          />

          <RekeningForm
            values={values}
            errors={errors}
            hasSubmitted={hasSubmitted}
            onChange={setValues}
            onClearError={handleClearError}
          />

          {Number(values.balance || 0) > 0 && (
            <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-xl">
                savings
              </span>
              <div>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {formatRupiah(Number(values.balance || 0))}
                </p>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80 mt-0.5">
                  Saldo awal ini akan dipakai sebagai acuan rekonsiliasi mutasi
                  rekening {values.name.trim() || "baru"}.
                </p>
              </div>
            </div>
          )}

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
                  ? "Simpan Rekening"
                  : "Update Rekening"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRekening;
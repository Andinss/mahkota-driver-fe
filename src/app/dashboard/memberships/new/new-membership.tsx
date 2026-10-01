"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmToast, toastError } from "@/components/ui/toast-provider";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "@/components/ui/currency-input";
import { membershipApi } from "@/lib/api/membership";
import { formatRupiah } from "@/lib/utils/format";
import type { Membership } from "@/lib/types/membership";

interface NewMembershipFormProps {
  id: string | null;
}

interface FormErrors {
  name?: string;
  fee?: string;
}

const NewMembership = ({ id }: NewMembershipFormProps) => {
  const router = useRouter();

  const mode: "add" | "edit" = id ? "edit" : "add";
  const [isLoadingExisting, setIsLoadingExisting] = useState(mode === "edit");
  const [existing, setExisting] = useState<Membership | null>(null);
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [isActive, setIsActive] = useState("1");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await membershipApi.getById(id);
        if (cancelled) return;
        const data = res.data;
        setExisting(data);
        setName(data.name);
        setFee(String(data.fee));
        setDescription(data.description ?? "");
        setBenefits((data.benefits ?? []).join("\n"));
        setIsActive(data.is_active ? "1" : "0");
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Nama membership wajib diisi";
      isValid = false;
    }
    if (!fee || Number(fee) <= 0) {
      newErrors.fee = "Fee harus lebih dari 0";
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
          ? `Are you sure you want to add ${name} membership (Fee ${formatRupiah(Number(fee))})?`
          : `Are you sure you want to update ${name} membership?`,
      confirmText: mode === "add" ? "Yes, Add Membership" : "Yes, Update Membership",
      cancelText: "Review Again",
      variant: "info",
    });
    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        fee: Number(fee),
        description: description.trim(),
        benefits: benefits
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        is_active: isActive === "1",
      };

      if (mode === "edit" && id) {
        await membershipApi.update(id, payload);
      } else {
        await membershipApi.create(payload);
      }

      const action = mode === "edit" ? "updated" : "registered";
      router.push(
        `/dashboard/memberships?success=${action}&name=${encodeURIComponent(name.trim())}`,
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to save membership. Please try again.";
      toastError(message);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setFee("");
    setDescription("");
    setBenefits("");
    setIsActive("1");
    setHasSubmitted(false);
    setErrors({});
  };

  const handleBack = () => {
    router.push("/dashboard/memberships");
  };

  if (isLoadingExisting) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 animate-spin">
              progress_activity
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Memuat data membership...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">
              search_off
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Data membership tidak ditemukan
            </p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Kembali ke Daftar Membership
            </button>
          </div>
        </div>
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
                {mode === "add" ? "Tambah Membership Baru" : "Edit Membership"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mode === "add"
                  ? "Lengkapi form di bawah untuk menambahkan tipe membership baru"
                  : "Perbarui informasi tipe membership"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-500 text-xl">
                  card_membership
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Informasi Membership
                </h3>
                <p className="text-xs text-slate-400">
                  Atur nama, fee, dan status tipe membership
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Membership"
                required
                id="membership-name"
                placeholder="Contoh: Premium"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (hasSubmitted && errors.name)
                    setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={hasSubmitted ? errors.name : undefined}
              />

              <CurrencyInput
                label="Fee"
                required
                id="membership-fee"
                placeholder="0"
                value={fee}
                onChange={(value) => {
                  setFee(value);
                  if (hasSubmitted && errors.fee)
                    setErrors((prev) => ({ ...prev, fee: undefined }));
                }}
                error={hasSubmitted ? errors.fee : undefined}
              />
              <Select
                label="Status"
                id="membership-status"
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
              >
                <option value="1">Aktif</option>
                <option value="0">Nonaktif</option>
              </Select>
            </div>

            {fee && Number(fee) > 0 && (
              <div className="mt-4 rounded-xl border border-purple-100 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/10 p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-xl">
                  workspace_premium
                </span>
                <div>
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                    {formatRupiah(Number(fee))}
                  </p>
                  <p className="text-xs text-purple-600/80 dark:text-purple-300/80 mt-0.5">
                    Fee ini akan dipakai untuk tipe membership {name.trim() || "baru"}.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 text-xl">info</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Deskripsi & Benefit
                </h3>
                <p className="text-xs text-slate-400">
                  Penjelasan singkat dan daftar benefit membership
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Textarea
                label="Deskripsi"
                id="membership-description"
                rows={3}
                placeholder="Jelaskan singkatan paket membership ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Textarea
                label="Benefit"
                id="membership-benefits"
                rows={5}
                placeholder={
                  "Satu benefit per baris, contoh:\nPrioritas booking kendaraan\nDiskon 20% sewa bulanan"
                }
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
              />
              <p className="text-xs text-[#617589] dark:text-slate-400 italic">
                Tulis satu benefit per baris.
              </p>
            </div>
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
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                {isSubmitting ? "hourglass_empty" : "check_circle"}
              </span>
              {isSubmitting
                ? "Menyimpan..."
                : mode === "add"
                  ? "Simpan Membership"
                  : "Update Membership"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMembership;

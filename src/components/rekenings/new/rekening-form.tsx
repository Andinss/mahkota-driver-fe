"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { QrisUpload } from "./qris-upload";
import { bankOptions, eWalletOptions } from "@/lib/data/rekening";
import { METHOD_LABELS, type RekeningMethod } from "@/lib/types/rekening";

export interface RekeningFormValues {
  name: string;
  method: RekeningMethod;
  provider: string;
  account_number: string;
  account_holder: string;
  /** Preview gambar: path backend (`image/...`) atau `blob:` untuk file baru. */
  image_url: string;
  /** File QRIS yang belum diunggah. */
  image_file: File | null;
  description: string;
  is_active: string;
}

export interface RekeningFormErrors {
  name?: string;
  method?: string;
  provider?: string;
  account_number?: string;
  account_holder?: string;
  image_url?: string;
}

interface RekeningFormProps {
  values: RekeningFormValues;
  errors: RekeningFormErrors;
  hasSubmitted: boolean;
  onChange: (values: RekeningFormValues) => void;
  onClearError: (field: keyof RekeningFormErrors) => void;
}

export const RekeningForm = ({
  values,
  errors,
  hasSubmitted,
  onChange,
  onClearError,
}: RekeningFormProps) => {
  const showError = (field: keyof RekeningFormErrors) =>
    hasSubmitted ? errors[field] : undefined;

  const isQris = values.method === "qris";
  const isEwallet = values.method === "e_wallet";

  const handleMethod = (method: RekeningMethod) => {
    onChange({
      ...values,
      method,
      provider: "",
      account_number: "",
      account_holder: "",
      image_url: "",
      image_file: null,
    });
    onClearError("method");
    onClearError("provider");
    onClearError("account_number");
    onClearError("account_holder");
    onClearError("image_url");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-500 text-xl">
              account_balance_wallet
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Data Metode Pembayaran
            </h3>
            <p className="text-xs text-slate-400">
              Pilih metode, lalu isi data sesuai dengan pilihan tersebut
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Metode"
            required
            id="rekening-name"
            placeholder="Contoh: Rekening Operasional Utama"
            value={values.name}
            onChange={(e) => {
              onChange({ ...values, name: e.target.value });
              onClearError("name");
            }}
            error={showError("name")}
          />

          <Select
            label="Metode"
            required
            id="rekening-method"
            value={values.method}
            onChange={(e) => handleMethod(e.target.value as RekeningMethod)}
            error={showError("method")}
          >
            <option value="qris">{METHOD_LABELS.qris}</option>
            <option value="bank">{METHOD_LABELS.bank}</option>
            <option value="e_wallet">{METHOD_LABELS.e_wallet}</option>
          </Select>
        </div>

        {/* ==== Field menyesuaikan metode terpilih ==== */}
        {isQris ? (
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Gambar QRIS <span className="text-red-500">*</span>
            </label>
            <QrisUpload
              value={values.image_url || null}
              file={values.image_file}
              onChange={(next) => {
                onChange({
                  ...values,
                  image_url: next.value ?? "",
                  image_file: next.file,
                });
                onClearError("image_url");
              }}
              error={showError("image_url")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Select
              label={isEwallet ? "Nama E-Wallet" : "Nama Bank"}
              required
              id="rekening-provider"
              value={values.provider}
              onChange={(e) => {
                onChange({ ...values, provider: e.target.value });
                onClearError("provider");
              }}
              error={showError("provider")}
            >
              <option value="">
                {isEwallet ? "Pilih e-wallet" : "Pilih bank"}
              </option>
              {(isEwallet ? eWalletOptions : bankOptions).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <Input
              label={isEwallet ? "Nomor E-Wallet" : "Nomor Rekening"}
              required
              id="rekening-account-number"
              inputMode={isEwallet ? "tel" : "numeric"}
              placeholder={
                isEwallet ? "Contoh: 081234567890" : "Contoh: 1234567890"
              }
              value={values.account_number}
              onChange={(e) => {
                onChange({
                  ...values,
                  account_number: e.target.value.replace(/\D/g, ""),
                });
                onClearError("account_number");
              }}
              error={showError("account_number")}
            />

            <Input
              label="Atas Nama"
              required
              id="rekening-account-holder"
              placeholder="Contoh: PT Mahkota Drive"
              value={values.account_holder}
              onChange={(e) => {
                onChange({ ...values, account_holder: e.target.value });
                onClearError("account_holder");
              }}
              error={showError("account_holder")}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Select
            label="Status"
            id="rekening-status"
            value={values.is_active}
            onChange={(e) => onChange({ ...values, is_active: e.target.value })}
          >
            <option value="1">Aktif</option>
            <option value="0">Nonaktif</option>
          </Select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">
              notes
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Catatan Metode
            </h3>
            <p className="text-xs text-slate-400">
              Penjelasan singkat penggunaan metode ini
            </p>
          </div>
        </div>

        <Textarea
          label="Deskripsi"
          id="rekening-description"
          rows={4}
          placeholder="Contoh: Rekening utama untuk menerima pembayaran sewa harian dan bulanan."
          value={values.description}
          onChange={(e) =>
            onChange({ ...values, description: e.target.value })
          }
        />
      </div>
    </div>
  );
};

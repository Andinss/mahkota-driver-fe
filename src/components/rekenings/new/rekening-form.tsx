"use client";

import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { bankOptions } from "@/lib/data/rekening";
import type { RekeningType } from "@/lib/types/rekening";

export interface RekeningFormValues {
  name: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  type: RekeningType;
  balance: string;
  description: string;
  is_active: string;
}

export interface RekeningFormErrors {
  name?: string;
  bank_name?: string;
  account_number?: string;
  account_holder?: string;
  balance?: string;
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

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-500 text-xl">
              account_balance
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Data Rekening
            </h3>
            <p className="text-xs text-slate-400">
              Informasi bank yang dipakai untuk menerima pembayaran
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Rekening"
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
            label="Nama Bank"
            required
            id="rekening-bank"
            value={values.bank_name}
            onChange={(e) => {
              onChange({ ...values, bank_name: e.target.value });
              onClearError("bank_name");
            }}
            error={showError("bank_name")}
          >
            <option value="">Pilih bank</option>
            {bankOptions.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </Select>

          <Input
            label="Nomor Rekening"
            required
            id="rekening-account-number"
            inputMode="numeric"
            placeholder="Contoh: 1234567890"
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

          <Select
            label="Tipe Rekening"
            id="rekening-type"
            value={values.type}
            onChange={(e) =>
              onChange({ ...values, type: e.target.value as RekeningType })
            }
          >
            <option value="utama">Rekening Utama</option>
            <option value="reguler">Reguler</option>
          </Select>

          <Select
            label="Status"
            id="rekening-status"
            value={values.is_active}
            onChange={(e) => onChange({ ...values, is_active: e.target.value })}
          >
            <option value="1">Aktif</option>
            <option value="0">Nonaktif</option>
          </Select>

          <CurrencyInput
            label="Saldo Awal"
            id="rekening-balance"
            placeholder="0"
            value={values.balance}
            onChange={(value) => {
              onChange({ ...values, balance: value });
              onClearError("balance");
            }}
            error={showError("balance")}
          />
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
              Catatan Rekening
            </h3>
            <p className="text-xs text-slate-400">
              Penjelasan singkat penggunaan rekening ini
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
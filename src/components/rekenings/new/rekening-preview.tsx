import { formatRupiah } from "@/lib/utils/format";
import type { RekeningType } from "@/lib/types/rekening";

interface RekeningPreviewProps {
  name: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  type: RekeningType;
}

export const RekeningPreview = ({
  name,
  bankName,
  accountNumber,
  accountHolder,
  balance,
  type,
}: RekeningPreviewProps) => {
  const isUtama = type === "utama";

  return (
    <div
      className={`rounded-2xl border p-6 ${
        isUtama
          ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/50"
          : "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            isUtama
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          }`}
        >
          <span className="material-symbols-outlined text-2xl">
            account_balance
          </span>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {name.trim() || "Nama rekening baru"}
            </h3>
            <span
              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                isUtama
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {isUtama ? "Rekening Utama" : "Reguler"}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {bankName || "Pilih nama bank"}
          </p>
          <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
            {accountNumber || "0000000000"}
          </p>
        </div>
        <div className="sm:ml-auto text-right shrink-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Saldo Awal
          </p>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {formatRupiah(Number(balance) || 0)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
            {accountHolder.trim() || "Atas nama holders"}
          </p>
        </div>
      </div>
    </div>
  );
};
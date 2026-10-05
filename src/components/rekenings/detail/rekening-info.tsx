import { formatDateOnly, formatRupiah } from "@/lib/utils/format";
import { RekeningStatusBadge, RekeningTypeBadge } from "@/components/rekenings/rekening-badges";
import type { Rekening } from "@/lib/types/rekening";

interface RekeningInfoProps {
  rekening: Rekening;
}

export const RekeningInfo = ({ rekening }: RekeningInfoProps) => {
  const rows = [
    { label: "Kode Rekening", value: rekening.code },
    { label: "Nama Rekening", value: rekening.name },
    { label: "Nama Bank", value: rekening.bank_name },
    {
      label: "Nomor Rekening",
      value: rekening.account_number,
      mono: true,
    },
    { label: "Atas Nama", value: rekening.account_holder },
    {
      label: "Saldo",
      value: formatRupiah(rekening.balance),
      valueClassName: "font-bold text-emerald-600 dark:text-emerald-400",
    },
    { label: "Tanggal Dibuat", value: formatDateOnly(rekening.created_at) },
    {
      label: "Terakhir Diperbarui",
      value: formatDateOnly(rekening.updated_at),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-emerald-500 text-xl">
            info
          </span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Informasi Rekening
          </h3>
          <p className="text-xs text-slate-400">Ringkasan data rekening bank</p>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-6 py-4 gap-4"
          >
            <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
            <span
              className={`text-right ${
                row.mono ? "font-mono font-bold" : "font-semibold"
              } text-slate-900 dark:text-white ${row.valueClassName ?? ""}`}
            >
              {row.value}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between px-6 py-4 gap-4">
          <span className="text-slate-500 dark:text-slate-400">Tipe</span>
          <RekeningTypeBadge type={rekening.type} />
        </div>
        <div className="flex items-center justify-between px-6 py-4 gap-4">
          <span className="text-slate-500 dark:text-slate-400">Status</span>
          <RekeningStatusBadge isActive={rekening.is_active} />
        </div>
      </div>
    </div>
  );
};
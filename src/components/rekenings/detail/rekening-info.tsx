import { formatDateOnly } from "@/lib/utils/format";
import {
  RekeningMethodBadge,
  RekeningStatusBadge,
  methodMeta,
} from "@/components/rekenings/rekening-badges";
import { METHOD_LABELS } from "@/lib/types/rekening";
import type { Rekening } from "@/lib/types/rekening";
import { resolveImageUrl } from "@/lib/utils/image";

interface RekeningInfoProps {
  rekening: Rekening;
}

export const RekeningInfo = ({ rekening }: RekeningInfoProps) => {
  const isQris = rekening.method === "qris";
  const { label: providerLabel } = methodMeta(rekening.method);

  const baseRows = [
    { label: "Kode Rekening", value: rekening.code, mono: false },
    { label: "Nama Rekening", value: rekening.name, mono: false },
    {
      label: "Metode",
      value: METHOD_LABELS[rekening.method],
      mono: false,
    },
  ];

  const methodRows = isQris
    ? []
    : [
        { label: providerLabel, value: rekening.provider || "-", mono: false },
        {
          label: rekening.method === "bank" ? "Nomor Rekening" : "Nomor E-Wallet",
          value: rekening.account_number || "-",
          mono: true,
        },
        { label: "Atas Nama", value: rekening.account_holder || "-", mono: false },
      ];

  const tailRows = [
    { label: "Tanggal Dibuat", value: formatDateOnly(rekening.created_at), mono: false },
    {
      label: "Terakhir Diperbarui",
      value: formatDateOnly(rekening.updated_at),
      mono: false,
    },
  ];

  const rows = [...baseRows, ...methodRows, ...tailRows];

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
          <p className="text-xs text-slate-400">
            Ringkasan data metode pembayaran
          </p>
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
              } text-slate-900 dark:text-white`}
            >
              {row.value}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between px-6 py-4 gap-4">
          <span className="text-slate-500 dark:text-slate-400">Metode</span>
          <RekeningMethodBadge method={rekening.method} />
        </div>
        <div className="flex items-center justify-between px-6 py-4 gap-4">
          <span className="text-slate-500 dark:text-slate-400">Status</span>
          <RekeningStatusBadge isActive={rekening.is_active} />
        </div>
      </div>

      {isQris && rekening.image_url && (
        <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-4">
          <div className="w-28 h-28 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-1.5 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImageUrl(rekening.image_url) ?? undefined}
              alt={`Gambar QRIS ${rekening.name}`}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Gambar QRIS
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Gambar ini ditampilkan kepada pelanggan / driver sebagai tujuan
              pemindaian pembayaran.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
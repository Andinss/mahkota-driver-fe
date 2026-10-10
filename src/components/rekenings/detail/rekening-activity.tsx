import { formatDateOnly } from "@/lib/utils/format";
import { methodMeta } from "@/components/rekenings/rekening-badges";
import { METHOD_LABELS } from "@/lib/types/rekening";
import type { Rekening } from "@/lib/types/rekening";

interface ActivityLog {
  icon: string;
  color: string;
  bg: string;
  title: string;
  date: string;
  description: string;
}

interface RekeningActivityProps {
  rekening: Rekening;
}

export const RekeningActivity = ({ rekening }: RekeningActivityProps) => {
  const isQris = rekening.method === "qris";
  const { icon, label } = methodMeta(rekening.method);

  const activityLogs: ActivityLog[] = [
    {
      icon,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      title: "Rekening ditambahkan",
      date: formatDateOnly(rekening.created_at),
      description: isQris
        ? `Metode pembayaran ${METHOD_LABELS[rekening.method]} (${rekening.name}) didaftarkan.`
        : `Metode ${METHOD_LABELS[rekening.method]} ${rekening.provider} dengan nomor ${rekening.account_number} didaftarkan.`,
    },
    isQris
      ? {
          icon: "image",
          color: "text-blue-500",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          title: rekening.image_url
            ? "Gambar QRIS terunggah"
            : "Gambar QRIS belum diunggah",
          date: formatDateOnly(rekening.updated_at),
          description: rekening.image_url
            ? "Gambar QR siap dipakai untuk menerima pemindaian pembayaran."
            : "Unggah gambar QRIS agar metode ini bisa digunakan.",
        }
      : {
          icon: "badge",
          color: "text-blue-500",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          title: `Terdaftar atas nama ${rekening.account_holder || "-"}`,
          date: formatDateOnly(rekening.updated_at),
          description: `${label} ini menjadi tujuan penerimaan pembayaran pada sistem.`,
        },
    {
      icon: "edit",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      title: "Terakhir diperbarui",
      date: formatDateOnly(rekening.updated_at),
      description: "Perubahan data rekening terakhir disimpan oleh admin keuangan.",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">
            history
          </span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Riwayat Rekening
          </h3>
          <p className="text-xs text-slate-400">Aktivitas terakhir rekening</p>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {activityLogs.map((log) => (
          <div key={log.title} className="flex items-start gap-4 px-6 py-4">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${log.bg}`}
            >
              <span className={`material-symbols-outlined text-lg ${log.color}`}>
                {log.icon}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {log.title}
                </p>
                <span className="text-xs text-slate-400">{log.date}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {log.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
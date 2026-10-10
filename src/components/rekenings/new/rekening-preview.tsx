import { methodMeta } from "@/components/rekenings/rekening-badges";
import { METHOD_LABELS, type RekeningMethod } from "@/lib/types/rekening";
import { resolveImageUrl } from "@/lib/utils/image";

interface RekeningPreviewProps {
  name: string;
  method: RekeningMethod;
  provider: string;
  accountNumber: string;
  accountHolder: string;
  imageUrl: string;
}

export const RekeningPreview = ({
  name,
  method,
  provider,
  accountNumber,
  accountHolder,
  imageUrl,
}: RekeningPreviewProps) => {
  const isQris = method === "qris";
  const { icon, label } = methodMeta(method);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 overflow-hidden">
          {isQris && imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveImageUrl(imageUrl) ?? undefined}
              alt="Pratinjau QRIS"
              className="w-full h-full object-contain bg-white p-1"
            />
          ) : (
            <span className="material-symbols-outlined text-2xl">{icon}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white truncate">
              {name.trim() || "Nama metode baru"}
            </h3>
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
              {label}
            </span>
          </div>

          {isQris ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {imageUrl
                ? "Gambar QRIS siap digunakan untuk dipindai."
                : "Belum ada gambar QRIS yang diunggah."}
            </p>
          ) : (
            <>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {provider || `Pilih ${METHOD_LABELS[method] === "E-Wallet" ? "e-wallet" : "bank"}`}
              </p>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                {accountNumber || "0000000000"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {accountHolder.trim() || "Atas nama"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

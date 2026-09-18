import { Card } from "@/components/ui/card";

interface DriverSupportCardProps {
  hotline?: string;
  email?: string;
}

export function DriverSupportCard({
  hotline = "+62 811-9876-0000",
  email = "dispatch@mahkotafleet.id",
}: DriverSupportCardProps) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Pusat Siaga 24/7
          </span>
          <span className="material-symbols-outlined text-primary text-[24px]">
            support_agent
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Panduan Cepat &amp; Hotline Mitra
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Butuh panduan pengajuan izin darurat, konfirmasi OR saat lakalantas,
            atau kendala aktivasi armada? Tim dispatch kami siap membantu Anda.
          </p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Hotline WhatsApp Fleet:
            </span>
            <span className="text-sm font-bold text-primary">{hotline}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Email Dispatch Operasional:
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {email}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Hubungi Dispatch</span>
          </button>
          <button
            className="h-10 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            title="Download Panduan PDF"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
        </div>
      </div>
    </Card>
  );
}

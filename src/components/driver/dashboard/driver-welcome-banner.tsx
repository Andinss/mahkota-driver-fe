import { Card } from "@/components/ui/card";

interface DriverWelcomeBannerProps {
  memberName?: string;
  sessionId?: string;
}

export function DriverWelcomeBanner({
  memberName = "Mahkota Fleet Member",
  sessionId = "#MF-9941",
}: DriverWelcomeBannerProps) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-2xl pointer-events-none" />
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
 Portal Resmi Mitra &amp; Driver
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-sm">•</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm">
              ID Sesi: {sessionId}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Selamat Datang Kembali,{" "}
            <span className="text-primary font-bold">{memberName}!</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Solusi Armada, Tepercaya &amp; Profesional — Monitoring komprehensif
            izin perjalanan, klaim perbaikan, dan administrasi armada Anda.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors shadow-sm"
            href="#riwayat-layanan"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Log Transaksi</span>
          </a>
          <button
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            <span>Bantuan Darurat 24 Jam</span>
          </button>
        </div>
      </div>
    </Card>
  );
}

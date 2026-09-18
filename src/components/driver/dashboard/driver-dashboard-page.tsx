import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/card";
import { DriverWelcomeBanner } from "./driver-welcome-banner";
import { DriverQuickActions } from "./driver-quick-actions";
import { DriverActivityFeed } from "./driver-activity-feed";
import { DriverSupportCard } from "./driver-support-card";

export function DriverDashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* Welcome Banner */}
        <DriverWelcomeBanner />

        {/* Stats Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Saldo Koin Utama"
            value="104.000"
            subtitle="Koin"
            icon="toll"
            iconColor="text-primary"
            trend={{
              value: "Setara Rp 104.000,-",
              direction: "neutral",
              color: "text-slate-400",
            }}
          />
          <StatCard
            title="Status Keanggotaan"
            value="Aktif"
            subtitle="Member Internal"
            icon="account_circle"
            iconColor="text-emerald-500"
            trend={{
              value: "Prioritas Internal",
              direction: "up",
              color: "text-emerald-500",
            }}
          />
          <StatCard
            title="Unit Operasional"
            value="Kosong"
            subtitle="Status Armada"
            icon="directions_car"
            iconColor="text-slate-400"
            trend={{
              value: "Belum ada unit terdaftar",
              direction: "neutral",
              color: "text-slate-400",
            }}
          />
        </section>

        {/* Quick Actions / Menu Layanan */}
        <DriverQuickActions />

        {/* Bottom Section: Activity Feed + Support */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <DriverActivityFeed />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <DriverSupportCard />
            {/* Documentation Card */}
            <Card className="p-4 flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700">
                <img
                  alt="Mahkota Fleet Member Portal Reference"
                  className="w-full h-full object-cover object-top"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB972dDi0xq4WGYMLPW8MWZxsGOHeBMJRXQZFvrk_Ju0IL4u3YO5AR1xXDUpzFEnDFVA6HF9n0F9r8qsL-juuFjmhZKGL3-gjkcdrb6241tDnDZ7uUTEBOwPinVpz_WhIFpSlE8IOxCkMIMM4PsZJTX9Ev7uyIhkK4gtm-pbGdV2ygk4V58xHvBE3Nse--5oR0PFNeGMdyiidCkbSHkWXSdfAe2TlQg4OJ055haP1RxpXvsdVQKCTLowYm57hwic8ym1A"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Standar Operasional Prosedur
                </span>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                  Buku Saku Mitra Driver v2.4
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pelajari regulasi batas klaim OR &amp; sanksi ETLE.
                </p>
                <a
                  className="text-primary hover:underline text-xs inline-flex items-center gap-1 pt-0.5 font-medium"
                  href="#"
                >
                  Unduh Dokumen Panduan (PDF)
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

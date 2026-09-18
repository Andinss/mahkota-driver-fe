import { Card } from "@/components/ui/card";

interface UpcomingDue {
  title: string;
  date: string;
  amount: string;
  status: string;
  statusColor: string;
}

interface DriverPaymentSidebarProps {
  upcomingDues?: UpcomingDue[];
}

const defaultUpcomingDues: UpcomingDue[] = [
  {
    title: "Sewa Unit Besok",
    date: "11 Okt, Maks 18:00 WIB",
    amount: "Rp 450.000",
    status: "Belum Bayar",
    statusColor: "text-red-500",
  },
  {
    title: "Sewa Unit Lusa",
    date: "12 Okt, Maks 18:00 WIB",
    amount: "Rp 450.000",
    status: "Terjadwal",
    statusColor: "text-slate-400",
  },
  {
    title: "Sewa Unit Minggu",
    date: "13 Okt, Maks 18:00 WIB",
    amount: "Rp 450.000",
    status: "Terjadwal",
    statusColor: "text-slate-400",
  },
];

export function DriverPaymentQuick({
  upcomingDues = defaultUpcomingDues,
}: DriverPaymentSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Jadwal Setor + Unit Aktif - 50:50 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Dues */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                calendar_clock
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Jadwal Setor Mendatang
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Oktober 2024
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {upcomingDues.map((due, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {due.title}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {due.date}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                    {due.amount}
                  </span>
                  <span className={`text-xs font-medium ${due.statusColor}`}>
                    {due.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="w-full h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">
              payments
            </span>
            <span>Bayar Sekaligus 3 Hari (Diskon 2%)</span>
          </button>
        </Card>

        {/* Active Unit Card */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Unit Aktif Dalam Masa Sewa
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              Aktif Beroperasi
            </span>
          </div>
          <div className="relative h-40 w-full rounded-lg overflow-hidden group">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Toyota Avanza"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnX9mPrEAB1kl8FI8SMTKZBgdH_m_AMgC20yIHWuOv3_VFx0-HUa0zmI7oWJ8Jft8DIO4VHXiDQZm5RFDOJ9h3BkR-whwJqih1njIpsOvZ7ZZQXysjEMUp0k5RAuVf016cpO0ElVBFMbYIDX_5krHZWXVJOAa8bw3vRNa9El2fHTICP6oR7ltZErDvC6u1bn_sFC8K4ePno3ypm61BiBSYYt18EgOxQKpT38-qscNP38EmtxENI-Bv"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <div className="flex flex-col text-white">
                <span className="font-bold tracking-tight">
                  Toyota New Avanza 1.3 E M/T
                </span>
                <span className="font-mono text-sm opacity-90">
                  Plat: B 1234 XYZ • ODO: 42.180 KM
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Paket Sewa
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                Harian Reguler
              </span>
            </div>
            <div className="flex flex-col p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Batas Wilayah
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                Jabodetabek
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Finance Hotline */}
      <div className="rounded-xl p-5 bg-gradient-to-br from-primary to-primary/80 text-white flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[22px]">
              support_agent
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white/25 text-xs font-semibold text-white">
            {"Respon < 10 Menit"}
          </span>
        </div>
        <div className="flex flex-col">
          <h4 className="text-base font-bold leading-snug">
            Kendala Pembayaran atau Butuh Rekonsiliasi?
          </h4>
          <p className="text-sm text-white/80 mt-1">
            Hubungi Tim Finance Mahkota Fleet khusus penanganan transfer salah
            nominal, konfirmasi koin, dan klaim deposit.
          </p>
        </div>
        <a
          className="h-10 px-4 rounded-lg bg-white text-primary hover:bg-slate-100 transition-colors text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
          href="https://wa.me/6281198760000"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span>WhatsApp Finance: 0811-9876-0000</span>
        </a>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";

interface ActivityItem {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  statusBg: string;
  time: string;
}

interface DriverActivityFeedProps {
  activities?: ActivityItem[];
}

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    icon: "payments",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    title: "Top Up Koin Berhasil",
    description: "+100.000 Koin melalui Virtual Account Mandiri",
    status: "Sukses",
    statusColor: "text-emerald-600 dark:text-emerald-400",
    statusBg: "bg-slate-100 dark:bg-slate-800",
    time: "Hari ini, 09:42",
  },
  {
    id: "2",
    icon: "verified",
    iconColor: "text-primary",
    iconBg: "bg-primary/10 dark:bg-primary/20",
    title: "Verifikasi ID Driver Diterima",
    description: "ID #88204 berstatus Aktif Prioritas Internal",
    status: "Terverifikasi",
    statusColor: "text-primary",
    statusBg: "bg-slate-100 dark:bg-slate-800",
    time: "Kemarin, 14:15",
  },
  {
    id: "3",
    icon: "gavel",
    iconColor: "text-slate-500",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    title: "Pemeriksaan ETLE Rutin",
    description: "Tidak ditemukan rekam pelanggaran kamera regional",
    status: "Nir-Pelanggaran",
    statusColor: "text-slate-500 dark:text-slate-400",
    statusBg: "bg-slate-100 dark:bg-slate-800",
    time: "08 Sep 2026",
  },
  {
    id: "4",
    icon: "assignment_turned_in",
    iconColor: "text-primary",
    iconBg: "bg-primary/10 dark:bg-primary/20",
    title: "Sinkronisasi Dokumen Operasional",
    description: "Ketentuan kemitraan Mahkota Fleet terbaharui",
    status: "Selesai",
    statusColor: "text-slate-500 dark:text-slate-400",
    statusBg: "bg-slate-100 dark:bg-slate-800",
    time: "05 Sep 2026",
  },
];

export function DriverActivityFeed({ activities = defaultActivities }: DriverActivityFeedProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Riwayat Aktivitas &amp; Notifikasi Terbaru
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Aktivitas akun dan respon sistem operasional terkini.
          </p>
        </div>
        <button
          className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
          type="button"
        >
          Lihat Semua
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </button>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${activity.iconBg} ${activity.iconColor} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-[20px]">{activity.icon}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {activity.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {activity.description}
                </div>
              </div>
            </div>
            <div className="text-right ml-4">
              <span className={`inline-block px-2 py-0.5 rounded-full ${activity.statusBg} ${activity.statusColor} text-xs font-semibold mb-1`}>
                {activity.status}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">security</span>
          <span className="text-xs">Sistem terenkripsi SSL 256-bit Mahkota Security Core</span>
        </div>
        <span className="text-xs">Versi Aplikasi: v4.8.2</span>
      </div>
    </Card>
  );
}

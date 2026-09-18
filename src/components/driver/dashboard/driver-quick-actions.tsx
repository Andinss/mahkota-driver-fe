import { Card } from "@/components/ui/card";

interface QuickActionItem {
  icon: string;
  title: string;
  description: string;
  variant: "primary" | "amber" | "indigo" | "slate";
  href?: string;
  onClick?: () => void;
}

interface DriverQuickActionsProps {
  actions?: QuickActionItem[];
}

const defaultActions: QuickActionItem[] = [
  {
    icon: "map",
    title: "Izin Luar Kota",
    description: "Ajukan izin perjalanan armada",
    variant: "primary",
  },
  {
    icon: "verified_user",
    title: "Own Risk (OR) Claim",
    description: "Klaim perbaikan asuransi",
    variant: "amber",
  },
  {
    icon: "sync_alt",
    title: "Re-Joint Armada",
    description: "Aktivasi kembali unit armada",
    variant: "indigo",
  },
  {
    icon: "photo_camera",
    title: "ETLE & Pelanggaran",
    description: "Cek tilang elektronik",
    variant: "slate",
  },
];

const variantStyles: Record<string, string> = {
  primary: "bg-primary/10 dark:bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white",
  amber: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
  indigo: "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white",
  slate: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-slate-600 group-hover:text-white",
};

export function DriverQuickActions({ actions = defaultActions }: DriverQuickActionsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Menu Layanan Mitra
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Akses cepat pengelolaan kepatuhan berkendara dan administrasi unit.
          </p>
        </div>
        <span className="hidden sm:inline-flex text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {actions.length} Layanan Terintegrasi
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group text-left"
          >
            <div className={`size-10 rounded-lg ${variantStyles[action.variant]} flex items-center justify-center shrink-0 transition-colors`}>
              <span className="material-symbols-outlined">{action.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 dark:text-white font-medium text-sm">
                {action.title}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

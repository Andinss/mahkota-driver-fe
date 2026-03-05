import { Button } from "@/components/ui/button";

export interface DriverHeaderData {
  name: string;
  imageUrl: string;
  employeeId: string;
  totalTrips: number;
  joinedDate: string;
  status: "Active" | "On Leave" | "Inactive";
}

interface DriverHeaderProps {
  driver: DriverHeaderData;
}

export function DriverHeader({ driver }: DriverHeaderProps) {
  const statusColors = {
    Active: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "On Leave": "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Inactive: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
  };

  const statusDotColors = {
    Active: "bg-emerald-500",
    "On Leave": "bg-amber-500",
    Inactive: "bg-slate-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img
            alt={driver.name}
            className="w-32 h-32 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-800"
            src={driver.imageUrl}
          />
          <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-lg border-4 border-white dark:border-slate-900">
            <span className="material-symbols-outlined text-sm block">
              verified
            </span>
          </span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {driver.name}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit mx-auto md:mx-0 ${statusColors[driver.status]}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusDotColors[driver.status]}`}
              ></span>
              {driver.status}
            </span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-lg text-slate-400">
                badge
              </span>
              {driver.employeeId}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-lg text-slate-400">
                route
              </span>
              {driver.totalTrips} Total Trips
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-lg text-slate-400">
                calendar_today
              </span>
              {driver.joinedDate}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined">edit</span>
          </button>
          <Button variant="primary">Assign New Vehicle</Button>
        </div>
      </div>
    </div>
  );
}

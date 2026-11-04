import type { ReactNode } from "react";

export interface DriverHeaderData {
  name: string;
  imageUrl: string;
  employeeId: string;
  membershipName: string | null;
  joinedDate: string;
  status: "Active" | "On Leave" | "Inactive";
}

interface DriverHeaderProps {
  driver: DriverHeaderData;
  children?: ReactNode;
}

export function DriverHeader({ driver, children }: DriverHeaderProps) {
  const statusColors = {
    Active:
      "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "On Leave":
      "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Inactive:
      "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
  };

  const statusDotColors = {
    Active: "bg-emerald-500",
    "On Leave": "bg-amber-500",
    Inactive: "bg-slate-400",
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex items-center ${children ? "xl:col-span-2" : "xl:col-span-3"}`}
      >
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-start gap-6 md:gap-8 w-full">
          {/* Avatar */}
          <div className="relative shrink-0">
            {driver.imageUrl ? (
              <img
                alt={driver.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-800 shadow-md"
                src={driver.imageUrl}
              />
            ) : (
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl ring-4 ring-slate-50 dark:ring-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-5xl text-slate-400">
                  person
                </span>
              </div>
            )}
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg border-4 border-white dark:border-slate-900 shadow-sm">
              <span className="material-symbols-outlined text-base block">
                verified
              </span>
            </span>
          </div>

          {/* Info Driver */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {driver.name}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${statusColors[driver.status]}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusDotColors[driver.status]}`}
                ></span>
                {driver.status}
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-lg text-blue-500">
                  badge
                </span>
                {driver.employeeId}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-lg text-amber-500">
                  workspace_premium
                </span>
                {driver.membershipName || "Tanpa Membership"}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-lg text-violet-500">
                  calendar_today
                </span>
                {driver.joinedDate}
              </span>
            </div>
          </div>
        </div>
      </div>
      {children && <div className="xl:col-span-1">{children}</div>}
    </div>
  );
}

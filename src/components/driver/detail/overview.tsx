import { IconButton } from "@/components/ui/icon-button";

export interface DriverOverviewProps {
  name?: string;
  employeeId?: string;
  totalTrips?: number;
  joinedDate?: string;
  status?: string;
}

export function DriverOverview(_props: DriverOverviewProps) {
  const rentalHistory = [
    {
      date: "May 24, 2024",
      vehicle: "Toyota Camry (B 1234 ABC)",
      vehicleIcon: "local_taxi",
      route: "Jakarta → Bandung",
      earnings: "$120.00",
    },
    {
      date: "May 22, 2024",
      vehicle: "Hiace Luxury (B 7788 XYZ)",
      vehicleIcon: "airport_shuttle",
      route: "Airport Transfer",
      earnings: "$85.00",
    },
  ];

  const documents = [
    {
      name: "Driver License",
      type: "PDF",
      size: "2.4 MB",
      icon: "description",
      iconColor: "text-red-500",
    },
    {
      name: "Health Certificate",
      type: "PDF",
      size: "1.1 MB",
      icon: "description",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - 2/3 width */}
      <div className="lg:col-span-2 space-y-8">
        {/* Personal Information & Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                account_circle
              </span>
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Date of Birth</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  May 14, 1988
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Gender</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Male
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Identity ID</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  3204910405880003
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">License Class</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-bold uppercase">
                  Class A
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                contact_mail
              </span>
              Contact Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-500 text-[20px]">
                    call
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    +62 812-3456-7890
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-500 text-[20px]">
                    mail
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    marcus.wright@email.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-500 text-[20px]">
                    location_on
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Home Address
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Jl. Merdeka No. 42, Jakarta Pusat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rental Transaction History */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                history
              </span>
              Rental Transaction History
            </h3>
            <button className="text-sm font-bold text-primary hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rentalHistory.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      {item.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">
                            {item.vehicleIcon}
                          </span>
                        </div>
                        <span className="text-sm">{item.vehicle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {item.route}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {item.earnings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column - 1/3 width */}
      <div className="space-y-8">
        {/* Assigned Vehicle */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              car_repair
            </span>
            Assigned Vehicle
          </h3>
          <div className="relative rounded-xl overflow-hidden mb-4 aspect-video bg-slate-100 dark:bg-slate-800">
            <img
              alt="Assigned Vehicle"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc9FSWkfM3spshnei9tUEoPe6HLeukSzhvhA3FzIwqC0QcA4IWzHDDWfgHeC1Dd7LEQmKfC71RVrq6iE8St-GS4AlQwE_oMR3WJW7xRC4yA8dJU7Ie1zbRZN57Yw-tpHj5VfROLu1GveQ0X2_YKGfFSjPCxupwGPeQZMCwlCIvxjC-yjlJ-OyM6_QSbkU5XWMU_n_Zte-2FDrlZsCiCOq_TRMdcjW0M5lxfhZM2AZCKWQ6O4lnsfGe4FGuubSdQLhfPVp_aTHyn9U"
            />
            <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded text-[10px] font-bold shadow-sm">
              B 1234 ABC
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Toyota Camry Hybrid 2023
              </p>
              <p className="text-xs text-slate-500">
                Luxury Sedan • Silver Metallic
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Last Maintenance</span>
                <span className="font-semibold">April 12, 2024</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Fuel Level</span>
                <span className="font-semibold text-emerald-500">85%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Odometer</span>
                <span className="font-semibold">12,450 km</span>
              </div>
            </div>
            <button className="w-full mt-2 py-2.5 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors">
              View Vehicle Details
            </button>
          </div>
        </div>

        {/* Driver's Document List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              folder
            </span>
            Driver&apos;s Document List
          </h3>
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${doc.iconColor}`}>
                    {doc.icon}
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold">{doc.name}</p>
                    <p className="text-xs text-slate-500">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <IconButton name="download" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

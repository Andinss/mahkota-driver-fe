import type { DriverItem } from "@/lib/types/driver";
import type { RentalTransaction } from "@/lib/types/rentals";

interface OverviewDocument {
  name: string;
  icon: string;
  iconColor: string;
  url: string;
}

interface DriverOverviewProps {
  driver: DriverItem;
  buildUrl: (path: string) => string;
  rental?: RentalTransaction | null;
}

export function DriverOverview({ driver, buildUrl, rental }: DriverOverviewProps) {
  const documents: OverviewDocument[] = [];
  if (driver.national_id_card) documents.push({ name: "National ID Card (KTP)", icon: "badge", iconColor: "text-red-500", url: buildUrl(driver.national_id_card) });
  if (driver.sim_card) documents.push({ name: "Driver License (SIM)", icon: "credit_card", iconColor: "text-blue-500", url: buildUrl(driver.sim_card) });
  if (driver.garage_photo) documents.push({ name: "Garage Photo", icon: "garage", iconColor: "text-green-500", url: buildUrl(driver.garage_photo) });
  if (driver.npwp_photo) documents.push({ name: "NPWP Photo", icon: "description", iconColor: "text-amber-500", url: buildUrl(driver.npwp_photo) });

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
                  {driver.date_of_birth
                    ? new Date(driver.date_of_birth).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Gender</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {driver.gender || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Employee ID</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {driver.employee_id || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">House Type</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {driver.house_type || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Ready Sign Contract</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {driver.ready_sign_contract ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Willing to be Surveyed</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {driver.willing_to_be_survey ? "Yes" : "No"}
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
                  <span className="material-symbols-outlined text-slate-500 text-xl">
                    call
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {driver.phone || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-500 text-xl">
                    mail
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {driver.email || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-500 text-xl">
                    contact_emergency
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Emergency Contact
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {driver.emergency_contact || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-500 text-xl">
                    contact_emergency
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Emergency Email
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {driver.emergency_email || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-500 text-xl">
                    location_on
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Home Address
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {driver.permanent_address || "-"}
                  </p>
                </div>
              </div>
            </div>
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
          {rental?.vehicle ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">directions_car</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{rental.vehicle.merk} {rental.vehicle.model}</p>
                  <p className="text-xs text-slate-500">{rental.vehicle.license_plate}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Rental Period</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {new Date(rental.start_date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })} - {new Date(rental.end_date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Rental Number</span>
                <span className="font-semibold text-slate-900 dark:text-white">{rental.rental_number}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-400">No vehicle assigned</p>
            </div>
          )}
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
            {documents.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No documents uploaded</p>
            ) : (
              documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${doc.iconColor}`}>
                      {doc.icon}
                    </span>
                    <div className="text-sm">
                      <p className="font-semibold">{doc.name}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-lg">open_in_new</span>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

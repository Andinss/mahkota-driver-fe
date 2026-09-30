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
  if (driver.national_id_card)
    documents.push({ name: "National ID Card (KTP)", icon: "badge", iconColor: "text-red-500", url: buildUrl(driver.national_id_card) });
  if (driver.sim_card)
    documents.push({ name: "Driver License (SIM)", icon: "credit_card", iconColor: "text-blue-500", url: buildUrl(driver.sim_card) });
  if (driver.kartu_keluarga)
    documents.push({ name: "Kartu Keluarga (KK)", icon: "family_restroom", iconColor: "text-violet-500", url: buildUrl(driver.kartu_keluarga) });
  if (driver.skck)
    documents.push({ name: "SKCK", icon: "verified_user", iconColor: "text-cyan-500", url: buildUrl(driver.skck) });
  if (driver.garage_photo)
    documents.push({ name: "Garage Photo", icon: "garage", iconColor: "text-green-500", url: buildUrl(driver.garage_photo) });
  if (driver.npwp_photo)
    documents.push({ name: "NPWP Photo", icon: "description", iconColor: "text-amber-500", url: buildUrl(driver.npwp_photo) });
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - 2/3 width */}
      <div className="lg:col-span-2 space-y-6">
        {/* ===== PERSONAL INFORMATION ===== */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Personal Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <InfoField icon="cake" label="Date of Birth">
              {driver.date_of_birth
                ? new Date(driver.date_of_birth).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })
                : "-"}
            </InfoField>
            <InfoField icon="wc" label="Gender">
              {driver.gender || "-"}
            </InfoField>
            <InfoField icon="badge" label="Employee ID">
              {driver.employee_id || "-"}
            </InfoField>
            <InfoField icon="public" label="Citizenship">
              {driver.citizenship || "-"}
            </InfoField>
            <InfoField icon="call" label="Phone Number">
              {driver.phone || "-"}
            </InfoField>
            <InfoField icon="mail" label="Email Address">
              {driver.email || "-"}
            </InfoField>
          </div>
        </div>

        {/* ===== EMERGENCY CONTACT ===== */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">emergency</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Emergency Contact</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <InfoField icon="phone_in_talk" label="Emergency Contact">
              {driver.emergency_contact || "-"}
            </InfoField>
            <InfoField icon="alternate_email" label="Emergency Email">
              {driver.emergency_email || "-"}
            </InfoField>
          </div>
        </div>

        {/* ===== ADDRESS DETAILS ===== */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">map</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Address Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <InfoField icon="home" label="House Type">
              <span className="capitalize">{driver.house_type?.replace(/_/g, " ") || "-"}</span>
            </InfoField>
            <InfoField icon="apartment" label="Province">
              {driver.province_name || driver.province || "-"}
            </InfoField>
            <InfoField icon="location_city" label="City / Regency">
              {driver.city_name || driver.city || "-"}
            </InfoField>
            <InfoField icon="holiday_village" label="District">
              {driver.district_name || driver.district || "-"}
            </InfoField>
            <InfoField icon="signpost" label="Subdistrict">
              {driver.subdistrict_name || driver.subdistrict || "-"}
            </InfoField>
            <div className="md:col-span-2">
              <InfoField icon="pin_drop" label="Full Address">
                {driver.full_address || driver.permanent_address || "-"}
              </InfoField>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - 1/3 width */}
      <div className="space-y-6">
        {/* Assigned Vehicle */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">car_repair</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Assigned Vehicle</h3>
          </div>
          <div className="p-6">
            {rental?.vehicle ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">directions_car</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {rental.vehicle.merk} {rental.vehicle.model}
                    </p>
                    <p className="text-xs text-slate-500">{rental.vehicle.license_plate}</p>
                  </div>
                </div>
                <InfoField icon="calendar_month" label="Rental Period">
                  {new Date(rental.start_date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })} - {new Date(rental.end_date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}
                </InfoField>
                <InfoField icon="receipt_long" label="Rental Number">
                  {rental.rental_number}
                </InfoField>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">directions_car</span>
                <p className="text-sm text-slate-400">No vehicle assigned</p>
              </div>
            )}
          </div>
        </div>

        {/* Driver's Document List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">folder</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Documents</h3>
          </div>
          <div className="p-6 space-y-3">
            {documents.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No documents uploaded</p>
            ) : (
              documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`material-symbols-outlined ${doc.iconColor} shrink-0`}>
                      {doc.icon}
                    </span>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {doc.name}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-lg group-hover:text-primary transition-colors shrink-0">
                    open_in_new
                  </span>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoFieldProps {
  icon: string;
  label: string;
  children: React.ReactNode;
}

function InfoField({ icon, label, children }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg">
          {icon}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white break-words">
          {children}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        value
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${value ? "bg-emerald-500" : "bg-slate-400"}`} />
      {value ? "Yes" : "No"}
    </span>
  );
}
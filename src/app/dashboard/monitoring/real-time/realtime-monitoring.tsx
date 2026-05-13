import DetailStatusCard from "@/components/monitoring/real-time/detail-status-car";
import SideStatus from "@/components/monitoring/real-time/side-status";

const RealtimeMonitoring = () => {
  return (
    <div className="relative flex flex-1 mx-2 my-2 md:mx-4 md:my-4 lg:m-8 overflow-hidden">
      <SideStatus />

      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 dark:opacity-60 dark:grayscale-[30%] -z-10"
          data-alt="Map view of Jakarta city streets"
          data-location="Jakarta"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZcCuEO3iK-47-C-uER5dndg4eeueMdZiaMozfVE-k5Ygur65yu1NRXicu3Bv8mt5nl1QCbzJDq1Dfo4rPduMDlnUXzKrMieDwH7qXVnMhIWFrFJ1EYZRHRSPv6HXV1H9JRODcUMbH8TFHQqOeNvx0bKjvu5Uq9XAT8qD7tbMV2hXB5Q5gznZ9VOhTaFFpso3V-k6Z1_MkGqgbaoU0tOccN5WcLAm_w9YnEuDrh6HoRhjFKmXPhtIZ1A8VsK0OORu4heH9wgtaOWlQ")',
          }}
        ></div>

        <div className="absolute top-4 left-4 z-10 flex flex-col sm:flex-row gap-3">
          <div className="bg-white dark:bg-surface-dark p-3 pr-6 rounded-lg shadow-lg border border-red-100 dark:border-red-900/30 flex items-center gap-3 animate-fade-in-down">
            <div className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 p-2 rounded-lg">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Active Emergencies
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                3
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-3 pr-6 rounded-lg shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-2 rounded-lg">
              <span className="material-symbols-outlined text-xl">near_me</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Geofence Alerts
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                12
              </p>
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white dark:bg-surface-dark p-1 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex">
            <button className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm">
              Map
            </button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
              Satellite
            </button>
          </div>
        </div>

        <div className="absolute top-[40%] left-[45%] flex flex-col items-center cursor-pointer group z-10">
          <div className="absolute -inset-6 bg-red-500/10 rounded-full marker-ring"></div>
          <div className="absolute -inset-3 bg-red-500/20 rounded-full marker-ring-inner"></div>
          <div className="relative size-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white dark:border-slate-900 transform transition hover:scale-110">
            <span className="material-symbols-outlined text-base">warning</span>
          </div>
          <div className="absolute bottom-full mb-2 bg-surface-light dark:bg-surface-dark px-3 py-1.5 rounded-lg shadow-xl border border-red-100 dark:border-red-900/30 text-xs font-bold whitespace-nowrap opacity-100 group-hover:opacity-100 transition-opacity">
            <span className="text-red-600 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-red-500"></span> SOS: B
              1234 KKY
            </span>
          </div>
        </div>

        <div className="absolute top-[30%] left-[60%] flex flex-col items-center cursor-pointer group hover:z-20">
          <div className="size-9 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 transform transition hover:scale-110">
            <span className="material-symbols-outlined text-[18px]">
              local_shipping
            </span>
          </div>
          <div className="absolute bottom-full mb-2 bg-surface-light dark:bg-surface-dark px-2 py-1 rounded shadow-lg text-[10px] font-bold whitespace-nowrap hidden group-hover:block border border-slate-100 dark:border-slate-700">
            D 5678 AB
          </div>
        </div>

        <div className="absolute top-[55%] left-[30%] flex flex-col items-center cursor-pointer group hover:z-20">
          <div className="size-9 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 transform transition hover:scale-110">
            <span className="material-symbols-outlined text-[18px]">
              local_shipping
            </span>
          </div>
          <div className="absolute bottom-full mb-2 bg-surface-light dark:bg-surface-dark px-2 py-1 rounded shadow-lg text-[10px] font-bold whitespace-nowrap hidden group-hover:block border border-slate-100 dark:border-slate-700">
            B 9988 XYZ
          </div>
        </div>

        <div className="absolute top-[35%] left-[40%] size-64 pointer-events-none opacity-60">
          <svg className="w-full h-full drop-shadow-sm" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              fill="rgba(239, 68, 68, 0.05)"
              r="45"
              stroke="#ef4444"
              strokeDasharray="4 2"
              strokeWidth="1.5"
            ></circle>
          </svg>
        </div>

        <DetailStatusCard />

        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
          <button className="size-10 bg-white dark:bg-slate-800 rounded-lg shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined">my_location</span>
          </button>
          <div className="flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-md divide-y divide-slate-100 dark:divide-slate-700 border border-slate-200 dark:border-slate-700">
            <button className="size-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-t-lg">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="size-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-b-lg">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeMonitoring;

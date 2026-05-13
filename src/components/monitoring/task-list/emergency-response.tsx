"use client";
import { Button } from "@/components/ui/button";
interface EmergencySectionProps {
  emergencyData?: {
    id: string;
    location: string;
    vehicle: string;
    plate: string;
    driver: string;
    priority: string;
  };
}

export default function EmergencySection({ 
  emergencyData = {
    id: "#EM-2024-89",
    location: "Jl. Jendral Sudirman No. 45, Jakarta Pusat",
    vehicle: "Toyota Avanza",
    plate: "B 1234 XYZ",
    driver: "Pak Bambang",
    priority: "High Priority"
  }
}: EmergencySectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-red-600">emergency_home</span>
        <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight">Emergency Response</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-[#1e2732] border-l-4 border-red-500 rounded-lg p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Breakdown</span>
              <span className="text-[#617589] dark:text-gray-400 text-sm">{emergencyData.id}</span>
            </div>
            <span className="text-red-600 text-sm font-semibold flex items-center gap-1 group-hover:animate-pulse">
              <span className="size-2 rounded-full bg-red-600"></span> {emergencyData.priority}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#617589] dark:text-gray-400 font-medium uppercase">Location</p>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#111418] dark:text-gray-200 text-[20px] mt-0.5">location_on</span>
                <p className="text-[#111418] dark:text-white font-medium">{emergencyData.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#617589] dark:text-gray-400 font-medium uppercase">Vehicle &amp; Driver</p>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#111418] dark:text-gray-200 text-[20px] mt-0.5">directions_car</span>
                <div>
                  <p className="text-[#111418] dark:text-white font-medium">{emergencyData.vehicle} ({emergencyData.plate})</p>
                  <p className="text-sm text-[#617589] dark:text-gray-400">Driver: {emergencyData.driver}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Button 
              variant="primary"
              size="lg"
              icon="navigation"
              className="shadow-sm"
            >
              Respond Now
            </Button>

            <Button 
              variant="outline"
              size="lg"
              icon="call"
            >
              Call Driver
              </Button>
          </div>
        </div>

        {/* Small Map Preview */}
        <div className="hidden md:block w-48 h-auto min-h-[140px] bg-gray-200 rounded-lg bg-cover bg-center border border-[#e5e7eb] dark:border-[#333]" data-alt="Map view showing location pin in Jakarta city center" data-location="Jakarta, Indonesia" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCh_z9Nc3IWYR7UuadAJqJO1netBz9iAt9DFzYrY97_iWPMJOd24o3N4C6p42ZmzlqVa5G_wRbt4krpYnKwmr5nwAtSzEuyhc-A03iVWuGo0scbKbC3zzHKX0qh1wUOI7CTvjR8BLCOgwh4Alt52PbU_tGDEcHCY9pFoRDia_h3z0_68fwTKCVtRPD8eNUxH6nQgLcfJRKEkfybQSgrJT9uDuVFthxNvkZb4RyH9SiyVSyOr83X9Vn_0eX6OrUtyywD1MWFwaGsIL-_")' }}>
        </div>
      </div>
    </section>
  );
}
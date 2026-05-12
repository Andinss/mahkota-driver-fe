"use client";

interface EmergencyResponseProps {
    emergencyData?: {
        id: string;
        location: string;
        vehicle: string;
        plate: string;
        driver: string;
        priority: string;
    };
}

export default function EmergencyResponse({
    emergencyData = {
    id: "#EM-2024-89",
    location: "Jl. Jendral Sudirman No. 45, Jakarta Pusat",
    vehicle: "Toyota Avanza",
    plate: "B 1234 XYZ",
    driver: "Pak Bambang",
    priority: "High Priority"
  }
}: EmergencyResponseProps){
    return(
        <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">
                    emergency_home
                </span>
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold leading-tight">
                    Emergency Response
                </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-[#1e2732] border-l-4
            border-red-500 rounded-lg p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex-1 flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                Breakdown
                            </span>
                            <span className="text-[#617589] dark:text-gray-400 text-sm">
                                {emergencyData.id}
                            </span>
                        </div>
                        <span className="text-red-600 text-sm font-semibold animate-pulse flex items-center gap-1">
                            <span className="size-2 rounded-full bg-red-600">{emergencyData.priority}</span>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-[#617589] dark:text-gray-400 font-medium uppercase">Location</p>
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-[#111418 dark:text-gray-200 text-[20px] mt-0.5">location_on</span>
                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
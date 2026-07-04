export interface VehicleHeaderData {
  plate: string;
  name: string;
  status: string;
  totalRevenue: string;
  totalRentals: string;
  avgUtilization: string;
  maintenance: string;
  imageUrl: string;
  imageAlt: string;
}

interface VehicleHeaderProps {
  data: VehicleHeaderData;
}

export function VehicleHeader({ data }: VehicleHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row">
      <div className="p-6 flex-1 border-r border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 mb-2">
              {data.status}
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
              {data.plate}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {data.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-primary leading-tight">
              {data.totalRevenue}
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
              Total Rentals
            </p>
            <p className="text-lg font-bold">{data.totalRentals}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
              Avg. Utilization
            </p>
            <p className="text-lg font-bold">{data.avgUtilization}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
              Maintenance
            </p>
            <p className="text-lg font-bold text-blue-500">{data.maintenance}</p>
          </div>
        </div>
      </div>
      <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-900 via-transparent to-transparent z-10 hidden md:block"></div>
        {data.imageUrl ? (
          <img
            alt={data.imageAlt}
            className="w-full h-full object-cover"
            data-alt={data.imageAlt}
            src={data.imageUrl}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}
      </div>
    </div>
  );
}

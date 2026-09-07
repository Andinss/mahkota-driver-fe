interface CardCarInfoProps {
  vehicleName?: string;
  licensePlate?: string;
  imageUrl?: string;
}

const CardCarInfo = ({
  vehicleName = "-",
  licensePlate = "-",
  imageUrl,
}: CardCarInfoProps) => {
  const displayImage = imageUrl || "";

  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-56 sm:h-64 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {displayImage ? (
          <img
            alt={vehicleName}
            className="w-full h-full object-cover"
            src={displayImage}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">
              directions_car
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block bg-white/95 dark:bg-slate-900/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider text-slate-900 dark:text-white">
            {licensePlate}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
              Kendaraan
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {vehicleName}
            </h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">
              local_car_wash
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {licensePlate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCarInfo;

interface CardCarInfoProps {
  vehicleName?: string;
  licensePlate?: string;
  color?: string;
  fuelLevel?: number;
  odometer?: number;
  depositAmount?: number;
  imageUrl?: string;
}

const CardCarInfo = ({
  vehicleName = "2024 Mercedes-Benz S-Class",
  licensePlate = "B 1234 PTZ",
  color = "Obsidian Black",
  fuelLevel = 85,
  odometer = 12402,
  depositAmount = 1500000,
  imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCvjwInuWQ9_YeOX-7ECcy5lTNdkTUlhRGsTpT2xTs4BMFlypYWaVJPXrULRXJ9yVgGGO7Xwd2OM71m8KHYZUX_90-fSV2lalKZ0WDL4g9vwXpcDjFEwM3x1V2O9ZLUvo5MqucDBipevEa87d7AN_wYzaezwJ5b5_qvmMeEDihF6JZBJkwXC3a-5zTAJd_ktfPsTKCKq9rfHa4cH73vNt2Z0kdKpHwo_XXWYaA0UMTt0Jf09QdNRQnD9Bb6kxgunpNDkFMisW6b0Htp",
}: CardCarInfoProps) => {
  const displayImage = imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCvjwInuWQ9_YeOX-7ECcy5lTNdkTUlhRGsTpT2xTs4BMFlypYWaVJPXrULRXJ9yVgGGO7Xwd2OM71m8KHYZUX_90-fSV2lalKZ0WDL4g9vwXpcDjFEwM3x1V2O9ZLUvo5MqucDBipevEa87d7AN_wYzaezwJ5b5_qvmMeEDihF6JZBJkwXC3a-5zTAJd_ktfPsTKCKq9rfHa4cH73vNt2Z0kdKpHwo_XXWYaA0UMTt0Jf09QdNRQnD9Bb6kxgunpNDkFMisW6b0Htp";

  return (
    <div className="col-span-12 lg:col-span-8">
      <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row h-full border border-gray-200 dark:border-gray-700">
        <div className="md:w-1/2 relative min-h-[250px] md:h-auto overflow-hidden group">
          <img
            alt={vehicleName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src={displayImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span className="bg-white/95 dark:bg-[#1a2632]/95 backdrop-blur px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase text-gray-900 dark:text-white">
              {licensePlate}
            </span>
            <span className="bg-black/60 backdrop-blur text-white px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
              {color}
            </span>
          </div>
        </div>
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#1a2632]">
          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
              Primary Asset
            </h3>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              {vehicleName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <span className="material-symbols-outlined text-lg">
                    local_gas_station
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Fuel Level
                  </span>
                </div>
                <div className="flex items-end justify-between mb-1">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{fuelLevel}%</p>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${fuelLevel}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <span className="material-symbols-outlined text-lg">
                    speed
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Odometer
                  </span>
                </div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {odometer.toLocaleString("id-ID")}{" "}
                  <span className="text-[10px] font-normal text-gray-500">
                    km
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <span className="material-symbols-outlined text-blue-600">
                  security
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">
                  Security Deposit
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(depositAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardCarInfo;

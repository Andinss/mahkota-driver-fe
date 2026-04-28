const CardCarInfo = () => {
  return (
    <div className="col-span-12 lg:col-span-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row h-full border border-gray-200">
        <div className="md:w-1/2 relative min-h-[250px] md:h-auto overflow-hidden group">
          <img
            alt="2024 Mercedes-Benz S-Class"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvjwInuWQ9_YeOX-7ECcy5lTNdkTUlhRGsTpT2xTs4BMFlypYWaVJPXrULRXJ9yVgGGO7Xwd2OM71m8KHYZUX_90-fSV2lalKZ0WDL4g9vwXpcDjFEwM3x1V2O9ZLUvo5MqucDBipevEa87d7AN_wYzaezwJ5b5_qvmMeEDihF6JZBJkwXC3a-5zTAJd_ktfPsTKCKq9rfHa4cH73vNt2Z0kdKpHwo_XXWYaA0UMTt0Jf09QdNRQnD9Bb6kxgunpNDkFMisW6b0Htp"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span className="bg-white/95 backdrop-blur px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase text-gray-900">
              B 1234 PTZ
            </span>
            <span className="bg-black/60 backdrop-blur text-white px-2.5 py-1 rounded text-[9px] font-bold tracking-widest uppercase">
              Obsidian Black
            </span>
          </div>
        </div>
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
              Primary Asset
            </h3>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
              2024 Mercedes-Benz S-Class
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <span className="material-symbols-outlined text-lg">
                    local_gas_station
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Fuel Level
                  </span>
                </div>
                <div className="flex items-end justify-between mb-1">
                  <p className="text-2xl font-black text-gray-900">85%</p>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <span className="material-symbols-outlined text-lg">
                    speed
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Odometer
                  </span>
                </div>
                <p className="text-2xl font-black text-gray-900">
                  12,402{" "}
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
                <p className="text-[9px] font-bold text-gray-500 uppercase">
                  Security Deposit
                </p>
                <p className="text-lg font-bold text-gray-900">$1,500.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardCarInfo;

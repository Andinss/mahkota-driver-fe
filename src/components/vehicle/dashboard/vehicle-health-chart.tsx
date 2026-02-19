export function VehicleHealthChart() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <h3 className="font-bold text-lg dark:text-white mb-6">
        Vehicle Health Distribution
      </h3>
      <div className="flex items-center justify-center relative h-[200px]">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            className="donut-segment stroke-gray-100 dark:stroke-gray-800"
            cx="96"
            cy="96"
            r="80"
            strokeDasharray="502"
            strokeDashoffset="0"
          ></circle>
          <circle
            className="donut-segment stroke-green-500"
            cx="96"
            cy="96"
            r="80"
            strokeDasharray="502"
            strokeDashoffset="125"
          ></circle>
          <circle
            className="donut-segment stroke-orange-400"
            cx="96"
            cy="96"
            r="80"
            strokeDasharray="502"
            strokeDashoffset="425"
          ></circle>
          <circle
            className="donut-segment stroke-red-500"
            cx="96"
            cy="96"
            r="80"
            strokeDasharray="502"
            strokeDashoffset="475"
          ></circle>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black dark:text-white">124</span>
          <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">
            Vehicles
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              Good
            </span>
          </div>
          <span className="text-sm font-bold dark:text-white">93</span>
        </div>
        <div className="flex flex-col items-center border-x border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              Warning
            </span>
          </div>
          <span className="text-sm font-bold dark:text-white">19</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              Critical
            </span>
          </div>
          <span className="text-sm font-bold dark:text-white">12</span>
        </div>
      </div>
    </div>
  );
}

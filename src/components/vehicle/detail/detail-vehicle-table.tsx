interface Vehicle {
  name: string;
  id: string;
  plate: string;
  status: "available" | "rented" | "maintenance" | "retrieved";
  image: string;
  imageAlt: string;
}

const statusConfig = {
  available: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  rented: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  maintenance: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  retrieved: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
};

export const DetailVehicleTable = () => {
  const vehicles: Vehicle[] = [
    {
      name: "Toyota Avanza",
      id: "#V-1024",
      plate: "B 1234 CD",
      status: "available",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEU3kQYuMTg0km5JxtcUXo8QTo3IT0g28d4W4ApiG7MDxdW1nlr3A-ApoS2S6MRIVlB4HD-R6tMbE34cR-sDLdunlQvaaSIgFc93vDluY0HZYQwFjNnkq1G3Y_-fv95QYFNAYl0ZEfEYuXoBaMEVaDO8v9Nhrc8Uyo4ftoc9KdQzqLZZEy_L51rrdO3qByOe8sIZJdpGL1HIkO9DDGFRIZayZV02y-J4b_ynzRScseqiNCjzoS3yyy8koKsfTmYm4nt-lMPajs10an",
      imageAlt: "White Toyota Avanza side view icon",
    },
    {
      name: "Honda Civic",
      id: "#V-3921",
      plate: "B 5678 EF",
      status: "rented",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7QS08I1R9sWOkLRVyIiuEmjUQmRq_U2dBXFIHlQ5-cG0_sZegEBbqnE7gqnDv53UvY11WMR4UiXDgHc1vfeRHU9L8SKmhlSf0oWH4m8vGFM7CL_PjA5zsrqGq6D2mMCOs5ja401nPri2VDU2zQCBdu6R1YjN6gXhyOhlW8REcA0qVrTFk51LQgS4sHrd0JhqSvabd8wilmDlJBLYB6xBU7eJ4CKKmYgh5n3gkdzpKhYXhMdKUhDJslqIsVMRgeWgbuThpuv1oeKV4",
      imageAlt: "Black Honda Civic icon",
    },
    {
      name: "Mitsubishi Xpander",
      id: "#V-8812",
      plate: "B 9012 GH",
      status: "maintenance",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3n6h4yDUscS9DzImka04ggfqTTT-VBxWAq3wQ78Qv8FCySJIAYgU4kx2mAV3XGlbJeboG-oQi90v3_gt94llgyKza6H9t1d4tvaaneSIHYScULotZOEfnbH-EUD6glTuXZNW-6kbr3oKa36Z-lsKxkLBRi2U-moPWAN_RSAXXNonORAV37D9AKo2BAvDP1lsoInA6a3fcRrKy0roMrAXTbiBcTshT3befXZQvCV9D0yfRVbS1K-2wS2qWd6EClc-LSuUWBZomrKG8",
      imageAlt: "Silver Mitsubishi Xpander icon",
    },
    {
      name: "Toyota Innova",
      id: "#V-5541",
      plate: "B 4411 ZZ",
      status: "retrieved",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWu1q4FkRJ9ImJWYINWnYhn_W8-_7dFGRKbquk_hgP1WhDlqARm6ZyBqkft6Zxla_nof1CraC5KNjbuUajpcCGeYvNAJtOOoHSWm9XMuseAD8dc7mmKStedrvKteLfK7XzapvVXBoXqmQ_BSS1z7ZcOWxJxjqxKsnIDi1jsxfP4m4xrJPNeMHhLRWzR0deZgk7bG1ci8SbZfC295fo80up3r7FyXkHdv5pmLm-NRp3Ezp-re_uwxEnQ8ByBWn9P7Bc6fQXDopI9mIp",
      imageAlt: "Black Toyota Innova icon",
    },
  ];

  return (
    <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                scope="col"
              >
                Vehicle Details
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                scope="col"
              >
                License Plate
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                scope="col"
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                scope="col"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
            {vehicles.map((vehicle, index) => (
              <tr
                key={index}
                className={`${
                  index === 0
                    ? "bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-primary"
                    : "border-l-4 border-l-transparent"
                } hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <img
                        alt={vehicle.imageAlt}
                        className="h-8 w-8 object-contain"
                        src={vehicle.image}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {vehicle.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        ID: {vehicle.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900 dark:text-white font-mono">
                    {vehicle.plate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[vehicle.status]}`}
                  >
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {index === 0 ? (
                    <button className="text-primary hover:text-blue-800 dark:hover:text-blue-300 font-semibold text-xs border border-primary/20 bg-primary/5 rounded px-3 py-1.5 transition-all">
                      Update
                    </button>
                  ) : (
                    <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                      <span className="material-symbols-outlined text-[20px]">
                        more_vert
                      </span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-center">
        <button className="text-sm text-primary font-medium hover:underline">
          View All Vehicles
        </button>
      </div>
    </div>
  );
};

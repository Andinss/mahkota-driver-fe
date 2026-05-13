"use client";

import { useState, useEffect } from "react";

interface VehicleDetailsCardProps {
  vehicle: {
    name: string;
    year: string;
    transmission: string;
    plateNumber: string;
    imageUrl: string;
    odometerOut: number;
    fuelLevel: number;
    type: string;
  };
}

export const VehicleDetailsCard = ({ vehicle }: VehicleDetailsCardProps) => {
  const [formattedOdometer, setFormattedOdometer] = useState<string>("");

  useEffect(() => {
    setFormattedOdometer(vehicle.odometerOut.toLocaleString());
  }, [vehicle.odometerOut]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e7edf3] dark:border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-[#e7edf3] dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/50">
        <h3 className="font-bold text-[#0d141b] dark:text-white">Vehicle Details</h3>
        <span className="bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded text-xs font-semibold border border-slate-200 dark:border-gray-700">
          {vehicle.type}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div 
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg relative"
          style={{ backgroundImage: `url("${vehicle.imageUrl}")` }}
        >
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
            {vehicle.plateNumber}
          </div>
        </div>
        <div>
          <p className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight">{vehicle.name}</p>
          <p className="text-[#4c739a] dark:text-slate-400 text-sm mt-1">
            Model {vehicle.year} • {vehicle.transmission}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-[#f6f7f8] dark:bg-gray-800 p-2 rounded">
            <p className="text-[#4c739a] dark:text-slate-400 text-xs">Odometer Out</p>
            <p className="font-semibold text-[#0d141b] dark:text-white">
              {formattedOdometer} km
            </p>
          </div>
          <div className="bg-[#f6f7f8] dark:bg-gray-800 p-2 rounded">
            <p className="text-[#4c739a] dark:text-slate-400 text-xs">Fuel Level</p>
            <p className="font-semibold text-[#0d141b] dark:text-white">{vehicle.fuelLevel}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
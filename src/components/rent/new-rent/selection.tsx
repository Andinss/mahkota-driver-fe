"use client";

import { SelectSearch } from "@/components/ui/select-input-search";
import { useEffect, useState } from "react";
const driverDetails = [
   { label: "Marco Polo", 
     value: "889201",
     image: "https://i.pravatar.cc/40?img=1" 
    },   
  { label: "Sarah Smith", 
    value: "889205", 
    image: "https://i.pravatar.cc/40?img=2" 
  },   
  { label: "Robert Chen", 
    value: "889312", 
    image: "https://i.pravatar.cc/40?img=3" 
  },   
  { label: "Anita Wijaya", 
    value: "889410", 
    image: "https://i.pravatar.cc/40?img=4" 
  },  
];

const vehicleInfo = [
  {
    label: "B 11234 XYZ - Toyota Avanza",
    value: "B 11234 XYZ",
  },
  {
    label: "B 5678 ABC - Honda CR-V",
    value: "B 5678 ABC",
  },
  {
    label: "B 9910 DEF - Mitsubishi Pajero",
    value: "B 9910 DEF",
  },
  {
    label: "B 2233 GHI - Toyota Innova ",
    value: "B 2233 GHI",
  },
];

const rentalPeriod = [
  
];

  interface FormErrors {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  dailyRate?: string;
  depositAmount?: string;
}

interface SelectionFormProps {
  onDataChange?: (data: {
    vehicleId?: string;
    driverId?: string;
    driverType?: string;
  }) => void;
  initialData?: {
    vehicleId?: string;
    driverId?: string;
  };
  error?: FormErrors;
}


const SelectionForm = ({ onDataChange, initialData, error }: SelectionFormProps) => {
   const [selectedDriver, setSelectedDriver] = useState<string | undefined>(
    initialData?.driverId
  );
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(
    initialData?.vehicleId
  );

  useEffect(() => {
    if (initialData?.driverId) setSelectedDriver(initialData.driverId);
    if (initialData?.vehicleId) setSelectedVehicle(initialData.vehicleId);
  }, [initialData]);

  const handleDriverChange = (value: string) => {
    setSelectedDriver(value);
    onDataChange?.({ driverId: value, vehicleId: selectedVehicle });
  };

  const handleVehicleChange = (value: string) => {
    setSelectedVehicle(value);
    onDataChange?.({ vehicleId: value, driverId: selectedDriver });
  };
  return (
    <div>
      <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-primary/20 dark:border-primary/10 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            1
          </span>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            Driver & Vehicle Selection
          </h3>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Driver */}
          <div className="space-y-2 group">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-focus-within:text-primary">
              Select Active Driver
            </label>

            <SelectSearch
              options={driverDetails}
              placeholder="Search driver..."
              value={selectedDriver}
              onChange={handleDriverChange}
              error={error?.driverId}
            />
          </div>

          {/* Vehicle */}
          <div className="space-y-2 group">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-focus-within:text-primary">
              Select Available Vehicle
            </label>

            <SelectSearch
              options={vehicleInfo}
              placeholder="Search vehicle..."
              value={selectedVehicle}
              onChange={handleVehicleChange}
              error={error?.vehicleId}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SelectionForm;

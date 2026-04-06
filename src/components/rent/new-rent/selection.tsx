"use client";

import { SelectSearch } from "@/components/ui/select-input-search";

const driverOptions = [
  {
    label: "Budi Santoso",
    value: "1",
    image: "https://i.pravatar.cc/40?img=1",
  },
  {
    label: "Andi Wijaya",
    value: "2",
    image: "https://i.pravatar.cc/40?img=2",
  },
];

const vehicleOptions = [
  {
    label: "B 1234 XYZ - Toyota Avanza",
    value: "1",
  },
  {
    label: "D 5678 ABC - Honda Brio",
    value: "2",
  },
];

const SelectionForm = () => {
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
              options={driverOptions}
              placeholder="Search driver..."
            />
          </div>

          {/* Vehicle */}
          <div className="space-y-2 group">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-focus-within:text-primary">
              Select Available Vehicle
            </label>

            <SelectSearch
              options={vehicleOptions}
              placeholder="Search vehicle..."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SelectionForm;

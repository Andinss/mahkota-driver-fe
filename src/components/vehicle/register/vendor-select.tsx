"use client";

import { useEffect, useState } from "react";
import { Select } from "@/components/ui/select";
import { vendorApi } from "@/lib/api/vendor-vehicle";
import type { VendorVehicle } from "@/lib/types/vendor-vehicle";

interface VendorSelectProps {
  value: string;
  onChange: (vendorId: string) => void;
}

export function VendorSelect({ value, onChange }: VendorSelectProps) {
  const [vendors, setVendors] = useState<VendorVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    vendorApi
      .getList({ limit: 1000 })
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : [];
        setVendors(items.filter((v) => v.status === "active"));
      })
      .catch(() => setVendors([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">
            storefront
          </span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Vendor
          </h3>
          <p className="text-xs text-slate-400">
            Pilih vendor pemilik kendaraan (opsional)
          </p>
        </div>
      </div>
      <Select
        id="vendor"
        label="Vendor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Pilih Vendor --</option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>
            {vendor.name}
          </option>
        ))}
      </Select>
      {isLoading && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Memuat daftar vendor...
        </p>
      )}
    </div>
  );
}
"use client";

import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import { formatRupiah } from "@/lib/utils/format";
import type { VendorVehicle } from "@/lib/types/vendor-vehicle";

interface VendorTableRowProps {
  vendor: VendorVehicle;
  onEdit?: (vendor: VendorVehicle) => void;
  onDelete?: (vendor: VendorVehicle) => void;
  onDetails?: (vendor: VendorVehicle) => void;
}

const imageBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

const buildLogoUrl = (logo?: string) =>
  logo
    ? logo.startsWith("http")
      ? logo
      : `${imageBase}/${logo.replace(/^\//, "")}`
    : "";

export const VendorTableRow = ({
  vendor,
  onEdit,
  onDelete,
  onDetails,
}: VendorTableRowProps) => {
  const logoUrl = buildLogoUrl(vendor.logo);

  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={vendor.name}
                src={logoUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-xs font-medium">
                {vendor.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {vendor.name}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-slate-900 dark:text-white">{vendor.owner_name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {vendor.status === "active" ? "Aktif" : "Nonaktif"}
        </p>
      </td>
      <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
        {formatRupiah(Number(vendor.pendapatan) || 0)}
      </td>
      <td className="px-6 py-4 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/vendor-vehicles/new?id=${vendor.id}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            icon="delete"
            danger
            onClick={() => onDelete?.(vendor)}
          >
            Delete
          </DropdownMenuItem>
          <Link href={`/dashboard/vendor-vehicles/detail?id=${vendor.id}`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>
        </Dropdown>
      </td>
    </tr>
  );
};

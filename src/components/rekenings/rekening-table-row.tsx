"use client";

import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import { RekeningStatusBadge, RekeningTypeBadge } from "./rekening-badges";
import { formatRupiah } from "@/lib/utils/format";
import type { Rekening } from "@/lib/types/rekening";

interface RekeningTableRowProps {
  rekening: Rekening;
  onEdit?: (rekening: Rekening) => void;
  onDelete?: (rekening: Rekening) => void;
  onToggleStatus?: (rekening: Rekening) => void;
}

export const RekeningTableRow = ({
  rekening,
  onEdit,
  onDelete,
  onToggleStatus,
}: RekeningTableRowProps) => {
  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-emerald-500 text-lg">
              account_balance
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-white">
              {rekening.name}
            </p>
            <p className="text-xs text-slate-400 truncate max-w-xs">
              {rekening.code} &middot; {rekening.description || "Tidak ada deskripsi"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
        {rekening.bank_name}
      </td>
      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
        {rekening.account_number}
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
        {rekening.account_holder}
      </td>
      <td className="px-6 py-4">
        <RekeningTypeBadge type={rekening.type} />
      </td>
      <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
        {formatRupiah(rekening.balance)}
      </td>
      <td className="px-6 py-4">
        <RekeningStatusBadge isActive={rekening.is_active} />
      </td>
      <td className="px-6 py-4 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
          }
        >
          <Link href={`/dashboard/rekenings/detail?id=${rekening.id}`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>
          <DropdownMenuItem icon="edit" onClick={() => onEdit?.(rekening)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            icon={rekening.is_active !== false ? "block" : "check_circle"}
            onClick={() => onToggleStatus?.(rekening)}
          >
            {rekening.is_active !== false ? "Mark as Inactive" : "Mark as Active"}
          </DropdownMenuItem>
          <DropdownMenuItem
            icon="delete"
            danger
            onClick={() => onDelete?.(rekening)}
          >
            Delete
          </DropdownMenuItem>
        </Dropdown>
      </td>
    </tr>
  );
};
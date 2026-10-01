"use client";

import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import { MembershipStatusBadge } from "./badges";
import { formatRupiah } from "@/lib/utils/format";
import type { Membership } from "@/lib/types/membership";

interface MembershipTableRowProps {
  membership: Membership;
  onEdit?: (membership: Membership) => void;
  onDelete?: (membership: Membership) => void;
}

export const MembershipTableRow = ({
  membership,
  onEdit,
  onDelete,
}: MembershipTableRowProps) => {
  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-white">
              {membership.name}
            </p>
            <p className="text-xs text-slate-400 truncate max-w-xs">
              {membership.description || "Tidak ada deskripsi"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
        {formatRupiah(membership.fee)}
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1 max-w-md">
          {membership.benefits.length > 0 ? (
            membership.benefits.slice(0, 3).map((benefit) => (
              <span
                key={benefit}
                className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium"
              >
                {benefit}
              </span>
            ))
          ) : (
            <span className="text-slate-400">-</span>
          )}
          {membership.benefits.length > 3 && (
            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold">
              +{membership.benefits.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <MembershipStatusBadge isActive={membership.is_active} />
      </td>
      <td className="px-6 py-4 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
          }
        >
          <Link href={`/dashboard/memberships/detail?id=${membership.id}`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>
          <DropdownMenuItem icon="edit" onClick={() => onEdit?.(membership)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem icon="delete" danger onClick={() => onDelete?.(membership)}>
            Delete
          </DropdownMenuItem>
        </Dropdown>
      </td>
    </tr>
  );
};

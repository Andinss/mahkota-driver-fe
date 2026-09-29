"use client";

import { useState } from "react";
import { MembershipTableRow } from "./membership-table-row";
import { ModalExport } from "@/components/ui/export";
import type { ExportColumn, ExportOptions } from "@/components/ui/export";
import type { Membership } from "@/lib/types/membership";

interface MembershipTableProps {
  memberships: Membership[];
  totalResults?: number;
  isLoading?: boolean;
  onEdit?: (membership: Membership) => void;
  onDelete?: (membership: Membership) => void;
  onExport?: (options: ExportOptions) => void;
}

const membershipColumns: ExportColumn[] = [
  { id: "level", label: "Level", defaultChecked: true },
  { id: "name", label: "Nama Membership", defaultChecked: true },
  { id: "fee", label: "Fee", defaultChecked: true },
  { id: "benefit", label: "Benefit", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
  { id: "description", label: "Deskripsi", defaultChecked: false },
];

export const MembershipTable = ({
  memberships,
  totalResults,
  isLoading,
  onEdit,
  onDelete,
  onExport,
}: MembershipTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">
              card_membership
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Membership List
            </h2>
            <p className="text-xs text-slate-400">
              {memberships.length} tipe membership terdaftar
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Nama Membership</th>
              <th className="px-6 py-4">Fee</th>
              <th className="px-6 py-4">Benefit</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {memberships.map((membership) => (
              <MembershipTableRow
                key={membership.id}
                membership={membership}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {memberships.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  {isLoading
                    ? "Memuat data membership..."
                    : "Tidak ada tipe membership yang cocok dengan pencarian."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          setIsExportModalOpen(false);
          onExport?.(options);
        }}
        totalRows={totalResults ?? memberships.length}
        title="Export Membership Data"
        description="Generate membership type reports."
        columns={membershipColumns}
      />
    </>
  );
};

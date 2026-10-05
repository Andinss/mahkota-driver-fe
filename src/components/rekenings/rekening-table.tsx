"use client";

import { useState } from "react";
import { RekeningTableRow } from "./rekening-table-row";
import { ModalExport } from "@/components/ui/export";
import type { ExportColumn, ExportOptions } from "@/components/ui/export";
import type { Rekening } from "@/lib/types/rekening";

interface RekeningTableProps {
  rekenings: Rekening[];
  totalResults?: number;
  isLoading?: boolean;
  onEdit?: (rekening: Rekening) => void;
  onDelete?: (rekening: Rekening) => void;
  onToggleStatus?: (rekening: Rekening) => void;
  onExport?: (options: ExportOptions) => void;
}

const rekeningColumns: ExportColumn[] = [
  { id: "name", label: "Nama Rekening", defaultChecked: true },
  { id: "bank_name", label: "Bank", defaultChecked: true },
  { id: "account_number", label: "Nomor Rekening", defaultChecked: true },
  { id: "account_holder", label: "Atas Nama", defaultChecked: true },
  { id: "type", label: "Tipe", defaultChecked: true },
  { id: "balance", label: "Saldo", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
  { id: "description", label: "Deskripsi", defaultChecked: false },
];

export const RekeningTable = ({
  rekenings,
  totalResults,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  onExport,
}: RekeningTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-500 text-xl">
              account_balance
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Rekening List
            </h2>
            <p className="text-xs text-slate-400">
              {rekenings.length} rekening terdaftar
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
              <th className="px-6 py-4">Nama Rekening</th>
              <th className="px-6 py-4">Bank</th>
              <th className="px-6 py-4">Nomor Rekening</th>
              <th className="px-6 py-4">Atas Nama</th>
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4">Saldo</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {rekenings.map((rekening) => (
              <RekeningTableRow
                key={rekening.id}
                rekening={rekening}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            ))}
            {rekenings.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  {isLoading
                    ? "Memuat data rekening..."
                    : "Tidak ada rekening yang cocok dengan pencarian."}
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
        totalRows={totalResults ?? rekenings.length}
        title="Export Rekening Data"
        description="Generate rekening bank reports."
        columns={rekeningColumns}
      />
    </>
  );
};
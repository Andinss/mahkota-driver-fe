"use client";

import { OutOfTownTableRow, OutOfTownRequest } from "./out-of-town-table-row";

interface OutOfTownTableProps {
  requests: OutOfTownRequest[];
  onSelect?: (request: OutOfTownRequest) => void;
}

export const OutOfTownTable = ({ requests, onSelect }: OutOfTownTableProps) => {
  return (
    <>
      {/* Header Card */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">
              commute
            </span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Pengajuan Keluar Wilayah
            </h2>
            <p className="text-xs text-slate-400">
              {requests.length} pengajuan tercatat
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Kendaraan</th>
              <th className="px-4 py-3">Tujuan</th>
              <th className="px-4 py-3">Periode</th>
              <th className="px-4 py-3">Alasan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {requests.map((r) => (
              <OutOfTownTableRow key={r.id} request={r} onSelect={onSelect} />
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block">
              commute
            </span>
            <p className="text-slate-400 text-sm font-medium">
              Tidak ada pengajuan ditemukan
            </p>
          </div>
        )}
      </div>
    </>
  );
};

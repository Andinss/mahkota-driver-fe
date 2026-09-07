import { ExportColumn, ModalExport } from "@/components/ui/export";
import { useState } from "react";
import { AuditTableRow } from "./audit-table-row";
import type { AuditLogItem } from "@/lib/types/audit";

interface AuditTableProps {
  logs: AuditLogItem[];
  onExport?: (options?: any) => void;
}

const auditColumns: ExportColumn[] = [
  { id: "timestamp", label: "Timestamp", defaultChecked: true },
  { id: "user", label: "User", defaultChecked: true },
  { id: "action", label: "Action", defaultChecked: true },
  { id: "target", label: "Target", defaultChecked: true },
  { id: "device", label: "Device", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
];

export const AuditLogTable = ({ logs, onExport }: AuditTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">history</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Audit Logs
            </h2>
            <p className="text-xs text-slate-400">{logs.length} entri tercatat</p>
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
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Target</th>
              <th className="px-6 py-4">Device</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {logs.map((log) => (
              <AuditTableRow key={log.id} log={log} />
            ))}
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
        totalRows={logs.length}
        title="Export Audit Logs"
        description="Generate audit log reports."
        columns={auditColumns}
      />
    </>
  );
};

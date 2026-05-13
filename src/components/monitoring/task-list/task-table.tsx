"use client";

import { ExportColumn, ModalExport } from "@/components/ui/export";
import { useState } from "react";
import { TaskTableRow, Task } from "./task-table-row";

interface TaskTableProps {
  tasks: Task[];
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
  resultsPerPage?: number;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onDetails?: (task: Task) => void;
  onViewMap?: (task: Task) => void;
  onComplete?: (task: Task) => void;
  onExport?: (options?: any) => void;
}

const taskColumns: ExportColumn[] = [
  { id: "priority", label: "Priority", defaultChecked: true },
  { id: "vehicleName", label: "Vehicle Name", defaultChecked: true },
  { id: "vehiclePlate", label: "Vehicle Plate", defaultChecked: true },
  { id: "location", label: "Location", defaultChecked: true },
  { id: "timeWindow", label: "Time Window", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
];

export const TaskTable = ({
  tasks,
  currentPage = 3,
  totalPages = 6,
  totalResults = 12,
  resultsPerPage = 4,
  onEdit,
  onDelete,
  onDetails,
  onViewMap,
  onComplete,
  onExport,
}: TaskTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const startEntry = (currentPage - 1) * resultsPerPage + 1;
  const endEntry = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="bg-white dark:bg-[#1e2732] rounded-xl border border-[#e5e7eb] dark:border-[#333] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Scheduled Retrievals
        </h2>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Vehicle Info</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Time Window</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {tasks.map((task, index) => (
              <TaskTableRow
                key={task.id || index}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetails={onDetails}
                onViewMap={onViewMap}
                onComplete={onComplete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Export */}
      <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          setIsExportModalOpen(false);
          onExport?.(options);
        }}
        totalRows={totalResults}
        title="Export Task Data"
        description="Generate task retrieval reports."
        columns={taskColumns}
      />
    </div>
  );
};
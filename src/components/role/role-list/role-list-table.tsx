"use client";
import { useState } from "react";
import { RoleTableRow } from "./role-list-table-row";
import {
  ModalExport,
  ExportOptions,
  ExportColumn,
} from "@/components/ui/export";
import type { RoleItem } from "@/lib/types/role";

interface RoleDisplay {
  id: string;
  name: string;
  color: string;
  permissionsByModule: Record<string, string[]>;
}

const getModulePermissions = (role: RoleItem): Record<string, string[]> => {
  const result: Record<string, string[]> = {};
  if (!role.permissions) return result;
  for (const perm of role.permissions) {
    const [module, action] = perm.name.split(".");
    if (action) {
      if (!result[module]) result[module] = [];
      result[module].push(action);
    }
  }
  return result;
};

const COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-gray-900",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
];

const MODULE_COLUMNS = [
  { key: "driver", label: "Driver Management" },
  { key: "vehicle", label: "Vehicle Management" },
  { key: "rental", label: "Rentals Management" },
  { key: "user", label: "User Management" },
  { key: "role", label: "Roles & Permissions" },
  { key: "finance", label: "Finance Management" },
];

interface RoleTableProps {
  roles: RoleItem[];
  onDelete?: (role: any) => void;
  onExport?: (options: ExportOptions) => void;
}

const roleColumns: ExportColumn[] = [
  { id: "name", label: "Role Name", defaultChecked: true },
  ...MODULE_COLUMNS.map((col) => ({
    id: col.key,
    label: col.label,
    defaultChecked: true,
  })),
];

export const RoleTable = ({ roles, onDelete, onExport }: RoleTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const totalResults = roles.length;

  const mappedRoles: RoleDisplay[] = roles.map((role, i) => ({
    id: role.id,
    name: role.name,
    color: COLORS[i % COLORS.length],
    permissionsByModule: getModulePermissions(role),
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 mt-5 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            Role Management
          </h2>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <span className="material-symbols-outlined text-base">
              download
            </span>
            Export
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-left">
                Role Name
              </th>
              {MODULE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-2 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {mappedRoles.map((role) => (
              <RoleTableRow
                key={role.id}
                role={role}
                onEdit={(r) => {
                  window.location.href = `/dashboard/role/new?id=${r.id}`;
                }}
                onDelete={onDelete}
              />
            ))}
            {mappedRoles.length === 0 && (
              <tr>
                <td
                  colSpan={MODULE_COLUMNS.length + 2}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No roles found
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
        totalRows={totalResults}
        title="Export Role Data"
        description="Generate role and permission reports."
        columns={roleColumns}
      />
    </div>
  );
};

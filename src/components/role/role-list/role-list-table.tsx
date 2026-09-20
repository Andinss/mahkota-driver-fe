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
    const parts = perm.name.split(".");
    const mod = parts[0];
    const action = parts.slice(1).join(".");
    if (action) {
      if (!result[mod]) result[mod] = [];
      result[mod].push(action);
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
  { key: "driver", label: "Drivers" },
  { key: "vehicle", label: "Vehicles" },
  { key: "monitoring", label: "Monitoring" },
  { key: "vendor", label: "Vendor Vehicles" },
  { key: "rental", label: "Rentals" },
  { key: "finance", label: "Finance" },
  { key: "late_payment", label: "Late Payment" },
  { key: "saldo", label: "Driver Saldo" },
  { key: "driver_portal", label: "Driver Portal" },
  { key: "user", label: "Users" },
  { key: "role", label: "Roles" },
  { key: "permission", label: "Permissions" },
  { key: "setting", label: "Settings" },
  { key: "audit", label: "Audit Logs" },
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">admin_panel_settings</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Role Management
            </h2>
            <p className="text-xs text-slate-400">{roles.length} role terdaftar</p>
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
        <table className="w-full text-left border-collapse">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">
                Role Name
              </th>
              {MODULE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-2 py-4 text-center"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {mappedRoles.map((role) => (
              <RoleTableRow
                key={role.id}
                role={role}
                onEdit={(r) => {
                  window.location.href = `/dashboard/roles/new?id=${r.id}`;
                }}
                onDelete={onDelete}
              />
            ))}
            {mappedRoles.length === 0 && (
              <tr>
                <td
                  colSpan={MODULE_COLUMNS.length + 2}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  Tidak ada role ditemukan
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

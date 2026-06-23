"use client";
import { useState } from "react";
import { RoleTableRow } from "./role-list-table-row";
import { ModalExport, ExportOptions, ExportColumn } from "@/components/ui/export";
import type { RoleItem } from "@/lib/types/role";

type PermissionLevel = "full" | "readonly" | "none" | "check";

interface RoleDisplay {
  id: string;
  name: string;
  color: string;
  viewDashboards: PermissionLevel;
  managePayments: PermissionLevel;
  manageDrivers: PermissionLevel;
  assignVehicles: PermissionLevel;
  vehicleRetrieval: PermissionLevel;
  userManagement: PermissionLevel;
}

const getPermissionLevel = (role: RoleItem, module: string): PermissionLevel => {
  const perm = role.permissions?.find((p) => p.module === module);
  if (!perm) return "none";
  const name = perm.name.toLowerCase();
  if (name.includes("full") || name.includes("all")) return "full";
  if (name.includes("read") || name.includes("view")) return "readonly";
  if (name.includes("assign") || name.includes("manage")) return "full";
  return "check";
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

const columns = [
  "Role Name",
  "View Dashboards",
  "Manage Payments",
  "Manage Drivers",
  "Assign Vehicles",
  "Vehicle Retrieval",
  "User Management",
  "Actions",
];

interface RoleTableProps {
  roles: RoleItem[];
  onDelete?: (role: any) => void;
  onExport?: (options: ExportOptions) => void;
}

const roleColumns: ExportColumn[] = [
  { id: "name", label: "Role Name", defaultChecked: true },
  { id: "viewDashboards", label: "View Dashboards", defaultChecked: true },
  { id: "managePayments", label: "Manage Payments", defaultChecked: true },
  { id: "manageDrivers", label: "Manage Drivers", defaultChecked: true },
  { id: "assignVehicles", label: "Assign Vehicles", defaultChecked: true },
  { id: "vehicleRetrieval", label: "Vehicle Retrieval", defaultChecked: true },
  { id: "userManagement", label: "User Management", defaultChecked: true },
];

export const RoleTable = ({ roles, onDelete, onExport }: RoleTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const totalResults = roles.length;

  const mappedRoles: RoleDisplay[] = roles.map((role, i) => ({
    id: role.id,
    name: role.name,
    color: COLORS[i % COLORS.length],
    viewDashboards: getPermissionLevel(role, "dashboard"),
    managePayments: getPermissionLevel(role, "finance"),
    manageDrivers: getPermissionLevel(role, "driver"),
    assignVehicles: getPermissionLevel(role, "vehicle"),
    vehicleRetrieval: getPermissionLevel(role, "rental"),
    userManagement: getPermissionLevel(role, "user"),
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
            <span className="material-symbols-outlined text-base">download</span>
            Export
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 first:text-left text-center"
                >
                  {col}
                </th>
              ))}
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
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
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

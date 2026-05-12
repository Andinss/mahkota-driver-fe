"use client";
import { useState } from "react";
import { RoleTableRow } from "./role-list-table-row";
import { ModalExport, ExportOptions, ExportColumn } from "@/components/ui/export";

const roles = [
  {
    id: "1",
    name: "Owner",
    color: "bg-blue-500",
    viewDashboards:  "full",
    managePayments:  "full",
    manageDrivers:   "full",
    assignVehicles:  "full",
    vehicleRetrieval:"full",
    userManagement:  "full",
  },
  {
    id: "2",
    name: "Finance",
    color: "bg-emerald-500",
    viewDashboards:  "check",
    managePayments:  "full",
    manageDrivers:   "none",
    assignVehicles:  "none",
    vehicleRetrieval:"none",
    userManagement:  "readonly",
  },
  {
    id: "3",
    name: "Supervisor",
    color: "bg-amber-500",
    viewDashboards:  "check",
    managePayments:  "readonly",
    manageDrivers:   "full",
    assignVehicles:  "full",
    vehicleRetrieval:"check",
    userManagement:  "readonly",
  },
  {
    id: "4",
    name: "Field Officer",
    color: "bg-purple-500",
    viewDashboards:  "readonly",
    managePayments:  "none",
    manageDrivers:   "readonly",
    assignVehicles:  "check",
    vehicleRetrieval:"full",
    userManagement:  "none",
  },
  {
    id: "5",
    name: "Administrator",
    color: "bg-gray-900",
    viewDashboards:  "full",
    managePayments:  "full",
    manageDrivers:   "full",
    assignVehicles:  "full",
    vehicleRetrieval:"full",
    userManagement:  "full",
  },
] as const;


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

export const RoleTable = ({ onDelete, onExport }: RoleTableProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const totalResults = roles.length;
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 mt-5 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
         <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Role Management
        </h2>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300">
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
            {roles.map((role) => (
              <RoleTableRow
                key={role.id}
                role={role}
                onEdit={(r) => console.log("Edit", r.name)}
                onDelete={onDelete} 
              />
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
          totalRows={totalResults}
          title="Export Role Data"
          description="Generate role and permission reports."
          columns={roleColumns}
        />
    </div>
  );
};
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import Advice from "@/components/role/new/advice";
import GeneralInformation from "@/components/role/new/general";
import RoleHierarchy from "@/components/role/new/hierarchy";
import Permission, { PermissionItem } from "@/components/role/new/permission";

const initialPermissions: PermissionItem[] = [
  {
    id: "dashboard",
    icon: "dashboard",
    title: "Dashboard View",
    description: "Access to analytics and real-time status updates.",
    iconColor: "text-blue-700",
    iconBg: "bg-blue-100",
    type: "toggle",
    checked: true,
  },
  {
    id: "user-mgmt",
    icon: "group",
    title: "User Management",
    description: "Control access for staff and system operators.",
    iconColor: "text-purple-700",
    iconBg: "bg-purple-100",
    type: "checkbox-group",
    options: [
      { value: "add", label: "Add", checked: false },
      { value: "edit", label: "Edit", checked: false },
      { value: "view", label: "View/Read", checked: false },
      { value: "delete", label: "Delete", checked: false },
      { value: "all", label: "All/Full Access", checked: false },
    ],
  },
  {
    id: "vehicle-mgmt",
    icon: "directions_car",
    title: "Vehicle Management",
    description: "Manage fleet inventory, maintenance, and tracking.",
    iconColor: "text-blue-700",
    iconBg: "bg-blue-100",
    type: "radio-group",
    options: [
      { value: "readonly", label: "Read-only" },
      { value: "full", label: "Full Access", checked: true },
    ],
  },
  {
    id: "rental-ops",
    icon: "event_note",
    title: "Rental Operations",
    description: "Daily workflow for assignments and returns.",
    iconColor: "text-green-700",
    iconBg: "bg-green-100",
    type: "checkbox-pills",
    options: [
      { value: "assign", label: "Assign", checked: true },
      { value: "retrieval", label: "Retrieval", checked: true },
    ],
  },
  {
    id: "financial",
    icon: "payments",
    title: "Financial Reporting",
    description: "View revenue reports, invoices, and payment logs.",
    iconColor: "text-red-700",
    iconBg: "bg-red-100",
    type: "toggle",
    checked: false,
  },
];

const RolePage = () => {
  const [permissions, setPermissions] =
    useState<PermissionItem[]>(initialPermissions);

  return (
    <div className="m-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-8 space-y-6">
          <GeneralInformation />
          <Permission permissions={permissions} onChange={setPermissions} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <RoleHierarchy permissions={permissions} />
          <Advice />
        </div>
      </div>

      <div className="mt-12 mb-8 flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl shadow-lg sticky bottom-8 z-10">
        <div className="hidden sm:block">
          <p className="text-xs text-gray-500">Last saved: Never (Draft)</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors active:opacity-80">
            Cancel
          </button>
          <button className="flex-1 sm:flex-none px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 hover:opacity-90 transition-all active:scale-[0.98]">
            Save Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolePage;

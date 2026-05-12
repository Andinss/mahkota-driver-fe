"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import Advice from "@/components/role/new/advice";
import GeneralInformation from "@/components/role/new/general";
import RoleHierarchy from "@/components/role/new/hierarchy";
import Permission, { PermissionItem } from "@/components/role/new/permission";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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

// MOCK DATA UNTUK EDIT
const mockRoles: Record<string, any> = {
   "1": {  
    id: "1",
    name: "Owner",
    description: "Full access to all system features and settings.",
    permissions: [
      { ...initialPermissions[0], checked: true },  
      { 
        ...initialPermissions[1], 
        options: initialPermissions[1].options?.map(opt => ({ ...opt, checked: true }))
      },
      { 
        ...initialPermissions[2], 
        options: initialPermissions[2].options?.map(opt => ({ ...opt, checked: opt.value === "full" }))
      },
      { 
        ...initialPermissions[3], 
        options: initialPermissions[3].options?.map(opt => ({ ...opt, checked: true }))
      },
      { ...initialPermissions[4], checked: true },
    ]
  },
  "2": {  
    id: "2",
    name: "Finance",
    description: "Manage financial reports and payments.",
    permissions: [
      { ...initialPermissions[0], checked: true }, 
      { 
        ...initialPermissions[1], 
        options: initialPermissions[1].options?.map(opt => ({ 
          ...opt, 
          checked: opt.value === "view" 
        }))
      },
      { 
        ...initialPermissions[2], 
        options: initialPermissions[2].options?.map(opt => ({ 
          ...opt, 
          checked: opt.value === "readonly" 
        }))
      },
      { 
        ...initialPermissions[3], 
        options: initialPermissions[3].options?.map(opt => ({ ...opt, checked: false }))
      },
      { ...initialPermissions[4], checked: true },
    ]
  },
  "3": {  
    id: "3",
    name: "Supervisor",
    description: "Supervise daily operations.",
    permissions: [
      { ...initialPermissions[0], checked: true },  
      { 
        ...initialPermissions[1], 
        options: initialPermissions[1].options?.map(opt => ({ 
          ...opt, 
          checked: opt.value === "view" 
        }))
      },
      { 
        ...initialPermissions[2], 
        options: initialPermissions[2].options?.map(opt => ({ 
          ...opt, 
          checked: opt.value === "full" 
        }))
      },
      { 
        ...initialPermissions[3], 
        options: initialPermissions[3].options?.map(opt => ({ ...opt, checked: true }))
      },
      { ...initialPermissions[4], checked: false },
    ]
  },
  "4": {  
    id: "4",
    name: "Field Officer",
    description: "Field operations and vehicle retrieval.",
    permissions: [
      { ...initialPermissions[0], checked: false },
      { 
        ...initialPermissions[1], 
        options: initialPermissions[1].options?.map(opt => ({ 
          ...opt, 
          checked: false 
        }))
      },
      { 
        ...initialPermissions[2], 
        options: initialPermissions[2].options?.map(opt => ({ 
          ...opt, 
          checked: opt.value === "full" 
        }))
      },
      { 
        ...initialPermissions[3], 
        options: initialPermissions[3].options?.map(opt => ({ ...opt, checked: true }))
      },
      { ...initialPermissions[4], checked: false },
    ]
  },
  "5": {  
    id: "5",
    name: "Administrator",
    description: "System administrator with full access.",
    permissions: [
      { ...initialPermissions[0], checked: true }, 
      { 
        ...initialPermissions[1], 
        options: initialPermissions[1].options?.map(opt => ({ ...opt, checked: true }))
      },
      { 
        ...initialPermissions[2], 
        options: initialPermissions[2].options?.map(opt => ({ ...opt, checked: opt.value === "full" }))
      },
      { 
        ...initialPermissions[3], 
        options: initialPermissions[3].options?.map(opt => ({ ...opt, checked: true }))
      },
      { ...initialPermissions[4], checked: true },
    ]
  },
};

const RoleFormPage = () => {
  const searchParams = useSearchParams();
  const roleIdParam = searchParams.get("id");

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [permissions, setPermissions] = useState<PermissionItem[]>(initialPermissions);
  const [lastSaved, setLastSaved] = useState<string>("Never (Draft)");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Load data when in edit mode
  useEffect(() => {
    if (roleIdParam && mockRoles[roleIdParam]) {
      const role = mockRoles[roleIdParam];
      setMode("edit");
      setRoleName(role.name);
      setRoleDescription(role.description);
      setPermissions(role.permissions);
      setLastSaved("Draft saved");
    } else {
      setMode("add");
      setRoleName("");
      setRoleDescription("");
      setPermissions(initialPermissions);
      setLastSaved("Never (Draft)");
    }
  }, [roleIdParam]);

  


  const handleSaveClick = () => {
    setIsConfirmOpen(true);
  };


  const handleConfirmSave = async () => {
    setIsSubmitting(true);
    setIsConfirmOpen(false);    

    const roleData = {
      id: roleIdParam || undefined,
      name: roleName,
      description: roleDescription,
      permissions: permissions,
    };

    console.log("Role Data:", roleData);
    console.log("roleName value:", roleName);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    const action = mode === "edit" ? "updated" : "registered";
     const roleNameForRedirect = roleName || "New Role";

    window.location.href = `/dashboard/role?success=${action}&role=${encodeURIComponent(roleNameForRedirect)}`;
  };


  const handleCancel = () => {
      window.location.href = "/dashboard/role";
  };

  return (
    <div className="m-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        <div className="lg:col-span-8 space-y-6">
          <GeneralInformation 
            roleName={roleName}
            setRoleName={setRoleName}
            roleDescription={roleDescription}
            setRoleDescription={setRoleDescription}
          />
          <Permission permissions={permissions} onChange={setPermissions} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <RoleHierarchy permissions={permissions} />
          <Advice />
        </div>
      </div>

      <div className="mt-12 mb-8 flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl shadow-lg sticky bottom-8 z-10">
        <div className="hidden sm:block">
          <p className="text-xs text-gray-500">Last saved: {lastSaved}</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors active:opacity-80 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">
              {mode === "add" ? "add" : "save"}
            </span>
            {isSubmitting ? "Saving..." : mode === "add" ? "Create Role" : "Update Role"}
          </button>
        </div>
      </div>
      {/* confirm dialog */}
             <ConfirmDialog
              isOpen={isConfirmOpen}
              onClose={() => setIsConfirmOpen(false)}
              onConfirm={handleConfirmSave}
              title={mode === "add" ? "Confirm Registration" : "Confirm Update"}
              message={
              mode === "add"
                          ? `Are you sure you want to create this role? Please review all information carefully. This action cannot be undone.`
                          : `Are you sure you want to update this role? Please review all information carefully.`
                          }
              confirmText={mode === "add" ? "Yes, Create Role" : "Yes, Update Role"}
              cancelText="Review Again"
              variant="info"
            />
    </div>
  );
};

export default RoleFormPage;

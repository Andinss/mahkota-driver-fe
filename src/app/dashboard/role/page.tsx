"use client";
import { PageHeader } from "@/components/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RoleCard } from "@/components/role/role-list/card";
import { RoleBanner } from "@/components/role/role-list/role-banner";
import { RoleTable } from "@/components/role/role-list/role-list-table";
import { useState } from "react";



const RolePage = () => {

  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const handleDeleteClick = (role: any) => {
    setSelectedRole(role);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleted role:", selectedRole);
     alert(`Role ${selectedRole?.name} deleted successfully!`);
    setIsConfirmDeleteOpen(false);
    setSelectedRole(null);
  };

  return (
    <div className="m-8">
      <PageHeader
        title="Role Management"
        description="Manage roles and permissions for users in the system."
        buttonText="Add New Role"
        buttonHref="/dashboard/role/new"
      />

      {/* table */}
      <RoleTable onDelete={handleDeleteClick} />

      <div className="mt-12 grid grid-cols-12 gap-6">
        {/*banner biru */}
        <div className="col-span-12 lg:col-span-7">
          <RoleBanner />
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* card */}
          <RoleCard
            title="Total Users"
            value="1,284"
            icon="group"
            iconColor="text-slate-600"
            trend={{
              value: "+12%",
              color: "text-emerald-500",
              icon: "trending_up",
            }}
          />

          <RoleCard
            title="Active Roles"
            value="5"
            icon="verified_user"
            iconColor="text-blue-600"
            progressBar={{
              percentage: 84,
              label: "Utilization Capacity 84%",
            }}
          />
        </div>
      </div>
      <ConfirmDialog
      isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        message={`Are you sure you want to delete ${selectedRole?.name}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
export default RolePage;

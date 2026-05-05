"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AddUserForm, UserFormData } from "@/components/user/new/add-user-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import CardUser from "@/components/user/new/card-user";

const mockUsers: Record<string, any> = {
  "1": {
    id: "1",
    fullname: "John Doe",
    email: "john.doe@example.com",
    phone: "081234567890",
    role: "administrator",
    isActive: true,
    avatar: "https://i.pravatar.cc/150?u=john", 
  },
  "2": {
    id: "2",
    fullname: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "081298765432",
    role: "fleet_manager",
    isActive: false,
    avatar: "https://i.pravatar.cc/150?u=jane",
  },
  "3": {
    id: "3",
    fullname: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "081298765432",
    role: "fleet_manager",
    isActive: false,
   avatar: "https://i.pravatar.cc/150?u=bob",
  },
};


export default function AddNewUserPage() {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("id");

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<UserFormData | undefined>();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<UserFormData | null>(null);

  useEffect(() => {
    if (userIdParam && mockUsers[userIdParam]) {
      const user = mockUsers[userIdParam];
      setMode("edit");
      setInitialData({
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        avatar: user.avatar,
      });
    } else {
      setMode("add");
      setInitialData(undefined);
    }
  }, [userIdParam]);

   const handleSubmit = (data: UserFormData) => {
    setPendingData(data);
    setIsConfirmOpen(true);
   };

   const handleConfirmSubmit = async () => {
    if (!pendingData) return;

    setIsSubmitting(true);
    setIsConfirmOpen(false);

    console.log("User Data:", pendingData);

    // if (mode === "edit") {
    //   console.log("Updating user:", userIdParam);
    //   alert(`User ${pendingData.fullname} updated successfully`);
    // } else {
    //   console.log("creating new user");
    //   alert(`User ${pendingData.fullname} created successfully`);
    // }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

      const action = mode === "edit" ? "updated" : "registered";
      const userName = pendingData?.fullname || "New User";

    window.location.href = `/dashboard/users?success=${action}&user=${encodeURIComponent(userName)}`;
   };
   const handleCancel = () => {
    window.location.href = "/dashboard/users";
   };

   const handleSaveDraft = () => {
    console.log("Save draft:", initialData);
    alert("Draft saved!");
   };
  
  return (
    <div className="p-8">
      <AddUserForm
        mode={mode}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        isSubmitting={isSubmitting}
      />
      <CardUser />

      {/* confirm dialog */}
       <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        title={mode === "add" ? "Confirm Registration" : "Confirm Update"}
        message={
          mode === "add"
            ? `Are you sure you want to create this user? Please review all information carefully. This action cannot be undone.`
            : `Are you sure you want to update this user? Please review all information carefully.`
        }
        confirmText={mode === "add" ? "Yes, Create User" : "Yes, Update User"}
        cancelText="Review Again"
        variant="info"
      />
    </div>
  );
}

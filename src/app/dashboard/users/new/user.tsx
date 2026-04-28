"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AddUserForm, UserFormData } from "@/components/user/new/add-user-form";
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

   const handleSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);

     console.log("User Data:", data);

    if (mode === "edit") {
      console.log("Updating user:", userIdParam);
      alert(`User ${data.fullname} updated successfully!`);
    } else {
      console.log("Creating new user");
      alert(`User ${data.fullname} created successfully!`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    window.location.href = "/dashboard/users";
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel?")) {
      window.location.href = "/dashboard/users";
    }
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
    </div>
  );
}

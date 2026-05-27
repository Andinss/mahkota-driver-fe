"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AddUserForm, UserFormData } from "@/components/user/new/add-user-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import CardUser from "@/components/user/new/card-user";
import { usersApi } from "@/lib/api/users";

export default function AddNewUserPage() {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("id");

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<UserFormData | undefined>();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<UserFormData | null>(null);

  useEffect(() => {
    if (userIdParam) {
      setMode("edit");
      usersApi
        .getById(userIdParam)
        .then((res) => {
          const u = res.data;
          setInitialData({
            username: u.name,
            email: u.email,
            phone: u.phone || "",
            role: u.role.name.toLowerCase(),
            isActive: u.status === "active",
            avatar: u.avatar,
          });
        })
        .catch(() => {
          setMode("add");
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

    try {
      const payload = {
        name: pendingData.username,
        email: pendingData.email,
        phone: pendingData.phone,
        role: pendingData.role,
        isActive: pendingData.isActive,
        avatar: pendingData.avatar,
      };

      if (mode === "edit" && userIdParam) {
        await usersApi.update(userIdParam, payload);
      } else {
        await usersApi.create(payload);
      }

      const action = mode === "edit" ? "updated" : "registered";
      const userName = pendingData?.username || "New User";
      window.location.href = `/dashboard/users?success=${action}&user=${encodeURIComponent(userName)}`;
    } catch {
      alert("Failed to save user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "/dashboard/users";
  };

  const handleSaveDraft = () => {
    console.log("Save draft:", initialData);
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

"use client";

import { useState } from "react";
import { AddUserForm, UserFormData } from "@/components/user/add-user-form";
import CardUser from "@/components/user/card-user";

export default function AddNewUserPage() {
  const [formData, setFormData] = useState<UserFormData | null>(null);

  const handleNext = (data: UserFormData) => {
    setFormData(data);
    console.log("User data submitted:", data);
    alert(`User ${data.fullname} created successfully!`);
  };

  const handleCancel = () => {
    console.log("Cancel registration");
  };

  const handleSaveDraft = () => {
    console.log("Save draft:", formData);
    alert("Draft saved!");
  };

  return (
    <div className="p-8">
      <AddUserForm onNext={handleNext} onCancel={handleCancel} onSaveDraft={handleSaveDraft} />
      <CardUser />
    </div>
  );
}
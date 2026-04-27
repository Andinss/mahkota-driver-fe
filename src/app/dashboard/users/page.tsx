"use client";
import { PageHeader } from "@/components/page-header";
import SearchBar from "@/components/user/dashboard/search-bar-user";
import { UserTable } from "@/components/user/dashboard/table-user";

const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "081234567890",
    avatar: "https://i.pravatar.cc/150?u=john",
    role: {
      name: "Administrator",
    },
    status: "active" as const,
    
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "081298765432",
    avatar: "https://i.pravatar.cc/150?u=jane",
    role: {
      name: "Fleet Manager",
    },
    status: "inactive" as const,
  },
];

export default function UserList() {
  return (
    <div className="m-8">
      <PageHeader
        title="User List Overview"
        description="Monitor active rentals, handle pending and late payments, and review daily completed transactions."
        buttonText="Add New User"
        buttonHref="/dashboard/users/new"
      />
      <SearchBar />
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <UserTable users={users} />
      </div>
    </div>
  );
}

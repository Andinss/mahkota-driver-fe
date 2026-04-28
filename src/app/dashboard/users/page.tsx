"use client";
import { PageHeader } from "@/components/page-header";
import SearchBar from "@/components/user/dashboard/search-bar-user";
import { UserTable } from "@/components/user/dashboard/table-user";
import { ExportOptions } from "@/components/ui/export";

const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?u=john",
    role: {
      name: "Administrator",
    },
    status: "active" as const,
    lastLogin: {
      date: "2023-10-01",
      time: "10:30 AM",
    },
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://i.pravatar.cc/150?u=jane",
    role: {
      name: "Fleet Manager",
    },
    status: "inactive" as const,
    lastLogin: {
      date: "2023-09-28",
      time: "02:15 PM",
    },
  },
];

export default function UserList() {
  const handleExport = (options: ExportOptions) => {
    console.log("Export options from user page:", options);
    alert(`Exporting user data as ${options.format} with ${options.type} data`);
  };

  return (
    <div className="m-8">
      <PageHeader
        title="User List Overview"
        description="Monitor active rentals, handle pending and late payments, and review daily completed transactions."
        buttonText="Add New User"
        buttonHref="/dashboard/users/new"
      />
      <SearchBar />
      <UserTable 
        users={users} 
        onExport={handleExport}
      />
    </div>
  );
}
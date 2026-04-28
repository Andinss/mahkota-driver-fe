"use client";
import { PageHeader } from "@/components/page-header";
import SearchBar from "@/components/user/dashboard/search-bar-user";
import { UserTable } from "@/components/user/dashboard/table-user";
import { UserPagination } from "@/components/user/dashboard/user-pagination";
import { useState } from "react";

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
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?u=bob",
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Calculate pagination values
  const totalResults = users.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Get current page users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <UserTable users={currentUsers} />
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          resultsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

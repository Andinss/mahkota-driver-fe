"use client";
import { PageHeader } from "@/components/page-header";
import { AlertDialog } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ExportOptions } from "@/components/ui/export";
import SearchBar from "@/components/user/dashboard/search-bar-user";
import { UserTable } from "@/components/user/dashboard/table-user";
import { UserPagination } from "@/components/user/dashboard/user-pagination";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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
  const handleExport = (options: ExportOptions) => {
    console.log("Export options from user page:", options);
    alert(`Exporting user data as ${options.format} with ${options.type} data`);
  };

  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // State confirm delete
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Tampilkan alert jika ada success param di URL
  useEffect(() => {
    const success = searchParams.get("success");
    const user = searchParams.get("user");

    if (success && user) {
      const action = success === "updated" ? "Updated" : "Registration";
      setAlertTitle(`${action} Successsful`);
      setAlertMessage(
        `User ${decodeURIComponent(user)} has been ${success} successfully.`,
      );
      setAlertType("success");
      setIsAlertOpen(true);

      window.history.replaceState({}, "", "/dashboard/users");
    }
  }, [searchParams]);

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

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleted user:", selectedUser);
    setIsConfirmDeleteOpen(false);
    setAlertTitle("Delete Succesful");
    setAlertMessage(`User ${selectedUser?.name} has been deleted successfully`);
    setAlertType("success");
    setIsAlertOpen(true);
    setSelectedUser(null);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
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
        <UserTable
          users={currentUsers}
          onDelete={handleDeleteClick}
          onExport={handleExport}
        />
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          resultsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        confirmText="OK"
      />
    </div>
  );
}

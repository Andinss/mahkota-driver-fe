"use client";
import { PageHeader } from "@/components/page-header";
import { AlertDialog } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ExportOptions } from "@/components/ui/export";
import SearchBar from "@/components/user/dashboard/search-bar-user";
import type { UserFilters } from "@/components/user/dashboard/search-bar-user";
import { UserTable } from "@/components/user/dashboard/table-user";
import { UserPagination } from "@/components/user/dashboard/user-pagination";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { usersApi } from "@/lib/api/users";
import type { UserItem } from "@/lib/types/user";

export default function UserList() {
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "",
    status: "",
  });

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  useEffect(() => {
    const success = searchParams.get("success");
    const user = searchParams.get("user");

    if (success && user) {
      const action = success === "updated" ? "Updated" : "Registration";
      setAlertTitle(`${action} Successful`);
      setAlertMessage(
        `User ${decodeURIComponent(user)} has been ${success} successfully.`,
      );
      setAlertType("success");
      setIsAlertOpen(true);

      window.history.replaceState({}, "", "/dashboard/users");
    }
  }, [searchParams]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await usersApi.getList({
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search || undefined,
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setUsers(data);
      setTotalPages(1);
      setTotalResults(data.length);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (user: UserItem) => {
    setSelectedUser(user);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await usersApi.delete(selectedUser.id);
      setAlertTitle("Delete Successful");
      setAlertMessage(`User ${selectedUser.username} has been deleted successfully`);
      setAlertType("success");
      setIsAlertOpen(true);
      fetchUsers();
    } catch {
      setAlertTitle("Delete Failed");
      setAlertMessage("Failed to delete user. Please try again.");
      setAlertType("error");
      setIsAlertOpen(true);
    }
    setIsConfirmDeleteOpen(false);
    setSelectedUser(null);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

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
      <SearchBar filters={filters} onFilterChange={handleFilterChange} />
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading users...</div>
        ) : (
          <>
            <UserTable
              users={users}
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
          </>
        )}
      </div>
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.username}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />

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

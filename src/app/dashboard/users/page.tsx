"use client";
import { PageHeader } from "@/components/page-header";
import { confirmToast, toastSuccess, toastError } from "@/components/ui/toast-provider";
import { ExportOptions } from "@/components/ui/export";
import SearchBar from "@/components/user/dashboard/search-bar-user";
import type { UserFilters } from "@/components/user/dashboard/search-bar-user";
import { UserTable } from "@/components/user/dashboard/table-user";
import { Pagination } from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { usersApi } from "@/lib/api/users";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { PermissionGuard } from "@/components/auth-guard-permission";

interface UserDisplay {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  role?: string;
}

export default function UserList() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<UserDisplay[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "",
    status: "",
  });

  const toastShownRef = useRef(false);

  useEffect(() => {
    const success = searchParams.get("success");
    const user = searchParams.get("user");

    if (success && user && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Updated" : "Registration";
      toastSuccess(
        `${action} Successful: User ${decodeURIComponent(user)} has been ${success} successfully.`,
      );

      window.history.replaceState({}, "", "/dashboard/users");
    }
  }, [searchParams]);

  const fetchUsers = useCallback(async () => {
    if (!canAccess(user?.permissions, 'user.read')) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await usersApi.getList({
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search || undefined,
      });

      const items = Array.isArray(res.data) ? res.data : [];
      const mapped = items.map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        is_active: u.is_active,
        role: u.role?.name || "",
      }));
      setUsers(mapped);
      if (res.meta) {
        setTotalResults(res.meta.total);
        setTotalPages(res.meta.totalPages);
      } else {
        setTotalResults(mapped.length);
        setTotalPages(1);
      }
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, filters]);

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

  const handleDeleteClick = async (user: UserDisplay) => {
    const confirmed = await confirmToast({
      title: "Delete User",
      message: `Are you sure you want to delete ${user.username}? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      variant: "danger",
    });
    if (confirmed) {
      try {
        await usersApi.delete(user.id);
        toastSuccess(`User ${user.username} has been deleted successfully`);
        fetchUsers();
      } catch {
        toastError("Failed to delete user. Please try again.");
      }
    }
  };


  const handleExport = async (options: ExportOptions) => {
    const params: Record<string, string | number | undefined> = {
      format: options.format,
      columns: options.columns.join(","),
      type: options.type,
    };
    if (options.type === "filtered") {
      if (filters.search) params.search = filters.search;
    }
    await usersApi.exportData(params);
  };

  return (
    <PermissionGuard permission="user.read">
    <div className="m-8">
      <PageHeader
        title="User List Overview"
        description="Monitor active rentals, handle pending and late payments, and review daily completed transactions."
        buttonText={canAccess(user?.permissions, "user.create") ? "Add New User" : undefined}
        buttonHref={canAccess(user?.permissions, "user.create") ? "/dashboard/users/new" : undefined}
      />
      <SearchBar filters={filters} onFilterChange={handleFilterChange} />
      <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading users...</div>
        ) : (
          <>
            <UserTable
              users={users}
              onDelete={handleDeleteClick}
              onExport={handleExport}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              resultsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onPageSizeChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
            />
          </>
        )}
      </div>

    </div>
    </PermissionGuard>
  );
}

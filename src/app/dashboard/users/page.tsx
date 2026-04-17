"use client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/user/dashboard/table-user";
import Link from "next/link";

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
  return (
    <div className="m-8">
      <PageHeader
        title="User List Overview"
        description="Monitor active rentals, handle pending and late payments, and review daily completed transactions."
        buttonText="Add New User"
        buttonHref="/dashboard/users/new"
      />

      <div className="flex-1 overflow-y-auto mt-5">
        <div className="flex flex-wrap items-end gap-4 mb-6 bg-white dark:bg-[#111418] p-4 rounded-xl border border-[#dbe0e6] dark:border-gray-800 shadow-sm">
          <label className="flex flex-col min-w-64 flex-1">
            <p className="text-[#111418] dark:text-gray-300 text-sm font-semibold leading-normal pb-2">
              Search Users
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#617589]">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  search
                </span>
              </span>
              <input
                className="w-full rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#111418] dark:text-white h-11 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-[#617589]"
                placeholder="Search by name, email, or ID..."
                defaultValue=""
              />
            </div>
          </label>
          <label className="flex flex-col w-48">
            <p className="text-[#111418] dark:text-gray-300 text-sm font-semibold leading-normal pb-2">
              Role
            </p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#111418] dark:text-white h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
                <option value="">All Roles</option>
                <option value="admin">Administrator</option>
                <option value="manager">Fleet Manager</option>
                <option value="staff">Staff</option>
                <option value="driver">Driver</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#617589]">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  expand_more
                </span>
              </span>
            </div>
          </label>
          <label className="flex flex-col w-48">
            <p className="text-[#111418] dark:text-gray-300 text-sm font-semibold leading-normal pb-2">
              Status
            </p>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 text-[#111418] dark:text-white h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="locked">Locked</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#617589]">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  expand_more
                </span>
              </span>
            </div>
          </label>
          <Link href="/dashboard/role">
            <Button variant="outline">Roles and Permission</Button>
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <UserTable users={users} />
      </div>
    </div>
  );
}

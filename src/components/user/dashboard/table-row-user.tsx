"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";

interface User {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  role?: string;
}

interface UserTableRowProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onResetPassword?: (user: User) => void;
}

export const UserTableRow = ({
  user,
  onEdit,
  onDelete,
  onResetPassword,
}: UserTableRowProps) => {
  const { user: currentUser } = useAuth();
  const perms = currentUser?.permissions;

  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4 align-middle">
        <input
          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 h-4 w-4"
          type="checkbox"
        />
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-cover bg-center overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700">
            <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-xs font-medium text-slate-600 dark:text-slate-400">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{user.username}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <Badge
          variant={
            ["admin", "owner", "administrator"].includes((user.role || "").toLowerCase())
              ? "danger"
              : ["finance", "supervisor", "fleet manager"].includes((user.role || "").toLowerCase())
                ? "info"
                : "neutral"
          }
          dot
        >
          {user.role || "-"}
        </Badge>
      </td>
      <td className="px-6 py-4 align-middle">
        <Badge variant={user.is_active ? "success" : "neutral"}>
          {user.is_active ? "Active" : "Inactive"}
        </Badge>
      </td>
      <td className="px-6 py-4 align-middle text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">
                more_vert
              </span>
            </button>
          }
        >
          {canAccess(perms, "user.update") && (
            <Link href={`/dashboard/users/new?id=${user.id}`}>
              <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
            </Link>
          )}
          {canAccess(perms, "user.delete") && (
            <DropdownMenuItem
              icon="delete"
              danger
              onClick={() => onDelete?.(user)}
            >
              Delete
            </DropdownMenuItem>
          )}
          <Link href={`/dashboard/users/detail?id=${user.id}`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>
        </Dropdown>
      </td>
    </tr>
  );
};

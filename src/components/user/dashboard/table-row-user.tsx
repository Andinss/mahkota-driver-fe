import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

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
  return (
    <tr className="group hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6 align-middle">
        <input
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
          type="checkbox"
        />
      </td>

      <td className="py-4 px-6 align-middle">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-cover bg-center overflow-hidden shrink-0 bg-gray-200">
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-xs font-medium text-gray-600">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{user.username}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>

      <td className="py-4 px-6 align-middle">
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

      <td className="py-4 px-6 align-middle">
        <Badge variant={user.is_active ? "success" : "neutral"}>
          {user.is_active ? "Active" : "Inactive"}
        </Badge>
      </td>

      <td className="py-4 px-6 align-middle text-right">
        <Dropdown
          trigger={
            <button className="text-[#617589] hover:text-[#111418] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/users/new?id=${user.id}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            icon="delete"
            danger
            onClick={() => onDelete?.(user)}
          >
            Delete
          </DropdownMenuItem>
          <Link href={`/dashboard/users/detail/`}>
            <DropdownMenuItem icon="visibility">Details</DropdownMenuItem>
          </Link>
        </Dropdown>
      </td>
    </tr>
  );
};

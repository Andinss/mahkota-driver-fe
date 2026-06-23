import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

interface Role {
  id: string;
  name: string;
  color: string;
  permissionsByModule: Record<string, string[]>;
}

interface RoleTableRowProps {
  role: Role;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
}

const MODULES = ["driver", "vehicle", "rental", "user", "role", "finance"];
const ALL_ACTIONS = ["create", "read", "update", "delete"];

const ACTION_LABELS: Record<string, string> = {
  create: "CREATE",
  read: "VIEW",
  update: "EDIT",
  delete: "DELETE",
};

function PermissionCell({ actions }: { actions: string[] }) {
  const hasAll = actions.length > 0 && ALL_ACTIONS.every((a) => actions.includes(a));
  const hasRead = actions.length === 1 && actions[0] === "read";

  if (hasAll) {
    return (
      <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
        FULL ACCESS
      </span>
    );
  }

  if (hasRead) {
    return (
      <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-tight">
        READ ONLY
      </span>
    );
  }

  if (actions.length === 0) {
    return (
      <span className="inline-block px-2 py-1 rounded bg-gray-50 text-gray-300 text-[10px] font-bold uppercase tracking-tight">
        NO ACCESS
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {actions.sort().map((action) => (
        <span
          key={action}
          className="inline-block px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold"
        >
          {ACTION_LABELS[action] || action.toUpperCase()}
        </span>
      ))}
    </div>
  );
}

export const RoleTableRow = ({ role, onEdit, onDelete }: RoleTableRowProps) => {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full shrink-0 ${role.color}`} />
          <span className="font-bold text-gray-900">{role.name}</span>
        </div>
      </td>

      {MODULES.map((module) => (
        <td key={module} className="px-2 py-5 text-center">
          <PermissionCell actions={role.permissionsByModule[module] || []} />
        </td>
      ))}

      <td className="py-4 px-6 text-right">
        <Dropdown
          trigger={
            <button className="text-[#617589] hover:text-[#111418] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/role/new?id=${role.id}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            icon="delete"
            danger
            onClick={() => onDelete?.(role)}
          >
            Delete
          </DropdownMenuItem>
        </Dropdown>
      </td>
    </tr>
  );
};

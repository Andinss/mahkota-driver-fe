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

const MODULES = ["driver", "vehicle", "monitoring", "vendor", "rental", "finance", "late_payment", "saldo", "user", "role", "permission", "setting", "audit"];
const ALL_ACTIONS = ["create", "read", "update", "delete"];

function formatAction(action: string): string {
  const parts = action.split(".");
  const base = parts[0];
  const scope = parts.slice(1).join(".");

  const labelMap: Record<string, string> = {
    create: "CREATE",
    read: "VIEW",
    update: "EDIT",
    delete: "DELETE",
    approve: "APPROVE",
    reject: "REJECT",
    activate: "ACTIVATE",
    assign_vehicle: "ASSIGN VEHICLE",
    assign_permissions: "ASSIGN PERMS",
    manage_role: "MANAGE ROLE",
    change_status: "CHANGE STATUS",
  };

  let label = labelMap[base] || base.replace(/_/g, " ").toUpperCase();

  if (scope === "own") label = `${label} (OWN)`;
  else if (scope === "all") label = `${label} (ALL)`;
  else if (scope) label = `${label} ${scope.replace(/_/g, " ").toUpperCase()}`;

  return label;
}

function PermissionCell({ actions }: { actions: string[] }) {
  const baseActions = actions.map((a) => a.split(".")[0]);
  const hasAll = actions.length > 0 && ALL_ACTIONS.every((a) => baseActions.includes(a));
  const hasRead = actions.length === 1 && baseActions[0] === "read";

  if (hasAll) {
    return (
      <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-tight">
        FULL ACCESS
      </span>
    );
  }

  if (hasRead) {
    return (
      <span className="inline-block px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-tight">
        READ ONLY
      </span>
    );
  }

  if (actions.length === 0) {
    return (
      <span className="inline-block px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 text-[10px] font-bold uppercase tracking-tight">
        NO ACCESS
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {actions.sort().map((action) => (
        <span
          key={action}
          className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold whitespace-nowrap"
        >
          {formatAction(action)}
        </span>
      ))}
    </div>
  );
}

export const RoleTableRow = ({ role, onEdit, onDelete }: RoleTableRowProps) => {
  return (
    <tr className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full shrink-0 ${role.color}`} />
          <span className="font-bold text-slate-900 dark:text-white">{role.name}</span>
        </div>
      </td>
      {MODULES.map((module) => (
        <td key={module} className="px-2 py-5 text-center">
          <PermissionCell actions={role.permissionsByModule[module] || []} />
        </td>
      ))}
      <td className="px-6 py-5 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">
                more_vert
              </span>
            </button>
          }
        >
          <Link href={`/dashboard/roles/new?id=${role.id}`}>
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

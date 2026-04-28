import Link from "next/link";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

type PermissionLevel = "full" | "readonly" | "none" | "check";

interface Role {
  id: string;
  name: string;
  color: string;
  viewDashboards: PermissionLevel;
  managePayments: PermissionLevel;
  manageDrivers: PermissionLevel;
  assignVehicles: PermissionLevel;
  vehicleRetrieval: PermissionLevel;
  userManagement: PermissionLevel;
}

interface RoleTableRowProps {
  role: Role;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
  onDetails?: (role: Role) => void;
}

function PermissionCell({ level }: { level: PermissionLevel }) {
  if (level === "full")
    return (
      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-tight">
        Full Access
      </span>
    );
  if (level === "readonly")
    return (
      <span className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-tight">
        Read Only
      </span>
    );
  if (level === "check")
    return (
      <span className="material-symbols-outlined text-emerald-500 font-bold">
        check_circle
      </span>
    );
  return (
    <span className="material-symbols-outlined text-gray-300">
      do_not_disturb_on
    </span>
  );
}

export const RoleTableRow = ({
  role,
  onEdit,
  onDelete,
  onDetails,
}: RoleTableRowProps) => {
  const permissions: { label: string; value: PermissionLevel }[] = [
    { label: "viewDashboards",   value: role.viewDashboards   },
    { label: "managePayments",   value: role.managePayments   },
    { label: "manageDrivers",    value: role.manageDrivers    },
    { label: "assignVehicles",   value: role.assignVehicles   },
    { label: "vehicleRetrieval", value: role.vehicleRetrieval },
    { label: "userManagement",   value: role.userManagement   },
  ];

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">

      {/* Role Name + dot warna */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full shrink-0 ${role.color}`} />
          <span className="font-bold text-gray-900">
            {role.name}
          </span>
        </div>
      </td>

      {/* 6 kolom permission */}
      {permissions.map(({ label, value }) => (
        <td key={label} className="px-2 py-5 text-center">
          <PermissionCell level={value} />
        </td>
      ))}

      {/* Dropdown actions */}
      <td className="py-4 px-6 text-right">
        <Dropdown
          trigger={
            <button className="text-[#617589] hover:text-[#111418] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          }
        >
          <Link href={`/dashboard/role/new?id=${role.id}`}>
            <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuItem icon="delete" danger onClick={() => onDelete?.(role)}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem icon="visibility" onClick={() => onDetails?.(role)}>
            Details
          </DropdownMenuItem>
        </Dropdown>
      </td>

    </tr>
  );
};
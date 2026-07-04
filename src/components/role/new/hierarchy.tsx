import type { PermissionItem } from "@/lib/types/permission";

function formatActionLabel(name: string): string {
  const parts = name.split(".");
  const action = parts[1] || "";
  const scope = parts[2] || "";

  let label = action.replace(/_/g, " ");
  label = label.charAt(0).toUpperCase() + label.slice(1);

  if (scope === "own") return `${label} (Own)`;
  if (scope === "all") return `${label} (All)`;
  if (scope) {
    const scopeLabel = scope.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return `${label} ${scopeLabel}`;
  }

  return label;
}

const moduleLabels: Record<string, string> = {
  user: "User",
  role: "Role",
  permission: "Permission",
  driver: "Driver",
  vehicle: "Vehicle",
  finance: "Finance",
  rental: "Rental",
  late_payment: "Late Payment",
  monitoring: "Monitoring",
};

interface RoleHierarchyProps {
  allPermissions: PermissionItem[];
  selectedIds: string[];
}

const RoleHierarchy = ({ allPermissions, selectedIds }: RoleHierarchyProps) => {
  const selectedPermissions = allPermissions.filter((p) =>
    selectedIds.includes(p.id)
  );

  const previewItems = selectedPermissions.length > 0
    ? selectedPermissions.map((p) => ({
        text: `Can ${formatActionLabel(p.name)} ${moduleLabels[p.module] || p.module}`,
        allowed: true,
      }))
    : [{ text: "No permissions selected yet", allowed: false }];

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
      <h3 className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined">info</span>
        Role Hierarchy
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        Roles determine the visibility of data. A higher hierarchy role can
        manage users in roles below them.
      </p>
      <div className="p-4 bg-white dark:bg-[#1a2632] rounded-lg border border-blue-100 dark:border-blue-900">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            Previewing Permissions
          </span>
        </div>
        <ul className="space-y-2">
          {previewItems.map((preview, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  preview.allowed ? "text-green-600" : "text-red-600"
                }`}
              >
                {preview.allowed ? "check_circle" : "cancel"}
              </span>
              {preview.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoleHierarchy;

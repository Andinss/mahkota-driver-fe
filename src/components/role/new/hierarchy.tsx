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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">account_tree</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Role Hierarchy
          </h3>
          <p className="text-xs text-slate-400">Roles determine the visibility of data</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        Roles determine the visibility of data. A higher hierarchy role can
        manage users in roles below them.
      </p>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
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
                className={`material-symbols-outlined text-base ${
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

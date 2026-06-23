"use client";

import type { PermissionItem as ApiPermission } from "@/lib/types/permission";

interface ModuleGroup {
  module: string;
  permissions: ApiPermission[];
}

interface PermissionListProps {
  allPermissions: ApiPermission[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

function groupByModule(permissions: ApiPermission[]): ModuleGroup[] {
  const map = new Map<string, ApiPermission[]>();
  const moduleOrder = ["user", "role", "permission", "driver", "vehicle", "finance", "rental"];

  permissions.forEach((perm) => {
    const list = map.get(perm.module) || [];
    list.push(perm);
    map.set(perm.module, list);
  });

  return moduleOrder
    .filter((m) => map.has(m))
    .map((module) => ({
      module,
      permissions: map.get(module)!.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

const moduleIcons: Record<string, string> = {
  user: "people",
  role: "shield",
  permission: "lock",
  driver: "badge",
  vehicle: "directions_car",
  finance: "finance",
  rental: "contract",
};

const moduleLabels: Record<string, string> = {
  user: "User",
  role: "Role",
  permission: "Permission",
  driver: "Driver",
  vehicle: "Vehicle",
  finance: "Finance",
  rental: "Rental",
};

export function PermissionList({
  allPermissions,
  selectedIds,
  onChange,
}: PermissionListProps) {
  const groups = groupByModule(allPermissions);

  const togglePermission = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    onChange(next);
  };

  const toggleModule = (module: string, checked: boolean) => {
    const group = groups.find((g) => g.module === module);
    if (!group) return;

    const moduleIds = group.permissions.map((p) => p.id);
    const next = checked
      ? [...new Set([...selectedIds, ...moduleIds])]
      : selectedIds.filter((id) => !moduleIds.includes(id));
    onChange(next);
  };

  const isModuleChecked = (module: string) => {
    const group = groups.find((g) => g.module === module);
    if (!group) return false;
    return group.permissions.every((p) => selectedIds.includes(p.id));
  };

  const isModulePartiallyChecked = (module: string) => {
    const group = groups.find((g) => g.module === module);
    if (!group) return false;
    const checked = group.permissions.filter((p) => selectedIds.includes(p.id));
    return checked.length > 0 && checked.length < group.permissions.length;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">
            rule_settings
          </span>
          Permissions Configuration
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Define which modules and actions this role can access.
        </p>
      </div>
      <div className="divide-y divide-gray-200">
        {groups.map((group) => (
          <div key={group.module} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                  <span className="material-symbols-outlined">
                    {moduleIcons[group.module] || "settings"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 capitalize">
                    {moduleLabels[group.module] || group.module} Management
                  </p>
                  <p className="text-xs text-gray-500">
                    {group.permissions.length} permission
                    {group.permissions.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-medium text-gray-500">
                  {isModuleChecked(group.module) ? "All" : "Select All"}
                </span>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  checked={isModuleChecked(group.module)}
                  ref={(el) => {
                    if (el) el.indeterminate = isModulePartiallyChecked(group.module);
                  }}
                  onChange={(e) => toggleModule(group.module, e.target.checked)}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-13">
              {group.permissions.map((perm) => {
                const action = perm.name.split(".")[1] || perm.name;
                return (
                  <label
                    key={perm.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedIds.includes(perm.id)
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      checked={selectedIds.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                    />
                    <span className="text-sm font-medium capitalize">
                      {action}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

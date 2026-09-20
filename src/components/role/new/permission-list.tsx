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

function groupByModule(permissions: ApiPermission[]): ModuleGroup[] {
  const map = new Map<string, ApiPermission[]>();
  const moduleOrder = ["driver", "vehicle", "monitoring", "vendor", "rental", "finance", "late_payment", "saldo", "driver_portal", "user", "role", "permission", "setting", "audit"];

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
  driver: "badge",
  vehicle: "directions_car",
  monitoring: "monitoring",
  vendor: "storefront",
  rental: "contract",
  finance: "account_balance",
  late_payment: "payments",
  saldo: "account_balance_wallet",
  driver_portal: "mobile_screen_share",
  user: "people",
  role: "shield",
  permission: "lock",
  setting: "settings",
  audit: "description",
};

const moduleLabels: Record<string, string> = {
  driver: "Drivers",
  vehicle: "Vehicles",
  monitoring: "Monitoring",
  vendor: "Vendor Vehicles",
  rental: "Rentals",
  finance: "Finance",
  late_payment: "Late Payment",
  saldo: "Driver Saldo",
  driver_portal: "Driver Portal",
  user: "Users",
  role: "Roles",
  permission: "Permissions",
  setting: "Settings",
  audit: "Audit Logs",
};

function getActionBadge(name: string): { color: string; border: string } {
  const action = name.split(".")[1] || "";
  switch (action) {
    case "create":
      return { color: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800" };
    case "read":
      return { color: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30", border: "border-blue-200 dark:border-blue-800" };
    case "update":
      return { color: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30", border: "border-amber-200 dark:border-amber-800" };
    case "delete":
      return { color: "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30", border: "border-red-200 dark:border-red-800" };
    default:
      return { color: "text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800", border: "border-gray-200 dark:border-gray-700" };
  }
}

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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-emerald-500 text-xl">rule_settings</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Konfigurasi Permissions
          </h3>
          <p className="text-xs text-slate-400">Tentukan modul dan akses yang dapat diakses oleh role ini</p>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-slate-700">
        {groups.map((group) => (
          <div key={group.module} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300">
                  <span className="material-symbols-outlined">
                    {moduleIcons[group.module] || "settings"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {moduleLabels[group.module] || group.module}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {group.permissions.length} permission
                    {group.permissions.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {isModuleChecked(group.module) ? "All Selected" : "Select All"}
                </span>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  checked={isModuleChecked(group.module)}
                  ref={(el) => {
                    if (el) el.indeterminate = isModulePartiallyChecked(group.module);
                  }}
                  onChange={(e) => toggleModule(group.module, e.target.checked)}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ml-13">
              {group.permissions.map((perm) => {
                const actionLabel = formatActionLabel(perm.name);
                const badge = getActionBadge(perm.name);
                return (
                  <label
                    key={perm.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedIds.includes(perm.id)
                        ? `border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 ${badge.border}`
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5 shrink-0"
                      checked={selectedIds.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                    />
                    <div className="flex flex-col min-w-0 gap-0.5">
                      <span className={`text-sm font-semibold leading-tight ${
                        selectedIds.includes(perm.id) ? "text-blue-800 dark:text-blue-300" : "text-gray-800 dark:text-gray-200"
                      }`}>
                        {actionLabel}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate font-mono">
                        {perm.name}
                      </span>
                      {perm.description && (
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 line-clamp-1">
                          {perm.description}
                        </span>
                      )}
                    </div>
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

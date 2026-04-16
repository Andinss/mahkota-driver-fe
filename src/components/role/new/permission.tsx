"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";

export interface PermissionOption {
  value: string;
  label: string;
  checked?: boolean;
}

export interface PermissionItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
  type: "toggle" | "checkbox-group" | "radio-group" | "checkbox-pills";
  options?: PermissionOption[];
  checked?: boolean;
}

interface PermissionProps {
  permissions: PermissionItem[];
  onChange: (permissions: PermissionItem[]) => void;
}

const Permission = ({ permissions, onChange }: PermissionProps) => {
  const updatePermission = (index: number, updates: Partial<PermissionItem>) => {
    const next = permissions.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    onChange(next);
  };

  const updateOption = (
    permIndex: number,
    optIndex: number,
    checked: boolean
  ) => {
    const item = permissions[permIndex];
    if (!item.options) return;

    const nextOptions = item.options.map((opt, i) =>
      i === optIndex ? { ...opt, checked } : opt
    );

    updatePermission(permIndex, { options: nextOptions });
  };

  const updateRadio = (permIndex: number, value: string) => {
    const item = permissions[permIndex];
    if (!item.options) return;

    const nextOptions = item.options.map((opt) => ({
      ...opt,
      checked: opt.value === value,
    }));

    updatePermission(permIndex, { options: nextOptions });
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
        {permissions.map((item, index) => (
          <div
            key={item.id}
            className={`p-6 group hover:bg-gray-50 transition-colors ${
              item.type === "toggle"
                ? "flex items-center justify-between"
                : ""
            }`}
          >
            <div
              className={`flex items-center gap-4 ${
                item.type !== "toggle" ? "mb-4" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center ${item.iconColor}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>

            {item.type === "toggle" && (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  checked={item.checked}
                  onChange={(e) =>
                    updatePermission(index, { checked: e.target.checked })
                  }
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            )}

            {item.type === "checkbox-group" && item.options && (
              <div className="ml-14 max-w-md">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {item.options.slice(0, -1).map((opt, optIndex) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-white transition-colors bg-white/50"
                    >
                      <Checkbox
                        checked={opt.checked}
                        onChange={(e) =>
                          updateOption(index, optIndex, e.target.checked)
                        }
                        value={opt.value}
                      />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {item.options.length > 0 && (
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-blue-300 bg-blue-50 cursor-pointer">
                    <Checkbox
                      checked={item.options[item.options.length - 1].checked}
                      onChange={(e) =>
                        updateOption(
                          index,
                          item.options!.length - 1,
                          e.target.checked
                        )
                      }
                      value={item.options[item.options.length - 1].value}
                    />
                    <span className="text-sm font-medium text-blue-700">
                      {item.options[item.options.length - 1].label}
                    </span>
                  </label>
                )}
              </div>
            )}

            {item.type === "radio-group" && item.options && (
              <div className="grid grid-cols-2 gap-4 ml-14">
                {item.options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      opt.checked
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:bg-white"
                    }`}
                  >
                    <Radio
                      name={item.id}
                      value={opt.value}
                      checked={opt.checked}
                      onChange={() => updateRadio(index, opt.value)}
                    />
                    <span
                      className={`text-sm font-medium ${
                        opt.checked ? "text-blue-700" : ""
                      }`}
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {item.type === "checkbox-pills" && item.options && (
              <div className="flex flex-wrap gap-3 ml-14">
                {item.options.map((opt, optIndex) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors border border-transparent"
                  >
                    <Checkbox
                      checked={opt.checked}
                      onChange={(e) =>
                        updateOption(index, optIndex, e.target.checked)
                      }
                      value={opt.value}
                    />
                    <span className="text-xs font-semibold">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Permission;

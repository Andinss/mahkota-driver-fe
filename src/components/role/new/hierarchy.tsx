import { PermissionItem } from "./permission";

interface RoleHierarchyProps {
  permissions: PermissionItem[];
}

const RoleHierarchy = ({ permissions }: RoleHierarchyProps) => {
  const getPreviewItems = (): { text: string; allowed: boolean }[] => {
    const items: { text: string; allowed: boolean }[] = [];

    permissions.forEach((item) => {
      if (item.type === "toggle") {
        if (item.id === "dashboard" && item.checked) {
          items.push({ text: "Can view dashboard analytics", allowed: true });
        }
        if (item.id === "financial") {
          items.push({
            text: item.checked
              ? "Can view financial reports"
              : "Cannot view financial reports",
            allowed: !!item.checked,
          });
        }
      }

      if (item.type === "checkbox-group" && item.options) {
        const all = item.options.find((o) => o.value === "all");
        if (all?.checked) {
          items.push({ text: `Full access to ${item.title}`, allowed: true });
        } else {
          item.options
            .filter((o) => o.value !== "all" && o.checked)
            .forEach((o) => {
              items.push({
                text: `Can ${o.label.toLowerCase()} ${item.title}`,
                allowed: true,
              });
            });
        }
      }

      if (item.type === "radio-group" && item.options) {
        const selected = item.options.find((o) => o.checked);
        if (selected) {
          items.push({
            text:
              selected.value === "full"
                ? `Full access to ${item.title}`
                : `Read-only access to ${item.title}`,
            allowed: selected.value === "full",
          });
        }
      }

      if (item.type === "checkbox-pills" && item.options) {
        item.options
          .filter((o) => o.checked)
          .forEach((o) => {
            items.push({
              text: `Can perform ${o.label.toLowerCase()} in ${item.title}`,
              allowed: true,
            });
          });
      }
    });

    return items.length > 0
      ? items
      : [{ text: "No permissions selected yet", allowed: false }];
  };

  const previewItems = getPreviewItems();

  return (
    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
      <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined">info</span>
        Role Hierarchy
      </h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Roles determine the visibility of data. A higher hierarchy role can
        manage users in roles below them.
      </p>
      <div className="p-4 bg-white rounded-lg border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Previewing Permissions
          </span>
        </div>
        <ul className="space-y-2">
          {previewItems.map((preview, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-xs text-gray-500"
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

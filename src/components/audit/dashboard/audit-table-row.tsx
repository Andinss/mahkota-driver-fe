import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";
import type { AuditLogItem } from "@/lib/types/audit";

const formatTimestamp = (dateStr: string) => {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
};

const parseUserAgent = (ua?: string) => {
  if (!ua) return "-";
  const match = ua.match(/(Chrome\/\S+|Firefox\/\S+|Safari\/\S+|Edge\/\S+|Opera\/\S+|MSIE\s+\S+)/i);
  if (match) return match[1].replace(/\/\d+.*$/, "");
  const os = ua.match(/\(([^)]+)\)/);
  return os ? os[1].split(";")[0] : ua.substring(0, 30) + "...";
};

interface AuditTableRowProps {
  log: AuditLogItem;
  onViewDetails?: (log: AuditLogItem) => void;
}

const statusConfig = {
  success: {
    bgColor: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-600 dark:text-green-400",
    dotColor: "bg-green-500",
    label: "Success"
  },
  failed: {
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-600 dark:text-red-400",
    dotColor: "bg-red-500",
    label: "Failed"
  },
  pending: {
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
    label: "Pending"
  }
};

export const AuditTableRow = ({ log, onViewDetails }: AuditTableRowProps) => {
  const ts = formatTimestamp(log.created_at);
  const statusKey = (log.status === "success" || log.status === "failed" || log.status === "pending") ? log.status : "success";
  const status = statusConfig[statusKey];
  const isSystem = log.username === "System";

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-slate-900 dark:text-white">{ts.date}</div>
        <div className="text-xs text-slate-400">{ts.time}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {isSystem ? (
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
              SYS
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
              {log.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className={`text-sm font-semibold ${isSystem ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
              {log.username}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-slate-900 dark:text-white">{log.action}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">{log.target || "-"}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-xs text-slate-500 dark:text-slate-400 max-w-[120px] truncate" title={log.user_agent || ""}>
          {parseUserAgent(log.user_agent)}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bgColor} ${status.textColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}></span>
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
          }
        >
          <DropdownMenuItem icon="visibility" onClick={() => onViewDetails?.(log)}>
            View Details
          </DropdownMenuItem>
        </Dropdown>
      </td>
    </tr>
  );
};

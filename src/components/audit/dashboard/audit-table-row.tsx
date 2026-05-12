import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

interface AuditLog {
  id: number;
  timestamp: {
    date: string;
    time: string;
  };
  user: {
    name: string;
    role: string;
    avatar?: string | null;
    isSystem?: boolean;
  };
  action: string;
  target: string;
  status: "success" | "failed" | "pending";
}

interface AuditTableRowProps {
  log: AuditLog;
  onViewDetails?: (log: AuditLog) => void;
}

const statusConfig = {
  success: {
    bgColor: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-600",
    dotColor: "bg-green-500",
    label: "Success"
  },
  failed: {
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-600",
    dotColor: "bg-red-500",
    label: "Failed"
  },
  pending: {
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-600",
    dotColor: "bg-amber-500",
    label: "Pending"
  }
};

export const AuditTableRow = ({ log, onViewDetails }: AuditTableRowProps) => {
  const status = statusConfig[log.status];
  
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-6 py-5">
        <div className="text-sm font-medium">{log.timestamp.date}</div>
        <div className="text-xs text-slate-500">{log.timestamp.time}</div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          {log.user.isSystem ? (
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
              SYS
            </div>
          ) : log.user.avatar ? (
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
              <img alt={log.user.name} src={log.user.avatar} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium">
              {log.user.name.charAt(0)}
            </div>
          )}
          <div>
            <div className={`text-sm font-semibold ${log.user.isSystem ? 'text-primary' : ''}`}>
              {log.user.name}
            </div>
            <div className="text-xs text-slate-500">{log.user.role}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="text-sm font-medium">{log.action}</div>
      </td>
      <td className="px-6 py-5">
        <div className="text-sm text-slate-600 dark:text-slate-400">{log.target}</div>
      </td>
      <td className="px-6 py-5 text-center">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}></span>
          {status.label}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <Dropdown
          trigger={
            <button className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
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
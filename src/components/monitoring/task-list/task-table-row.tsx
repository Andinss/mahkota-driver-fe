"use client";

import { Badge } from "@/components/ui/badge";
import { Dropdown, DropdownMenuItem } from "@/components/ui/dropdown";

export interface Task {
  id: string;
  priority: "Normal" | "High" | "Urgent";
  vehicleInfo: {
    name: string;
    plate: string;
  };
  location: string;
  timeWindow: string;
  status: "Pending" | "Scheduled" | "In Progress";
  detailData?: {
    year: string;
    transmission: string;
    odometerOut: number;
    fuelLevel: number;
    reportedIssue: string;
    customerName: string;
    contractNumber: string;
    phoneNumber: string;
    imageUrl: string;
    mapUrl: string;
  };
}

interface TaskTableRowProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onDetails?: (task: Task) => void;
  onViewMap?: (task: Task) => void;
  onComplete?: (task: Task) => void;
}

export const TaskTableRow = ({
  task,
  onEdit,
  onDelete,
  onDetails,
  onViewMap,
  onComplete,
}: TaskTableRowProps) => {
  const isInProgress = task.status === "In Progress";

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      {/* Priority */}
      <td className="px-6 py-4">
        <Badge 
          variant={
            task.priority === "Urgent" 
              ? "danger"      
              : task.priority === "High"
              ? "warning"
              : "info"
          }
          size="sm"
        >
          {task.priority}
        </Badge>
      </td>

      {/* Vehicle Info */}
      <td className="px-6 py-4">
        <p className="font-medium text-slate-900 dark:text-white">
          {task.vehicleInfo.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {task.vehicleInfo.plate}
        </p>
      </td>

      {/* Location */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px]">
            location_on
          </span>
          <span className="text-slate-600 dark:text-slate-400">{task.location}</span>
        </div>
      </td>

      {/* Time Window */}
      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
        {task.timeWindow}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <Badge 
          variant={
            task.status === "Pending" 
              ? "warning"      
              : task.status === "Scheduled"
              ? "neutral"
              : task.status === "In Progress" 
              ? "info"
              : "neutral"
          }
          dot
        >
          {task.status}
        </Badge>
      </td>

      {/* Actions */}
     <td className="px-6 py-4 text-right">
  <Dropdown
    trigger={
      <button className="text-[#617589] hover:text-[#111418] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
        <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>
    }
  >
    <DropdownMenuItem icon="location_on" onClick={() => onViewMap?.(task)}>
      View Map
    </DropdownMenuItem>
    <DropdownMenuItem icon="check_circle"  onClick={() => onComplete?.(task)}>
      Complete
    </DropdownMenuItem>
    <DropdownMenuItem icon="visibility" onClick={() => onDetails?.(task)}>
      Details
    </DropdownMenuItem>
  </Dropdown>
</td>
    </tr>
  );
};
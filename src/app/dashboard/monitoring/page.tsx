"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { TaskListCard } from "@/components/monitoring/task-list/task-list-card";
import EmergencyResponse from "@/components/monitoring/task-list/emergency-response";
import { TaskFilters } from "@/components/monitoring/task-list/task-filters";
import { TaskTable } from "@/components/monitoring/task-list/task-table";
import { useRouter } from "next/navigation";
import { Task } from "@/components/monitoring/task-list/task-table-row";
import { TaskPagination } from "@/components/monitoring/task-list/task-pagination";
import { toastSuccess, toastError } from "@/components/ui/toast-provider";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";
import { monitoringApi } from "@/lib/api/monitoring";
import FleetLocationsTable from "@/components/monitoring/task-list/fleet-locations-table";

function mapApiTaskToTask(apiTask: any, index: number): Task {
  return {
    id: apiTask.id || String(index + 1),
    priority: apiTask.priority || "Normal",
    vehicleInfo: {
      name: apiTask.vehicle_name || "Unknown",
      plate: apiTask.plate || "N/A",
    },
    location: apiTask.location || "N/A",
    timeWindow: apiTask.time_window || "N/A",
    status: apiTask.status || "Pending",
  };
}

export default function TaskList() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [emergencyTask, setEmergencyTask] = useState<any>(null);

  const hasAccess = canAccess(user?.permissions, "monitoring.read");

  useEffect(() => {
    if (isLoading) return;
    if (!hasAccess) {
      toastError("Anda tidak memiliki izin untuk mengakses halaman ini.");
      router.replace("/dashboard");
    }
  }, [isLoading, hasAccess]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await monitoringApi.getTasks();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(mapApiTaskToTask);
        setAllTasks(mapped);

        const emergency = res.data.find((t: any) => t.priority === "High");
        if (emergency) {
          setEmergencyTask({
            id: `#${emergency.id?.slice(0, 8).toUpperCase() || "N/A"}`,
            location: emergency.location || "Unknown",
            vehicle: emergency.vehicle_name || "Unknown",
            plate: emergency.plate || "N/A",
            driver: "Driver on duty",
            priority: "High Priority",
          });
        } else {
          setEmergencyTask(null);
        }
      } else {
        console.warn("monitoring.getTasks response:", res);
      }
    } catch (e) {
      console.error("monitoring.getTasks error:", e);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasAccess && !isLoading) {
      fetchTasks();
    }
  }, [hasAccess, isLoading, fetchTasks]);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalResults = allTasks.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Get current page tasks
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = allTasks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDetails = (task: Task) => {
    router.push(`/dashboard/monitoring/detail?id=${task.id}`);
  };

  const handleViewMap = (task: Task) => {
    router.push(`/dashboard/monitoring/real-time`);
  };

  const handleComplete = (task: Task) => {
    toastSuccess(`Successfully completed retrieval for ${task.vehicleInfo.name} (${task.vehicleInfo.plate})`);
  };

  const handleEdit = (task: Task) => {
    console.log("Edit:", task);
  };

  const handleDelete = (task: Task) => {
    console.log("Delete:", task);
  };

  const handleExport = (options?: any) => {
    console.log("Export with options:", options);
  };

  return (
    <>
      {isLoading || !hasAccess ? null : (
      <div className="p-8 space-y-8">
        <PageHeader
          title="Monitoring Dashboard"
          description={allTasks.length > 0 ? `You have ${allTasks.length} task(s) today.` : "No active tasks at the moment."}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TaskListCard
            title="Pending Emergencies"
            value={String(allTasks.filter(t => t.priority === "High").length)}
            icon="warning"
            iconColor="text-orange-500"
            trend={{
              value: "Requires immediate action",
              color: "text-orange-600",
              icon: "warning"
            }}
          />
          <TaskListCard
            title="Retrievals Today"
            value={String(allTasks.length)}
            icon="directions_car"
            iconColor="text-primary"
            trend={{
              value: "0 completed",
              color: "text-[#617589]",
              icon: "check"
            }}
          />
          <TaskListCard
            title="Completed Tasks"
            value="0"
            icon="check_circle"
            iconColor="text-green-600"
            trend={{
              value: "Ready for review",
              color: "text-green-600",
              icon: "trending_up"
            }}
          />
        </div>

        {emergencyTask && <EmergencyResponse emergencyData={emergencyTask} />}
        <TaskFilters />

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {tasksLoading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading tasks...</div>
          ) : allTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No tasks yet. Tasks will appear here when retrieval operations are created.
            </div>
          ) : (
            <>
              <TaskTable
                tasks={currentTasks}
                onDetails={handleDetails}
                onViewMap={handleViewMap}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onExport={handleExport}
              />
              <TaskPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                resultsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        <FleetLocationsTable />
      </div>
      )}
    </>
  );
}

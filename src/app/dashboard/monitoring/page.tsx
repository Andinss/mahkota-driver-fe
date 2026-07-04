"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { TaskListCard } from "@/components/monitoring/task-list/task-list-card";
import EmergencyResponse from "@/components/monitoring/task-list/emergency-response";
import { TaskFilters } from "@/components/monitoring/task-list/task-filters";
import { TaskTable } from "@/components/monitoring/task-list/task-table";
import { useRouter } from "next/navigation";
import { Task } from "@/components/monitoring/task-list/task-table-row";
import { TaskPagination } from "@/components/monitoring/task-list/task-pagination";
import { AlertDialog } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import { canAccess } from "@/lib/can-access";

// All tasks data 
const allTasks: Task[] = [
  {
    id: "1",
    priority: "Normal",
    vehicleInfo: {
      name: "Honda CRV",
      plate: "B 2891 UJK"
    },
    location: "Soekarno-Hatta Terminal 3",
    timeWindow: "Today, 14:00",
    status: "Pending"
  },
  {
    id: "2",
    priority: "Normal",
    vehicleInfo: {
      name: "Toyota Innova",
      plate: "B 1567 RFS"
    },
    location: "Grand Indonesia West Mall",
    timeWindow: "Today, 16:30",
    status: "Scheduled"
  },
  {
    id: "3",
    priority: "Normal",
    vehicleInfo: {
      name: "Daihatsu Xenia",
      plate: "B 9981 KLP"
    },
    location: "Kemang Village Residence",
    timeWindow: "Started 20m ago",
    status: "In Progress"
  },
  {
    id: "4",
    priority: "Normal",
    vehicleInfo: {
      name: "Mitsubishi Pajero",
      plate: "B 1234 ABC"
    },
    location: "Plaza Indonesia",
    timeWindow: "Tomorrow, 10:00",
    status: "Scheduled"
  },
  {
    id: "5",
    priority: "High",
    vehicleInfo: {
      name: "Suzuki Ertiga",
      plate: "B 5678 DEF"
    },
    location: "Central Park Mall",
    timeWindow: "Tomorrow, 14:30",
    status: "Pending"
  },
  {
    id: "6",
    priority: "Normal",
    vehicleInfo: {
      name: "Nissan X-Trail",
      plate: "B 9012 GHI"
    },
    location: "Pondok Indah Mall",
    timeWindow: "Tomorrow, 09:00",
    status: "Scheduled"
  }
];

export default function TaskList() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [denied, setDenied] = useState(false);

  const hasAccess = canAccess(user?.permissions, "monitoring.read");

  useEffect(() => {
    if (isLoading) return;
    if (!hasAccess) {
      setDenied(true);
    }
  }, [isLoading, hasAccess]);

  const handleDeniedClose = () => {
    setDenied(false);
    router.replace("/dashboard");
  };

  // Alert state
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  //  PAGINATION STATE 
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

  //  HANDLERS
  const handleDetails = (task: Task) => {
    console.log("Details:", task);
   router.push(`/dashboard/monitoring/detail`);
  };

  const handleViewMap = (task: Task) => {
    router.push(`/dashboard/monitoring/real-time`)
  };

   const handleComplete = (task: Task) => {
    console.log("Complete:", task);
    setAlertTitle("Task Completed");
    setAlertMessage(`Successfully completed retrieval for ${task.vehicleInfo.name} (${task.vehicleInfo.plate})`);
    setAlertType("success");
    setIsAlertOpen(true);
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
      <AlertDialog
        isOpen={denied}
        onClose={handleDeniedClose}
        title="Akses Ditolak"
        message="Anda tidak memiliki izin untuk mengakses halaman ini."
        confirmText="OK"
        type="error"
        autoCloseDelay={0}
      />
      {isLoading || !hasAccess ? null : (
      <div className="p-8 space-y-8">
        <PageHeader 
          title="Welcome, Officer Budi"
          description="You have 1 urgent emergency and 5 scheduled tasks today."
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TaskListCard 
            title="Pending Emergencies"
            value="1"
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
            value="5"
            icon="directions_car"
            iconColor="text-primary"
            trend={{
              value: "2 completed",
              color: "text-[#617589]",
              icon: "check"
            }}
          />
          <TaskListCard 
            title="Completed Tasks"
            value="12"
            icon="check_circle"
            iconColor="text-green-600"
            trend={{
              value: "+3 from yesterday",
              color: "text-green-600",
              icon: "trending_up"
            }}
          />
        </div>

        <EmergencyResponse />
        <TaskFilters />

        {/* Table Container - SAME CONCEPT AS RENTAL PAGE */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <TaskTable 
            tasks={currentTasks}
            onDetails={handleDetails}
            onViewMap={handleViewMap}
            onComplete={handleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExport={handleExport}
          />

          {/* Pagination */}
          <TaskPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            resultsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
        <AlertDialog
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          title={alertTitle}
          message={alertMessage}
          type={alertType}
          confirmText="OK"
          autoCloseDelay={3000}
        />
      </div>
      )}
    </>
  );
}

"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { QuickAction } from "./quick-action";
import { ChartVisual } from "./chart-visual";

const ChartCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const router = useRouter();

  const stats: Record<string, { count: string; label: string }> = {
  "Last 30 Days": { count: "145", label: "New Users (Last 30 Days)" },
  "Last 7 Days": { count: "21", label: "New Users (Last 7 Days)" },
  "This Year": { count: "1.740", label: "New Users (This Year)" },
};

const currentStat = stats[selectedPeriod];
const handleAddUser = () => {
  router.push("/dashboard/users/new");
};

const handleResetPassword = () => {
  router.push("/auth/reset");
};

const handleEditRoles = () => {
  router.push("/dashboard/role");
};

const handleViewAuditLogs = () => {
  router.push("/dashboard/audit-logs");
};

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-5">
      {/* Chart Section */}
      <Card className="xl:col-span-2 flex flex-col p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">
              User Registration Growth
            </h3>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
  {currentStat.count}
    </span>
    <span className="text-slate-500 dark:text-slate-400 text-sm">
      {currentStat.label}
    </span>
          </div>
          <div className="flex gap-2">
            <select  value={selectedPeriod}
                     onChange={(e) => setSelectedPeriod(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/50 outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Chart Visualization */}
        <ChartVisual />

        <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium px-2">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </Card>

      {/* Quick Actions Section */}
      <div className="xl:col-span-1 flex flex-col gap-4">
        <Card className="p-6 h-full">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-5">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
            <QuickAction
              icon="person_add"
              title="Add New User"
              description="Register manually"
              variant="primary"
              onClick={handleAddUser}
            />
            <QuickAction
              icon="lock_reset"
              title="Reset Password"
              description="Send recovery email"
              variant="amber"
              onClick={handleResetPassword}
            />
            <QuickAction
              icon="manage_accounts"
              title="Edit Roles"
              description="Manage permissions"
              variant="indigo"
              onClick={handleEditRoles}
            />
            <QuickAction
              icon="summarize"
              title="View Audit Logs"
              description="Track system changes"
              variant="slate"
              onClick={handleViewAuditLogs}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChartCard;

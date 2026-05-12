"use client";

import { useState } from "react";
import { AlertDialog } from "@/components/ui/alert";
import { AuditLogFilters } from "@/components/audit/dashboard/filters-search";
import { AuditLogTable } from "@/components/audit/dashboard/audit-table";
import { AuditStatsCards } from "@/components/audit/dashboard/stats-cards";
import { AuditPagination } from "@/components/audit/dashboard/audit-pagination";
import { PageHeader } from "@/components/page-header";

export default function AuditLogPage() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const auditLogsData = [
    {
      id: 1,
      timestamp: { date: "Oct 24, 2023", time: "14:22:15 PM" },
      user: {
        name: "Marcus Wright",
        role: "Admin",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFDk8Mp4BTG8MOPMT_1fFoT-f8wNmCWSGSG5L5Iw670JwsalPDFfxZMJbXRByAXXpMNvPmwYUzu4yjDQ3c6JY_b1dG0MsK1piz_NA1OUqZSr8-a3FBBlDeOQkPRv0DSz7SHzJ0SULyblfmfKOx7sBLcmwhsO5aWqdpcHJGAD5J8RbwuYDBYarLSEbPrzRc53nIARfdvFZSnednUVSxS0l2xI5mqZStudblsoaRZ5YaS2mbtFFCY8Zu5lhsF9ZeSOJ9DOTfnUQycAk"
      },
      action: "Modified Permissions",
      target: "Role: Manager",
      status: "success" as const
    },
    {
      id: 2,
      timestamp: { date: "Oct 24, 2023", time: "13:45:02 PM" },
      user: {
        name: "Alex Rivera",
        role: "Staff",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGIhXQNMhpTigfb0385UeKg8jLuF-C8ocioBMX1NuKjgMFqWndiU_21BCH74kOSTD2s713JyITOX4ay1csfBSHXV-1zRr5cHI2fAGP0cZ3JpgEDLB-tPKwshSrGWvrZFdK0z0iONOR98Hk3EzG3GlCFg7Wcz8xt4XO6WNBUoW_0A17MzZEuTn2JsSh9xpqMsTUavLwGc6EY2NWdNFyS1DIKCg_gtRRDjaNph1sTJZhmZb8Yrsc-FonpDKg22I_uXLYAY_rf5FJ1OQ"
      },
      action: "Reset Password",
      target: "User: j.smith@lumina.com",
      status: "failed" as const
    },
    {
      id: 3,
      timestamp: { date: "Oct 24, 2023", time: "11:10:55 AM" },
      user: {
        name: "Sarah Jenkins",
        role: "Supervisor",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuByr9Bvo5Iq_4BUoDN1RbSctNTx2UalTJ9Yoi6vhqCelcyl9M4mS87td-Gnc77omQF-8NiwbgLozSiHPbHoWVejPdUFrz6lwB4zw6MBnHf00QeMuApDkbjGDQATe0f4ez46p7tn-kJnkxDRfpnbwsWQSA1yC4Rd4W1w2esZYRVcKYHRoiAeHT_rOgI8rOmft8IraUYz75_ZQye-r3fgc01lirHVqvwItPkIbUSne8o6Mpjxn01Rna-RjPPUP8dbRLBnrQlrjjfk0xA"
      },
      action: "Added New User",
      target: "Driver: MD-0052",
      status: "pending" as const
    },
    {
      id: 4,
      timestamp: { date: "Oct 24, 2023", time: "09:12:44 AM" },
      user: {
        name: "System",
        role: "Automated",
        avatar: null,
        isSystem: true
      },
      action: "Backup Completed",
      target: "Database: Weekly_Full",
      status: "success" as const
    }
  ];

  const statsData = {
    totalEvents: 2840,
    securityAlerts: 12,
    userActions: 1150,
    failedRequests: 45
  };

  const totalResults = auditLogsData.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = auditLogsData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExport = (options?: any) => {
    console.log("Exporting audit logs with options:", options);
    setAlertTitle("Export Successful");
    setAlertMessage("Audit logs have been exported successfully.");
    setAlertType("success");
    setIsAlertOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      <PageHeader
        title="Audit Logs"
        description="Track and review all system changes and user activities."
      />

      <AuditStatsCards stats={statsData} />

      <AuditLogFilters />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <AuditLogTable logs={currentLogs} onExport={handleExport} />
        
        <div className="border-t border-slate-200 dark:border-slate-800">
          <AuditPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            resultsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        confirmText="OK"
      />
      
    </div>
  );
}
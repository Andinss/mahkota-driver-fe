"use client";

import { useState, useEffect, useCallback } from "react";
import { toastError } from "@/components/ui/toast-provider";
import { AuditLogFilters } from "@/components/audit/dashboard/filters-search";
import { AuditLogTable } from "@/components/audit/dashboard/audit-table";
import { AuditStatsCards } from "@/components/audit/dashboard/stats-cards";
import { Pagination } from "@/components/ui/pagination";
import { PageHeader } from "@/components/page-header";
import { auditApi } from "@/lib/api/audit";
import type { AuditLogItem, AuditStats } from "@/lib/types/audit";
import type { ExportOptions } from "@/components/ui/export";
import { PermissionGuard } from "@/components/auth-guard-permission";

export default function AuditLogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [stats, setStats] = useState<AuditStats>({ totalEvents: 0, securityAlerts: 0, userActions: 0, failedRequests: 0 });
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await auditApi.getList({ page: currentPage, limit: itemsPerPage, search: searchValue || undefined });
      setLogs(response.data);
      if (response.meta) {
        setTotalResults(response.meta.total);
        setTotalPages(response.meta.totalPages);
      }
    } catch {
      toastError("Failed to load audit logs");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchValue]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await auditApi.getStats();
      setStats(response.data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleExport = async (options?: ExportOptions) => {
    if (!options) return;
    const params: Record<string, string | number | undefined> = {
      format: options.format,
      columns: options.columns.join(","),
      type: options.type,
    };
    if (options.type === "filtered") {
      if (searchValue) params.search = searchValue;
      if (options.dateRange?.start) params.start_date = options.dateRange.start;
      if (options.dateRange?.end) params.end_date = options.dateRange.end;
    }
    await auditApi.exportData(params);
  };

  return (
    <PermissionGuard permission="audit.read">
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      <PageHeader
        title="Audit Logs"
        description="Track and review all system changes and user activities."
      />

      <AuditStatsCards stats={stats} />

      <AuditLogFilters searchValue={searchValue} onSearchChange={handleSearchChange} />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading...</div>
        ) : (
          <>
            <AuditLogTable logs={logs} onExport={handleExport} />
            <div className="border-t border-slate-200 dark:border-slate-800">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                resultsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
              />
            </div>
          </>
        )}
      </div>

    </div>
    </PermissionGuard>
  );
}
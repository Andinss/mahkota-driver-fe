interface AuditStatsCardProps {
  title: string;
  value: number;
  icon: string;
  iconColor: string;
  trend?: {
    value: string;
    color: string;
    icon: string;
  };
  subtitle?: string;
}

const colorToBg: Record<string, string> = {
  "text-indigo-600": "bg-indigo-50 dark:bg-indigo-900/20",
  "text-red-600": "bg-red-50 dark:bg-red-900/20",
  "text-amber-600": "bg-amber-50 dark:bg-amber-900/20",
  "text-gray-600": "bg-gray-100 dark:bg-gray-800",
  "text-gray-400": "bg-gray-100 dark:bg-gray-800",
};

function AuditCard({
  title,
  value,
  icon,
  iconColor,
  trend,
  subtitle,
}: AuditStatsCardProps) {
  const bgClass = colorToBg[iconColor] || "bg-slate-100 dark:bg-slate-800";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
          <span className={`material-symbols-outlined text-2xl ${iconColor}`}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value.toLocaleString()}</p>
          <p className="text-xs text-slate-400 font-medium truncate">{title}</p>
        </div>
      </div>
      {(trend || subtitle) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          {trend && (
            <span className={`text-xs font-medium flex items-center gap-1 ${trend.color}`}>
              <span className="material-symbols-outlined text-sm">{trend.icon}</span>
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-slate-400 font-medium">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface AuditStatsCardsProps {
  stats: {
    totalEvents: number;
    securityAlerts: number;
    userActions: number;
    failedRequests: number;
  };
}

export function AuditStatsCards({ stats }: AuditStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <AuditCard
        title="Total Events"
        value={stats.totalEvents}
        icon="reorder"
        iconColor="text-indigo-600"
        trend={{ value: "8%", color: "text-green-500", icon: "trending_up" }}
      />
      <AuditCard
        title="Security Alerts"
        value={stats.securityAlerts}
        icon="security"
        iconColor="text-red-600"
        subtitle="Requires action"
      />
      <AuditCard
        title="User Actions"
        value={stats.userActions}
        icon="person_outline"
        iconColor="text-amber-600"
        trend={{ value: "12%", color: "text-green-500", icon: "trending_up" }}
      />
      <AuditCard
        title="Failed Requests"
        value={stats.failedRequests}
        icon="error_outline"
        iconColor="text-gray-600 dark:text-gray-400"
        trend={{ value: "2%", color: "text-red-500", icon: "trending_up" }}
      />
    </div>
  );
}

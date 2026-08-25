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

function AuditCard({ 
    title, 
    value, 
    icon, 
    iconColor, 
    trend, 
    subtitle 
}: AuditStatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        <div className={`p-2 rounded-xl`}>
          <span className={`material-symbols-outlined text-xl ${iconColor}`}>{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold dark:text-white">{value.toLocaleString()}</h3>
        {trend && (
          <span className={`${trend.color} text-xs font-medium flex items-center`}>
            <span className="material-symbols-outlined text-sm">{trend.icon}</span> {trend.value}
          </span>
        )}
        {subtitle && (
          <span className="text-gray-500 text-xs font-medium">{subtitle}</span>
        )}
      </div>
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
type StatusType = "available" | "rented" | "maintenance" | "reserved" | "service" | "retrieved";

interface StatusBadgeProps {
  status: StatusType | string;
}

const statusConfig: Record<string, { label: string; className: string; dotColor: string }> = {
  available: {
    label: "Available",
    className: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    dotColor: "bg-green-500",
  },
  rented: {
    label: "Rented",
    className: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    dotColor: "bg-blue-500",
  },
  maintenance: {
    label: "Maintenance",
    className: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    dotColor: "bg-orange-500",
  },
  reserved: {
    label: "Reserved",
    className: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    dotColor: "bg-purple-500",
  },
  service: {
    label: "Service",
    className: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    dotColor: "bg-amber-500",
  },
  retrieved: {
    label: "Retrieved",
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    dotColor: "bg-slate-400",
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusLower = status.toLowerCase() as StatusType;
  const config = statusConfig[statusLower] || statusConfig.available;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></span>
      {config.label}
    </span>
  );
};

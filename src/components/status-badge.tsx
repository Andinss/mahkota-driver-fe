type StatusType = "available" | "rented" | "maintenance";

interface StatusBadgeProps {
  status: StatusType | string;
}

const statusConfig = {
  available: {
    label: "Available",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    dotColor: "bg-green-600 dark:bg-green-400",
  },
  rented: {
    label: "Rented",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    dotColor: "bg-blue-600 dark:bg-blue-400",
  },
  maintenance: {
    label: "Maintenance",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    dotColor: "bg-gray-500 dark:bg-gray-400",
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusLower = status.toLowerCase() as StatusType;
  const config = statusConfig[statusLower] || statusConfig.available;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></span>
      {config.label}
    </span>
  );
};

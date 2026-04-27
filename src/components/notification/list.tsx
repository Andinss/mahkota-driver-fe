import React from "react";
import NotificationCard from "@/components/ui/notification-card";

interface ListNotificationProps {
  activeFilter: string;
}

const ListNotification = ({ activeFilter }: ListNotificationProps) => {
  const notifications = [
    {
      type: "emergency" as const,
      title: "Emergency: Vehicle Immobilized",
      description:
        "Vehicle ID-8829 has triggered an emergency engine cutoff in the Sector 7 Logistics Zone. Immediate investigation required for safety protocols.",
      timestamp: "2 mins ago",
      filterKey: "emergency",
    },
    {
      type: "payment" as const,
      title: "Payment Overdue: Invoice #2024-91",
      description:
        "The corporate account for Metropolitan Logistics has exceeded its credit limit. Late payment fees applied to current cycle.",
      timestamp: "1 hour ago",
      filterKey: "payment",
    },
    {
      type: "security" as const,
      title: "Unusual Login Detected",
      description:
        "A new login session was initiated from a Chrome browser on Windows in Singapore. If this wasn't you, please reset your credentials.",
      timestamp: "4 hours ago",
      filterKey: "security",
    },
    {
      type: "system" as const,
      title: "Platform V2.4 Maintenance",
      description:
        "The core ledger system will undergo scheduled maintenance tonight at 02:00 AM UTC. Telemetry reports may be delayed by up to 15 minutes.",
      timestamp: "Yesterday",
      filterKey: "system",
    },
    {
      type: "received" as const,
      title: "Payment Received: ID #9928",
      description:
        "Institutional payment of $4,500.00 confirmed for Fleet Group Alpha. Transaction ledger synchronized.",
      timestamp: "2 days ago",
      filterKey: "payment",
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    return notification.filterKey === activeFilter;
  });

  if (filteredNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-gray-400">
            notifications_off
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">No notifications</h3>
        <p className="text-gray-600 mt-2">
          No notifications found for this category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredNotifications.map((notification, index) => (
        <NotificationCard
          key={index}
          type={notification.type}
          title={notification.title}
          description={notification.description}
          timestamp={notification.timestamp}
        />
      ))}
    </div>
  );
};

export default ListNotification;

"use client";
import React from "react";
export interface NotificationCardProps {
  type: "emergency" | "payment" | "security" | "system" | "received";
  title: string;
  description: string;
  timestamp: string;
  actions?: React.ReactNode;
  isRead?: boolean;
}

const notificationConfig = {
  emergency: {
    borderColor: "border-l-4 border-red-500",
    bgColor: "bg-red-100",
    textColor: "text-red-600",
    icon: "fmd_bad",
  },
  payment: {
    borderColor: "border-l-4 border-orange-500",
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
    icon: "payments",
  },
  security: {
    borderColor: "border-l-4 border-blue-500",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    icon: "security",
  },
  system: {
    borderColor: "border-l-4 border-purple-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    icon: "system_update",
  },
  received: {
    borderColor: "border border-gray-200",
    bgColor: "bg-gray-200",
    textColor: "text-gray-400",
    icon: "payments",
  },
};

const getButtonText = (type: string) => {
  switch (type) {
    case "emergency":
      return "Track Vehicle";
    case "payment":
      return "View Invoice";
    case "security":
      return "Security Settings";
    case "system":
      return "Read Patch Notes";
    case "received":
      return "View Details";
    default:
      return "View";
  }
};

const NotificationCard = ({
  type,
  title,
  description,
  timestamp,
  actions,
  isRead = false,
}: NotificationCardProps) => {
  const config = notificationConfig[type];
  const isEmergency = type === "emergency";
  const isReceived = type === "received";

  return (
    <div
      className={`group relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-white dark:bg-[#1a2632] hover:bg-gray-50 dark:hover:bg-[#243040] transition-all duration-300 rounded-xl shadow-sm ${config.borderColor} ${isRead ? "opacity-50" : ""}`}
    >
      {/* Timestamp & Status Badge - Repositioned for mobile */}
      <div className="sm:absolute sm:top-6 sm:right-6 flex sm:flex-row flex-row-reverse justify-between items-center gap-3 mb-3 sm:mb-0">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            {timestamp}
          </span>
          {isEmergency && !isRead && (
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          )}
          {!isEmergency && !isRead && type !== "received" && (
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          )}
        </div>
      </div>

      {/* Icon - Full width on mobile, fixed on desktop */}
      <div
        className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${config.bgColor} flex items-center justify-center ${config.textColor} mx-auto sm:mx-0`}
      >
        <span
          className="material-symbols-outlined text-xl sm:text-2xl"
          data-icon={config.icon}
        >
          {config.icon}
        </span>
      </div>

      {/* Content - Takes full width on mobile */}
      <div className="flex-1 pt-0 sm:pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-1">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white text-center sm:text-left">
            {title}
          </h3>
          <span
            className={`px-2 py-0.5 rounded ${config.bgColor} ${config.textColor} text-[10px] font-black uppercase truncate max-w-[120px] sm:max-w-none mx-auto sm:mx-0`}
          >
            {type === "received"
              ? "Payment Received"
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-center sm:text-left">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
          {actions || (
            <>
              <button className="text-xs font-bold text-blue-600 hover:underline">
                {getButtonText(type)}
              </button>
              {!isReceived && (
                <button className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-white">
                  Acknowledge
                </button>
              )}
            </>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;

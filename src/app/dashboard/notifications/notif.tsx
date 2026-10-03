"use client";
import React, { useState } from "react";
import FilterNotif from "@/components/notification/filter-notification";
import ListNotification from "@/components/notification/list";

import { Button } from "@/components/ui/button";

const NotificationPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  return (
    <div className="m-8">
      <div className="w-full">
        {/* Header Section */}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              Notification Center
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-lg leading-relaxed">
              Real-time operational alerts and institutional updates for PT Mahkota Drive
              Fleet Rental Management System.
            </p>
          </div>
          <Button icon="done_all">Mark All as Read</Button>
        </div>

        {/* Filter Bar */}
        <FilterNotif
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Notification List */}
        <ListNotification activeFilter={activeFilter} />
        {/* Empty State Support (Hidden in this view) */}
        <div className="hidden flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <span
              className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500"
              data-icon="notifications_off"
            >
              notifications_off
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">All Clear</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            No new notifications to show right now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;

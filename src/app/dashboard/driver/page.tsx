"use client";

import { useState } from "react";
import { DriverStatsCard } from "@/components/driver/dashboard/driver-stats-card";
import {
  DriverTableFilters,
  DriverFilters,
} from "@/components/driver/dashboard/driver-table-filters";
import { DriverTable } from "@/components/driver/dashboard/driver-table";
import { DriverPagination } from "@/components/driver/dashboard/driver-pagination";
import { Driver } from "@/components/driver/dashboard/driver-table-row";

// Mock data
const mockDrivers: Driver[] = [
  {
    name: "Marcus Wright",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-qYfFL3In7JL4maoOxB8QqNbOANCIYNhsY-l1AGrUUadhZ0roktjb5ib4cNoakVh_oO__7Z4RZhjXwWeAzcra7WLVqKA8KiZ6Hyl_FqEE5p19pJCWIFFe-6P_hDEvf_LZnm0vUD03dfgzwIMZ0zZhy3YHHoX-gZ5gY90BD8zmSeBpJoQ6y0ivDnU6ckC0HAMrzAvJ2BVNqeSZVYnlBxyWLH8LzYWuXuRhMaAgU0M_pozCE96pLx3mDrVtr1TGEBz19KoRro9nKAo",
    joinedDate: "Joined June 2023",
    employeeId: "MD-0042",
    phoneNumber: "+62 812-3456-7890",
    licenseType: "Class A",
    totalTrips: 128,
    status: "Active",
  },
  {
    name: "Sarah Jenkins",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAJRxtoYIvLfiJORIJcK7_u7IiLQnwFBDoQumbz_rlneeqVavyA8jYKVsr2hb2DZOyAMNxvuySNSD3LWjeZQj2zyqlm2wJ1NArKZ8qjbV4XqkEnHOp1dgb6n-KmZKwk7eVD6oKI_jCqOaUH2MY8bFD65kjDyVsLjeZQXUZwVbc4XYJ6ZURFQXli1XkCbLxWFOcj2Czdgqrf_iQhHPvVlPm7yWEou5vvw8_RhUGXqUdul-pE8763c0l47ZPxEcAtfa2C__Hivdujj8",
    joinedDate: "Joined Feb 2022",
    employeeId: "MD-0015",
    phoneNumber: "+62 811-9876-5432",
    licenseType: "Class B",
    totalTrips: 245,
    status: "Active",
  },
  {
    name: "David Chen",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg3OtbSiDMbS2fQauodlopCPX-ygSjB64loonPwECzcfUeuos7v7dDf81NRGtxDV0OHo5Snx274k0ole2vMlXn_4NjZaaNDT6uA1lwF6XU_8NqE7uzAMDpwgRwu9r6Ad02UGg40EpS_9Q80MfPadOdKKdcDUKLNm7yE13M4wnsNtEYuQrQpfNmItKdpFZwh-v3zsS9DvPZNwaDZsd-eM05ccamSZQIVNACyYIl57b2Q5tjdNOzSr2e89Cadua8-j3EL_pFAz4CIQ8",
    joinedDate: "Joined Oct 2023",
    employeeId: "MD-0068",
    phoneNumber: "+62 822-1122-3344",
    licenseType: "Class A",
    totalTrips: 12,
    status: "On Leave",
  },
  {
    name: "Elena Rodriguez",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFJhxtLHfGYG6h7m8pS8rivEJjWEsl5cbpcqCrh_fO4amNI0ldFdtZAT9VUdkCcA9x_k60lAzFaojyQ-IDSAcZLo9PcSoM2wGt5dZMMBvDGcXvkcMJEAD4Ab2iaeoneJgaSRy2UZDSQ461FXjG5_s0LyChu9OiM4TTgBbG28bUjvx0NGeZSI_Cl5ILrrTnjHcMoYwoglyuiMVcebapHUXEp-iLqFnaO7Q54DHpZe_Ff5a7q2Q4ode_SffCfUDv7lxEBePa2jFBx2Q",
    joinedDate: "Joined Jan 2021",
    employeeId: "MD-0008",
    phoneNumber: "+62 855-6677-8899",
    licenseType: "Class A",
    totalTrips: 512,
    status: "Inactive",
  },
];

export default function DriverPage() {
  const [filters, setFilters] = useState<DriverFilters>({
    search: "",
    performance: "Performance: All",
    status: "All Statuses",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const totalResults = 48;
  const resultsPerPage = 10;

  const handleFilterChange = (newFilters: DriverFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-7">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Driver List Overview
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and monitor driver performance and attendance.
          </p>
        </div>
        <a
          href="/dashboard/driver/register"
          className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <span className="material-icons-round text-sm">person_add</span>
          Add New Driver
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DriverStatsCard
          title="Total Drivers"
          value="48"
          icon="groups"
          iconColor="text-primary"
          trend={{
            icon: "trending_up",
            text: "+3 newly joined",
            textColor: "text-emerald-500",
          }}
        />
        <DriverStatsCard
          title="Active"
          value="32"
          icon="check_circle"
          iconColor="text-emerald-500"
          trend={{
            icon: "fiber_manual_record",
            text: "On current trips",
            textColor: "text-emerald-500",
          }}
        />
        <DriverStatsCard
          title="On Leave"
          value="6"
          icon="event_busy"
          iconColor="text-amber-500"
          trend={{
            icon: "info",
            text: "4 returning tomorrow",
            textColor: "text-slate-400",
          }}
        />
        <DriverStatsCard
          title="Inactive"
          value="10"
          icon="person_off"
          iconColor="text-rose-500"
          trend={{
            icon: "warning",
            text: "Needs review",
            textColor: "text-rose-500",
          }}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <DriverTableFilters filters={filters} onFilterChange={handleFilterChange} />
        <DriverTable drivers={mockDrivers} />
        <DriverPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

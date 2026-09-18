"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { PaymentCard } from "@/components/finance/payment-list/card";
import { Pagination } from "@/components/ui/pagination";
import { DriverQuickActions } from "./driver-quick-actions";
import { DriverPaymentFilters } from "../payment/driver-payment-filters";
import { DriverPaymentTable } from "../payment/driver-payment-table";
import { DriverPaymentQuick } from "../payment/driver-payment-sidebar";

export function DriverDashboardPage() {
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalItems = 48;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-10">
          <PageHeader
            title="Driver Portal"
            description="Selamat datang di portal mitra driver Mahkota Fleet"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <PaymentCard
              title="Saldo Koin Utama"
              value="104.000 Koin"
              icon="toll"
              iconColor="text-primary"
              trend={{
                value: "Setara Rp 104.000,-",
                color: "text-primary",
                icon: "account_balance_wallet",
              }}
            />
            <PaymentCard
              title="Status Keanggotaan"
              value="Aktif"
              icon="verified"
              iconColor="text-emerald-500"
              trend={{
                value: "Member Internal - Prioritas",
                color: "text-emerald-500",
                icon: "trending_up",
              }}
            />
            <PaymentCard
              title="Unit Operasional"
              value="Kosong"
              icon="directions_car"
              iconColor="text-slate-400"
              trend={{
                value: "Belum ada unit terdaftar",
                color: "text-slate-400",
                icon: "info",
              }}
            />
          </div>

          <DriverQuickActions />

          <DriverPaymentQuick />

          <DriverPaymentFilters
            searchValue={searchValue}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />

          <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
            <DriverPaymentTable />
            <div className="border-t border-[#dbe0e6] dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalItems}
                resultsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => {
                  setItemsPerPage(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

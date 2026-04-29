"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { RentalCard } from "@/components/rent/dashboard/card";
import { FiltersSearch } from "@/components/rent/dashboard/filters-search";
import { RentPagination } from "@/components/rent/dashboard/rent-pagination";
import { RentalTable } from "@/components/rent/dashboard/rent-table";
import { ExportOptions } from "@/components/ui/export";

export default function RentalManagementPage() {

  const handleExport = (options?: ExportOptions) => {
      if (!options) return;
      console.log("Export options from rental page:", options);
      alert(`Exporting rental data as ${options.format} with ${options.type} data`);
    };
  // State Confirm dialog Delete
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<any>(null);



 const rentalsData = [
  {
    transactionId: "#RT-4022",
    driver: {
      name: "Marco Polo",
      id: "889201",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCW4gJf2eEO4EG8BFOazzdRRHee4-MomTnMV3WEGQ2Y8seVCyviB_eSctIejw8Js83uqHnt4TxkKMywWxkhJUO2KXohNsm3j98fZCqiS5qst8FxfTtrtae9MRFF2Pu8NauV6Ho_bBcUwWeQYUi1AQt2tPEagR7FS1Ph9g0jKqItqSxjkyTIIhOuC3iBiceqWvwhk91APC1xCREcN_sbBmJivy0buipqNPEjjKHq2EBGo8w44wo-aAbkEOoPcLp64gttI8Z7m87DwX3Z",
    },
    vehicle: {
      name: "Toyota Avanza",
      id: "B 1234 XYZ",
    },
    rentalPeriod: {
      start: "Oct 12",
      end: "Oct 15",
      duration: 3,
    },
    deposit: "held",
    paymentStatus: "paid",
  },
  {
    transactionId: "#RT-4023",
    driver: {
      name: "Sarah Smith",
      id: "889205",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAAWTDU7YDSChhfxC9rbq344i1_ja75dg8lO8oKgEupt2okcD5RJMKo0mhAKO6gx9GdZ8g1QtB1xOWfM0y-daxhxi5MVJVezIXUJ3Oo-vA90Rt1fdY7hemxkBF9RKDxPeEYg1fhSZZW_yui3ROqTQoryZwF0urmyz22Wb0UufSnMCUPWybyP0z0VpKEMCedura_ou1BCeDWLpp8celzqhuLzk8tpGX5uFCjx1GZThyVSBb2q69fTF8ebLHLQuuZp-eHhZuYmOWB8sVk",
    },
    vehicle: {
      name: "Honda CR-V",
      id: "B 5678 ABC",
    },
    rentalPeriod: {
      start: "Oct 14",
      end: "Oct 20",
      duration: 6,
    },
    deposit: "pending",
    paymentStatus: "partial",
  },
  {
    transactionId: "#RT-4024",
    driver: {
      name: "Robert Chen",
      id: "889312",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCwQxpzc53icY9jPe89tCLHEMP3dZ-mpN5AVfvfFReL0-UPGjrmDIvu7ywDO-33uMSssvcIlniIpsSzrNos1iW3-l88tvUbLP-3XTEk37R6-VfcTn7xRrLdw9w5HnfxrZFdjM6iJvkwyuOlhzeOimuyd0W9vezn-Zf0ilN4nQQWTFGIJmHrJxh09pkFKfe8Z-yYo3yDBagdNx_xfkWuXABk8RtjG5IzBoB-G40vbilXBMOu7qr1ZJ7_CnP3Rw2nQZPdB9WytVnKWr1o",
    },
    vehicle: {
      name: "Mitsubishi Pajero",
      id: "B 9910 DEF",
    },
    rentalPeriod: {
      start: "Oct 01",
      end: "Oct 10",
      duration: 9,
    },
    deposit: "held",
    paymentStatus: "late",
  },
  {
    transactionId: "#RT-4025",
    driver: {
      name: "Anita Wijaya",
      id: "889410",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC_JHe0vnoPqvs-TjRNdrF-gLxN33O6dKzDPp_VbRrAxXIbKggM3g4UlSyIEOnENnSNkLHbfXvoQZFid8MYLdvVtZt_QTcH3uHmGut8ecYPPM1rP1z0y9V_HfzkvczhSQ1BreHS9tmg6L9aJPFK7t-T_lapaM8Qv_vGbF_YZVmJvxkbQP95QC4btUgkR5r44aWX97_HoKs_Y241kbhSoV1Ingozfz67QncGXL6j0-vktGzezwFI-SX12-p1z2SDeoipOwWidA7qbTbZ",
    },
    vehicle: {
      name: "Toyota Innova",
      id: "B 2233 GHI",
    },
    rentalPeriod: {
      start: "Oct 15",
      end: "Oct 16",
      duration: 1,
    },
    deposit: "waiting",
    paymentStatus: "unpaid",
  },
];

// Calculate real stats from data
const activeRentals = rentalsData.filter(
  (r) => r.paymentStatus === "paid" && r.deposit === "held",
).length;
const pendingPayments = rentalsData.filter(
  (r) => r.paymentStatus === "partial" || r.deposit === "pending",
).length;
const latePayments = rentalsData.filter(
  (r) => r.paymentStatus === "late",
).length;
const completedToday = rentalsData.filter(
  (r) => r.rentalPeriod.end === "Oct 16",
).length;

// Pagination state
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 2; // Show 2 items per page

const totalResults = rentalsData.length;
const totalPages = Math.ceil(totalResults / itemsPerPage);

// Get current page rentals
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentRentals = rentalsData.slice(startIndex, endIndex);

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

// Handler Delete
   const handleDeleteClick = (rental: any) => {
    setSelectedRental(rental);
    setIsConfirmDeleteOpen(true);
  };

   const handleConfirmDelete = () => {
    console.log("Deleted rental:", selectedRental);
    alert(`Rental ${selectedRental?.transactionId} deleted successfully!`);
    setIsConfirmDeleteOpen(false);
    setSelectedRental(null);
  };


  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Rentals List Overview"
        description="Monitor active rentals, handle pending and late payments, and review daily completed transactions."
        buttonText="Add New Rentals"
        buttonHref="/dashboard/rent/new"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RentalCard
          title="Active Rentals"
          value={activeRentals.toString()}
          icon="key"
          iconColor="text-primary"
          trend={{
            value: "+5% from last month",
            color: "text-green-600",
            icon: "trending_up",
          }}
        />

        <RentalCard
          title="Pending Payments"
          value={pendingPayments.toString()}
          icon="pending_actions"
          iconColor="text-amber-600"
          trend={{
            value: "-2% from last week",
            color: "text-rose-600",
            icon: "trending_down",
          }}
        />

        <RentalCard
          title="Late Payments"
          value={latePayments.toString()}
          icon="error"
          iconColor="text-rose-600"
          trend={{
            value: "+8% priority",
            color: "text-green-600",
            icon: "trending_up",
          }}
        />

        <RentalCard
          title="Completed Today"
          value={completedToday.toString()}
          icon="task_alt"
          iconColor="text-emerald-600"
          trend={{
            value: "-4% daily goal",
            color: "text-rose-600",
            icon: "trending_down",
          }}
        />
      </div>

      <FiltersSearch />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <RentalTable 

          rentals={currentRentals} 
          onExport={handleExport}
               
        onDelete={handleDeleteClick}
        />

        {/* Add separator line */}
        <div className="border-t border-slate-200 dark:border-slate-800">
          <RentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            resultsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

          {/* Confirm dialog delete */}
          <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Rental"
        message={`Are you sure you want to delete ${selectedRental?.transactionId}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />

    </div>
  );
}

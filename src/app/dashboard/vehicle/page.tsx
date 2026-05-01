"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AlertDialog } from "@/components/ui/alert";
import { VehicleStatsCard } from "@/components/vehicle/dashboard/vehicle-stats-card";
import { VehicleTable } from "@/components/vehicle/dashboard/vehicle-table";
import { SearchFilters } from "@/components/search-filters";
import { PageHeader } from "@/components/page-header";
import { VehiclePagination } from "@/components/vehicle/dashboard/vehicle-pagination";

export default function DashboardVehiclePage() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Adjust based on your preference

  // State Confirm Dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // State Alert Dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Tampilkan alert jika ada success param di URL
  useEffect(() => {
    const success = searchParams.get("success");
    const vehicle = searchParams.get("vehicle");

    if (success && vehicle) {
      const action = success === "updated" ? "Update" : "Registration";
      setAlertTitle(`${action} Successful`);
      setAlertMessage(`Vehicle ${decodeURIComponent(vehicle)} has been ${success} successfully.`);
      setAlertType("success");
      setIsAlertOpen(true);

      // Hapus query params dari URL agar alert tidak muncul lagi saat refresh
      window.history.replaceState({}, "", "/dashboard/vehicle");
    }
  }, [searchParams]);

  const vehicles = [
    {
      name: "Toyota Camry",
      year: 2022,
      transmission: "Automatic",
      plate: "B 1234 XYZ",
      type: "Sedan",
      rate: "$50.00",
      status: "available" as const,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAhTPXl3_1Wdm0vfEBBNfPz34KYWfTwgk92FN-NMeG529KFX1AoOCF0Xw2rshR7QRnMz9NgkYRdicFT07sEO_JcpauYoriHK8_eSj9MUtTrPLMI4nq7V4pt9RyqLSOQu_XxaNcKRLLvf44b5LKMrGoWz02DfFtOSgNNBrtbgDz2_LYHpPi7pBRiWXfYRAubew-O4Taz0RqtGQoSh-bX7L_yBXpuryAqsPZ-DbGjaGKz3blYbCu4VMUoQ2PH_N3-Ht0OueyUHdE1JCDb",
      imageAlt: "Silver Toyota Camry side view",
    },
    {
      name: "Honda CR-V",
      year: 2021,
      transmission: "Automatic",
      plate: "B 5678 ABC",
      type: "SUV",
      rate: "$65.00",
      status: "rented" as const,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAhTPXl3_1Wdm0vfEBBNfPz34KYWfTwgk92FN-NMeG529KFX1AoOCF0Xw2rshR7QRnMz9NgkYRdicFT07sEO_JcpauYoriHK8_eSj9MUtTrPLMI4nq7V4pt9RyqLSOQu_XxaNcKRLLvf44b5LKMrGoWz02DfFtOSgNNBrtbgDz2_LYHpPi7pBRiWXfYRAubew-O4Taz0RqtGQoSh-bX7L_yBXpuryAqsPZ-DbGjaGKz3blYbCu4VMUoQ2PH_N3-Ht0OueyUHdE1JCDb",
      imageAlt: "White Honda CRV front view",
    },
    {
      name: "Mercedes C-Class",
      year: 2023,
      transmission: "Automatic",
      plate: "B 9988 MERC",
      type: "Luxury",
      rate: "$120.00",
      status: "maintenance" as const,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAhTPXl3_1Wdm0vfEBBNfPz34KYWfTwgk92FN-NMeG529KFX1AoOCF0Xw2PH_N3-Ht0OueyUHdE1JCDb",
      imageAlt: "Black Mercedes C-Class side",
    },
    {
      name: "Ford Transit",
      year: 2020,
      transmission: "Manual",
      plate: "B 3322 TRK",
      type: "Van",
      rate: "$85.00",
      status: "available" as const,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAhTPXl3_1Wdm0vfEBBNfPz34KYWfTwgk92FN-NMeG529KFX1AoOCF0Xw2rshR7QRnMz9NgkYRdicFT07sEO_JcpauYoriHK8_eSj9MUtTrPLMI4nq7V4pt9RyqLSOQu_XxaNcKRLLvf44b5LKMrGoWz02DfFtOSgNNBrtbgDz2_LYHpPi7pBRiWXfYRAubew-O4Taz0RqtGQoSh-bX7L_yBXpuryAqsPZ-DbGjaGKz3blYbCu4VMUoQ2PH_N3-Ht0OueyUHdE1JCDb",
      imageAlt: "Blue Ford Transit Van",
    },
  ];

  // Handler untuk Delete
  const handleDeleteClick = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsConfirmOpen(true);
  }

  const handleConfirmDelete = () => {
    console.log("Deleted vehicle:", selectedVehicle);
    // TODO: Panggil API delete di sini
    setIsConfirmOpen(false);
    setAlertTitle("Delete Successful");
    setAlertMessage(`Vehicle ${selectedVehicle?.name} has been deleted successfully.`);
    setAlertType("success");
    setIsAlertOpen(true);
    setSelectedVehicle(null);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };



  // Calculate pagination
  const totalResults = vehicles.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = vehicles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <PageHeader
          title="Vehicle List Overview"
          description="Manage your fleet, add new vehicles, and track their status."
          buttonText="Add New Vehicle"
          buttonHref="/dashboard/vehicle/register"
        />
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <VehicleStatsCard
            title="Total Vehicles"
            value="124"
            icon="local_taxi"
            iconColor="text-primary"
            trend={{
              value: "+2% from last month",
              color: "text-green-600",
              icon: "trending_up",
            }}
          />
          <VehicleStatsCard
            title="Rented"
            value="85"
            icon="key"
            iconColor="text-blue-500"
            trend={{
              value: "+5% peak hours",
              color: "text-green-600",
              icon: "trending_up",
            }}
          />
          <VehicleStatsCard
            title="Available"
            value="22"
            icon="check_circle"
            iconColor="text-green-500"
            trend={{
              value: "-3% decrease",
              color: "text-red-600",
              icon: "trending_down",
            }}
          />
          <VehicleStatsCard
            title="Maintenance"
            value="12"
            icon="settings"
            iconColor="text-orange-500"
            trend={{
              value: "Stable status",
              color: "text-gray-500",
              icon: "equal",
            }}
          />
          <VehicleStatsCard
            title="Retrieved"
            value="5"
            icon="assignment_return"
            iconColor="text-purple-500"
            trend={{
              value: "Pending inspection",
              color: "text-green-600",
              icon: "history",
            }}
          />
        </section>

        <SearchFilters />
        <section className="xl:col-span-2">
          <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] shadow-sm overflow-hidden">
            {/* Vehicle Table */}
            <VehicleTable 
            vehicles={currentVehicles}
            onDelete={handleDeleteClick} 
            />
            <VehiclePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              resultsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </div>
      {/* Confirm Dialog untuk Delete */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete ${selectedVehicle?.name} (${selectedVehicle?.plate})? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        confirmText="OK"
      />
    </div>
  );
}

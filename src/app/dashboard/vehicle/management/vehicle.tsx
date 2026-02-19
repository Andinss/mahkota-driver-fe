"use client";

import { useState } from "react";
import { VehicleTable } from "@/components/vehicle/management/vehicle-table";
import { Breadcrumbs } from "@/components/vehicle/management/breadcrumbs";
import { PageHeader } from "@/components/vehicle/management/page-header";
import { AddVehicleForm } from "@/components/vehicle/management/add-vehicle-form";
import { VehicleEditModal } from "@/components/vehicle/management/vehicle-edit-modal";
import { SearchFilters } from "@/components/vehicle/management/search-filters";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { VehicleData } from "@/components/vehicle/management/vehicle-form";

const VehicleDashboard = () => {
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(
    null,
  );
  const [vehicleToDelete, setVehicleToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddVehicle = (data: VehicleData) => {
    console.log("Adding vehicle:", data);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsFormExpanded(false);
    }, 1000);
  };

  const handleEditVehicle = (data: VehicleData) => {
    console.log("Updating vehicle:", data);

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditModalOpen(false);
      setSelectedVehicle(null);
    }, 1000);
  };

  const handleDeleteVehicle = () => {
    console.log("Deleting vehicle:", vehicleToDelete);

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }, 1000);
  };

  const openEditModal = (vehicle: any) => {
    // Convert vehicle to VehicleData format
    const vehicleData: VehicleData = {
      make: vehicle.name.split(" ")[0], // Extract make from name
      model: vehicle.name.split(" ").slice(1).join(" "), // Extract model from name
      year: vehicle.year.toString(),
      licensePlate: vehicle.plate,
      color: "", // Would need to be added to vehicle data
      vin: "", // Would need to be added to vehicle data
      type: vehicle.type.toLowerCase(),
      status: vehicle.status,
    };
    setSelectedVehicle(vehicleData);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (vehicle: any) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "#" },
            { label: "Vehicles" },
            { label: "Management" },
          ]}
        />

        {/* Page Header */}
        <PageHeader
          title="Vehicle Management"
          description="Manage your fleet, add new vehicles, and track their status."
          buttonText="Add Vehicle"
          formId="add-vehicle-form"
          onButtonClick={() => setIsFormExpanded(!isFormExpanded)}
        />

        {/* Add Vehicle Form */}
        <AddVehicleForm
          isExpanded={isFormExpanded}
          onAdd={handleAddVehicle}
          onCancel={() => setIsFormExpanded(false)}
        />

        {/* Search and Filters */}
        <SearchFilters />

        {/* Vehicle Table */}
        <VehicleTable
          vehicles={vehicles}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
        />

        {/* Edit Vehicle Modal */}
        {selectedVehicle && (
          <VehicleEditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedVehicle(null);
            }}
            vehicleData={selectedVehicle}
            onUpdate={handleEditVehicle}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setVehicleToDelete(null);
          }}
          onConfirm={handleDeleteVehicle}
          title="Delete Vehicle"
          message={`Are you sure you want to delete "${vehicleToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default VehicleDashboard;

"use client";

import { useState } from "react";
import {
  VehicleHeader,
  VehicleHeaderData,
} from "@/components/vehicle/detail/vehicle-header";
import { TabNavigation } from "@/components/vehicle/detail/tab-navigation";
import { TechnicalSpecs } from "@/components/vehicle/detail/technical-specs";
import { RegistrationDetails } from "@/components/vehicle/detail/registration-details";
import { RentalPricing } from "@/components/vehicle/detail/rental-pricing";
import {
  RentalHistoryFilters,
  RentalFilters,
} from "@/components/vehicle/detail/rental-history-filters";
import { RentalHistoryTable } from "@/components/vehicle/detail/rental-history-table";
import { ModalExport, ExportOptions, ExportColumn } from "@/components/ui/export";

const VehicleDetail = () => {
  const [activeTab, setActiveTab] = useState<"information" | "rental">(
    "information",
  );
  const [currentFilters, setCurrentFilters] = useState<RentalFilters>({
    dateRange: "",
    driver: "",
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Mock data - ini nanti diganti dengan fetch dari API
  const vehicleData: VehicleHeaderData = {
    plate: "B 1234 ABC",
    name: "Toyota Hiace Previa • Silver Metallic",
    status: "ACTIVE",
    totalRevenue: "Rp 142.500.000",
    totalRentals: "128 Trips",
    avgUtilization: "84%",
    maintenance: "Scheduled",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIm8qQWyUiKTmp5lJnvCLfXwpvURihINSlIaPoouO-nEyR5JMaJ7hEGfxSoYP8v8_Ckv5FgrlEMUIGmJ41dzXy4FsF9OqilsrogvckzdnhHMH0GpkJXbCUIg7T3OUA8MGgNmCqdLeeMZ0aMpIHlImczhC1NPjBeXC5trxsm1BJ1EHlc0JyMdhiVzdEGNZcNE0VuLqFudcdm9sW__cOolRJQMzzlwf79hprOhm3CVDBrKKsb0cRktW48ympTEG1QQdPDnk27oIJjtap",
    imageAlt: "Side view of a silver passenger van parked outside",
  };

  const technicalSpecs = [
    { label: "Engine Capacity", value: "2,755 cc" },
    { label: "Fuel Type", value: "Diesel" },
    { label: "Transmission", value: "Automatic" },
    { label: "Passenger Capacity", value: "16 Seats" },
  ];

  const registrationDetails = [
    { label: "VIN Number", value: "MHFB123K123456" },
    { label: "Engine Number", value: "1GD-FTV-8923" },
    { label: "STNK Expiry", value: "12 Nov 2028" },
    { label: "Insurance Policy", value: "All-Risk Premium" },
  ];

  const rentalPricing = {
    baseRate: "Rp 1.200.000",
    features: [
      { text: "Includes Basic Insurance" },
      { text: "Free Driver (Optional)" },
      { text: "Maintenance Included" },
    ],
  };

  const rentalHistory = [
    {
      dateRange: "12 Oct - 15 Oct 2023",
      tripDuration: "3 Days Trip",
      driverName: "Budi Santoso",
      dailyRate: "Rp 850.000",
      totalFee: "Rp 2.550.000",
      status: "PAID" as const,
    },
    {
      dateRange: "05 Oct - 10 Oct 2023",
      tripDuration: "5 Days Trip",
      driverName: "Siti Aminah",
      dailyRate: "Rp 850.000",
      totalFee: "Rp 4.250.000",
      status: "LATE" as const,
    },
    {
      dateRange: "28 Sep - 30 Sep 2023",
      tripDuration: "2 Days Trip",
      driverName: "Dedi Kurniawan",
      dailyRate: "Rp 900.000",
      totalFee: "Rp 1.800.000",
      status: "PAID" as const,
    },
  ];

  const rentalHistoryColumns: ExportColumn[] = [
    { id: "dateRange", label: "Date Range", defaultChecked: true },
    { id: "tripDuration", label: "Trip Duration", defaultChecked: true },
    { id: "driverName", label: "Driver Name", defaultChecked: true },
    { id: "dailyRate", label: "Daily Rate", defaultChecked: true },
    { id: "totalFee", label: "Total Fee", defaultChecked: true },
    { id: "status", label: "Status", defaultChecked: true },
  ];

  const handleFilterChange = (filters: RentalFilters) => {
    setCurrentFilters(filters);
    console.log("Filters changed:", filters);
  };

  const handleClearFilters = () => {
    setCurrentFilters({ dateRange: "", driver: "" });
    console.log("Filters cleared");
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleExportConfirm = (options: ExportOptions) => {
    console.log("Export options:", options);
    alert(`Exporting rental history as ${options.format}`);
    setIsExportModalOpen(false);
  };

  return (
    <div className="m-7">
      <VehicleHeader data={vehicleData} />

      <div className="bg-white dark:bg-slate-900 mt-5 rounded-xl border border-[#e5e7eb] dark:border-slate-800 shadow-sm overflow-hidden">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "information" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
              <TechnicalSpecs specs={technicalSpecs} />
              <RegistrationDetails details={registrationDetails} />
              <RentalPricing
                baseRate={rentalPricing.baseRate}
                features={rentalPricing.features}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <RentalHistoryFilters
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onExport={handleExport}
              />
              <RentalHistoryTable rentals={rentalHistory} />
            </div>
          )}
        </div>
      </div>

      <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportConfirm}
        totalRows={rentalHistory.length}
        title="Export Rental History"
        description="Generate rental history reports."
        columns={rentalHistoryColumns}
      />
    </div>
  );
};

export default VehicleDetail;

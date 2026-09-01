"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import CardCarInfo from "@/components/rent/detail/car-info";
import DriverInfo from "@/components/rent/detail/driver-info";
import Duration from "@/components/rent/detail/duration";
import DocumentSign from "@/components/rent/detail/signed-document";
import { Button } from "@/components/ui/button";
import { rentalApi } from "@/lib/api/rentals";
import type { RentalTransaction } from "@/lib/types/rentals";

const DetailRentPage = () => {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");

  const [rental, setRental] = useState<RentalTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (transactionId) {
      setIsLoading(true);
      rentalApi.getDetail(transactionId)
        .then((res) => {
          const item = (res as any)?.data ?? (res as any);
          if (item?.rental_number) {
            setRental(item);
          } else {
            throw new Error("Invalid response");
          }
        })
        .catch(() => {
          // fallback to getById
          rentalApi.getById(transactionId).then((res) => {
            const item = (res as any)?.data ?? (res as any);
            if (item?.rental_number) {
              setRental(item);
            }
          }).catch(() => setRental(null));
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [transactionId]);

  if (isLoading) {
    return (
      <div className="m-8 p-12 text-center text-slate-500">
        Loading rental details...
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="m-8 p-12 text-center text-slate-500">
        Rental not found.
      </div>
    );
  }

  const imageBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");
  const rawVehiclePhoto = (rental.vehicle as any)?.vehicle_photo;
  const vehiclePhoto = rawVehiclePhoto
    ? (Array.isArray(rawVehiclePhoto) ? rawVehiclePhoto[0] : rawVehiclePhoto)
    : "";
  const vehicleImageUrl = vehiclePhoto
    ? vehiclePhoto.startsWith("http")
      ? vehiclePhoto
      : `${imageBase}/${vehiclePhoto.replace(/^\//, "")}`
    : "";

  const rawDriverPhoto = rental.driver?.profile_photo || "";
  const driverPhotoUrl = rawDriverPhoto
    ? rawDriverPhoto.startsWith("http")
      ? rawDriverPhoto
      : `${imageBase}/${rawDriverPhoto.replace(/^\//, "")}`
    : "";

  return (
    <PermissionGuard permission="rental.read">
    <div className="m-8">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Large Vehicle Card (Span 8) */}
        <CardCarInfo
          vehicleName={rental.vehicle ? `${rental.vehicle.merk} ${rental.vehicle.model}` : "Vehicle"}
          licensePlate={rental.vehicle?.license_plate || "-"}
          color="N/A"
          fuelLevel={85}
          odometer={0}
          depositAmount={Number(rental.security_deposit) || 0}
          imageUrl={vehicleImageUrl}
        />

        {/* Driver Information (Span 4) */}
        <DriverInfo
          name={rental.driver ? `${rental.driver.first_name} ${rental.driver.last_name}` : "-"}
          accountType="-"
          licenseStatus="Verified"
          contact={rental.driver?.phone || "-"}
          email={rental.driver?.email || "-"}
          avatar={driverPhotoUrl}
        />

        {/* Duration & Rates (Span 7) */}
        <Duration
          startDate={rental.start_date || ""}
          endDate={rental.end_date || ""}
          dailyRate={Number(rental.daily_rate) || 0}
          depositAmount={Number(rental.deposit_amount) || 0}
          duration={rental.total_duration || 0}
          methodPayment={rental.method_payment}
          saldoDeducted={Number(rental.saldo_deducted) || 0}
          serviceFee={Number(rental.service_fee) || 25000}
          rentalDuration={rental.rental_duration}
          rentalService={rental.rental_service}
        />

        {/* Documents Section (Span 5) */}
        <div className="col-span-12 lg:col-span-5">
          <DocumentSign documentUrl={rental.document_contract} />
        </div>
      </div>

      {/* Contextual Actions */}
      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pb-8">
        <Button>Log Incident</Button>
        <Button>Generate Return Report</Button>
      </div>
    </div>
    </PermissionGuard>
  );
};

export default DetailRentPage;

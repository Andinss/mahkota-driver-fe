"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth-guard-permission";
import CardCarInfo from "@/components/rent/detail/car-info";
import DriverInfo from "@/components/rent/detail/driver-info";
import Duration from "@/components/rent/detail/duration";
import DocumentSign from "@/components/rent/detail/signed-document";
import { rentalApi } from "@/lib/api/rentals";
import type { RentalTransaction } from "@/lib/types/rentals";

const DetailRentPage = () => {
  const router = useRouter();
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
              <span className="text-sm font-medium">Memuat detail sewa...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard/rent")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Detail Sewa</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Sewa tidak ditemukan</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">search_off</span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Data sewa tidak ditemukan</p>
            <button
              onClick={() => router.push("/dashboard/rent")}
              className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Kembali ke Daftar Sewa
            </button>
          </div>
        </div>
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard/rent")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Detail Sewa
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {rental.rental_number}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Vehicle & Driver Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CardCarInfo
                vehicleName={rental.vehicle ? `${rental.vehicle.merk} ${rental.vehicle.model}` : "Vehicle"}
                licensePlate={rental.vehicle?.license_plate || "-"}
                imageUrl={vehicleImageUrl}
              />
              <DriverInfo
                name={rental.driver ? `${rental.driver.first_name} ${rental.driver.last_name}` : "-"}
                contact={rental.driver?.phone || "-"}
                email={rental.driver?.email || "-"}
                avatar={driverPhotoUrl}
              />
            </div>

            {/* Duration & Rates */}
            <Duration
              startDate={rental.start_date || ""}
              endDate={rental.end_date || ""}
              dailyRate={Number(rental.daily_rate) || 0}
              duration={rental.total_duration || 0}
              rentalDuration={rental.rental_duration}
              rentalService={rental.rental_service}
            />

            {/* Documents */}
            <DocumentSign documentUrl={rental.document_contract} />
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
};

export default DetailRentPage;

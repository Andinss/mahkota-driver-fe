"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { vendorApi } from "@/lib/api/vendor-vehicle";
import { formatRupiah } from "@/lib/utils/format";
import type { VendorVehicle } from "@/lib/types/vendor-vehicle";

interface VendorDetailPageProps {
  id: string | null;
}

const imageBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

const buildLogoUrl = (logo?: string) =>
  logo
    ? logo.startsWith("http")
      ? logo
      : `${imageBase}/${logo.replace(/^\//, "")}`
    : "";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const VendorDetailPage = ({ id }: VendorDetailPageProps) => {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    vendorApi
      .getDetail(id)
      .then((res) => {
        setVendor(res.data);
        setNotFound(false);
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!vendor || notFound) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard/vendor-vehicles")}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">arrow_back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Detail Vendor</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Vendor tidak ditemukan</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">search_off</span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Data vendor tidak ditemukan</p>
            <button
              onClick={() => router.push("/dashboard/vendor-vehicles")}
              className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Kembali ke Daftar Vendor
            </button>
          </div>
        </div>
      </div>
    );
  }

  const logoUrl = buildLogoUrl(vendor.logo);
  const statusActive = vendor.status === "active";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard/vendor-vehicles")}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Detail Vendor</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{vendor.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={statusActive ? "success" : "neutral"} dot>
              {statusActive ? "Aktif" : "Nonaktif"}
            </Badge>
            <Link
              href={`/dashboard/vendor-vehicles/new?id=${vendor.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Edit
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt={vendor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-2xl font-bold text-white">
                    {vendor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">{vendor.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{vendor.id.toUpperCase()}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
                  {vendor.owner_name}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 p-5">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Total Pendapatan</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {formatRupiah(Number(vendor.pendapatan) || 0)}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/50 p-5">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Kendaraan</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{Number(vendor.total_kendaraan) || 0} unit</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/50 p-5">
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Bergabung Sejak</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-400">
                {formatDate(vendor.created_at)}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500 text-xl">directions_car</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">Kendaraan Vendor</h3>
                  <p className="text-xs text-slate-400">Daftar kendaraan milik vendor ini</p>
                </div>
              </div>
              {vendor.total_kendaraan > 0 && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  {Number(vendor.total_kendaraan) || 0} unit
                </span>
              )}
            </div>
            {vendor.vehicles && vendor.vehicles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-6 py-3">Kendaraan</th>
                      <th className="px-6 py-3">Plat Nomor</th>
                      <th className="px-6 py-3">Harga Harian</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {(vendor.vehicles || []).map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-white dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {vehicle.merk} {vehicle.model}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 uppercase">
                          {vehicle.license_plate}
                        </td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                          {formatRupiah(Number(vehicle.daily_rate) || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              ["Available", "Reserved", "rented"].includes(vehicle.status)
                                ? "success"
                                : "neutral"
                            }
                            dot
                          >
                            {vehicle.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                Belum ada kendaraan yang terhubung ke vendor ini.
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 text-xl">info</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Informasi Lengkap</h3>
                <p className="text-xs text-slate-400">Ringkasan data vendor vehicle</p>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-slate-500 dark:text-slate-400">Nama Vendor</span>
                <span className="font-semibold text-slate-900 dark:text-white">{vendor.name}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-slate-500 dark:text-slate-400">Nama Pemilik</span>
                <span className="font-semibold text-slate-900 dark:text-white">{vendor.owner_name}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-slate-500 dark:text-slate-400">Pendapatan</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(Number(vendor.pendapatan) || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-slate-500 dark:text-slate-400">Total Kendaraan</span>
                <span className="font-semibold text-slate-900 dark:text-white">{Number(vendor.total_kendaraan) || 0} unit</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <Badge variant={statusActive ? "success" : "neutral"} dot>
                  {statusActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-slate-500 dark:text-slate-400">Tanggal Bergabung</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatDate(vendor.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;
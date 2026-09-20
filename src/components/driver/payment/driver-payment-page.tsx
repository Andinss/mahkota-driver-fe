"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/ui/pagination";
import { financeApi } from "@/lib/api/finances";
import { useAuth } from "@/lib/auth-context";
import { toastError } from "@/components/ui/toast-provider";
import type { FinanceItem } from "@/lib/types/finances";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  unpaid: { label: "Belum Dibayar", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", dot: "bg-red-500" },
  pending: { label: "Menunggu Verifikasi", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", dot: "bg-amber-500" },
  partially_paid: { label: "Partially Paid", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", dot: "bg-blue-500" },
  paid: { label: "Lunas", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", dot: "bg-emerald-500" },
  cancelled: { label: "Dibatalkan", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", dot: "bg-slate-400" },
};

export function DriverPaymentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchFinances = useCallback(async () => {
    if (!user?.driver_id) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const params: Record<string, string | number | undefined> = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (searchValue) params.search = searchValue;
      if (statusFilter) params.status = statusFilter;

      const response = await financeApi.getMyFinances(params);
      const data = (response as any)?.data ?? response;
      const items = Array.isArray(data) ? data : data?.data ?? [];
      const meta = data?.meta;

      setFinances(items);
      setTotalPages(meta?.totalPages || 1);
      setTotalItems(meta?.total || items.length);
    } catch (err) {
      console.error("Failed to fetch finances:", err);
      toastError("Gagal memuat data tagihan");
    } finally {
      setIsLoading(false);
    }
  }, [user?.driver_id, currentPage, itemsPerPage, searchValue, statusFilter]);

  useEffect(() => {
    fetchFinances();
  }, [fetchFinances]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, statusFilter]);

  const handlePay = (finance: FinanceItem) => {
    router.push(`/dashboard/driver/payment/form?id=${finance.id}`);
  };

  return (
    <div className="m-8">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 pb-10">
          <PageHeader
            title="Pembayaran Saya"
            description="Lihat dan bayar tagihan sewa kendaraan Anda"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500 text-xl">receipt_long</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Tagihan</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {formatIDR(finances.reduce((sum, f) => sum + (f.total_amount || 0), 0))}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sudah Dibayar</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatIDR(finances.reduce((sum, f) => sum + (f.paid_amount || 0), 0))}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-orange-500 text-xl">pending</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sisa Tagihan</p>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    {formatIDR(finances.reduce((sum, f) => sum + (f.remaining_amount || 0), 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <input
                type="text"
                placeholder="Cari No. Referensi..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full md:max-w-md px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[140px] px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Status: Semua</option>
                <option value="unpaid">Belum Dibayar</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="pending">Menunggu Verifikasi</option>
                <option value="paid">Lunas</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500 text-xl">receipt_long</span>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-white text-base">
                    Tagihan Pembayaran
                  </h2>
                  <p className="text-xs text-slate-400">{totalItems} tagihan tercatat</p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block animate-spin">hourglass_empty</span>
                <p className="text-sm text-slate-400">Memuat data tagihan...</p>
              </div>
            ) : finances.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">receipt_long</span>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Belum Ada Tagihan</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500">Tagihan pembayaran akan muncul di sini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-6 py-4">No. Referensi</th>
                      <th className="px-6 py-4">Kendaraan</th>
                      <th className="px-6 py-4">Total Tagihan</th>
                      <th className="px-6 py-4">Sudah Dibayar</th>
                      <th className="px-6 py-4">Sisa Tagihan</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {finances.map((finance) => {
                      const st = statusConfig[finance.status] || statusConfig.unpaid;
                      const vehicle = finance.vehicle;
                      const rental = finance.rentals?.[0];
                      const vehicleName = vehicle
                        ? `${vehicle.merk} ${vehicle.model}`
                        : rental?.vehicle
                          ? `${rental.vehicle.merk} ${rental.vehicle.model}`
                          : "-";
                      const plate = vehicle?.license_plate || rental?.vehicle?.license_plate || "";
                      const canPay = ["unpaid", "partially_paid"].includes(finance.status) && finance.remaining_amount > 0;

                      return (
                        <tr key={finance.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-mono font-semibold text-sm text-primary">
                                {finance.reference_number}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {finance.payment_date ? new Date(finance.payment_date).toLocaleDateString("id-ID") : "-"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900 dark:text-white">{vehicleName}</span>
                              {plate && (
                                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{plate}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {formatIDR(finance.total_amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatIDR(finance.paid_amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-semibold ${finance.remaining_amount > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`}>
                              {formatIDR(finance.remaining_amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${st.bg} ${st.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                              {st.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {canPay && (
                                <button
                                  type="button"
                                  onClick={() => handlePay(finance)}
                                  className="h-8 w-8 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors flex items-center justify-center"
                                  title="Bayar Tagihan"
                                >
                                  <span className="material-symbols-outlined text-[18px]">payments</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="border-t border-[#dbe0e6] dark:border-gray-700">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={totalItems}
                  resultsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { DriverTableRow, Driver } from "./driver-table-row";
import { confirmToast, toastSuccess, toastError } from "@/components/ui/toast-provider";
import { useSearchParams } from "next/navigation";
import { ExportColumn, ModalExport } from "@/components/ui/export";

const driverColumns: ExportColumn[] = [
  { id: "name", label: "Driver Name", defaultChecked: true },
  { id: "employee_id", label: "Employee ID", defaultChecked: true },
  { id: "phone", label: "Phone Number", defaultChecked: true },
  { id: "email", label: "Email", defaultChecked: true },
  { id: "saldo", label: "Saldo", defaultChecked: true },
  { id: "gender", label: "Gender", defaultChecked: false },
  { id: "date_of_birth", label: "Date of Birth", defaultChecked: false },
  { id: "citizenship", label: "Citizenship", defaultChecked: false },
  { id: "house_type", label: "House Type", defaultChecked: false },
  { id: "province_name", label: "Province", defaultChecked: false },
  { id: "city_name", label: "City / Regency", defaultChecked: false },
  { id: "willing_to_be_survey", label: "Willing to be Surveyed", defaultChecked: false },
  { id: "ready_sign_contract", label: "Ready Sign Contract", defaultChecked: false },
];

interface DriverTableProps {
  drivers: Driver[];
  onDeleteDriver?: (driverId: string) => Promise<void>;
  onExport?: (options?: any) => void;
  onDetailsDriver?: (driver: Driver) => void;
}

export function DriverTable({ drivers, onDeleteDriver, onExport, onDetailsDriver }: DriverTableProps) {
  const searchParams = useSearchParams();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const success = searchParams.get("success");
    const driver = searchParams.get("driver");

    if (success && driver && !toastShownRef.current) {
      toastShownRef.current = true;
      const action = success === "updated" ? "Update" : "Registration";
      toastSuccess(`Driver ${decodeURIComponent(driver)} has been ${success} successfully.`);
      window.history.replaceState({}, "", "/dashboard/drivers");
    }
  }, [searchParams]);

  const handleDeleteConfirm = async (driver: Driver) => {
    if (onDeleteDriver) {
      try {
        await onDeleteDriver(driver.employeeId);
        toastSuccess(`Driver ${driver.name} (${driver.employeeId}) has been deleted successfully`);
      } catch (err: any) {
        const msg = err?.message || `Failed to delete driver ${driver.name}. They may have active transactions.`;
        toastError(msg);
      }
    }
  };

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">person</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              Driver Management
            </h2>
            <p className="text-xs text-slate-400">{drivers.length} driver terdaftar</p>
          </div>
        </div>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Profil</th>
              <th className="px-6 py-4">ID Karyawan</th>
              <th className="px-6 py-4">Telepon</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Saldo</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {drivers.map((driver) => (
              <DriverTableRow
                key={driver.employeeId}
                driver={driver}
                onDeleteClick={async (driver: Driver) => {
                  const confirmed = await confirmToast({
                    title: "Hapus Driver",
                    message: `Apakah Anda yakin ingin menghapus ${driver.name}? Tindakan ini tidak dapat dibatalkan.`,
                    confirmText: "Ya, Hapus",
                    cancelText: "Batal",
                    variant: "danger",
                  });
                  if (confirmed) {
                    await handleDeleteConfirm(driver);
                  }
                }}
                onDetailsClick={onDetailsDriver}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          setIsExportModalOpen(false);
          onExport?.(options);
        }}
        totalRows={drivers.length}
        title="Export Driver Data"
        description="Generate driver reports and performance data."
        columns={driverColumns}
      />
    </>
  );
}

import { useState, useEffect } from "react";
import { DriverTableRow, Driver } from "./driver-table-row";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useSearchParams } from "next/navigation";
import { AlertDialog } from "@/components/ui/alert";
import { ExportColumn, ModalExport } from "@/components/ui/export";

const driverColumns: ExportColumn[] = [
  { id: "name", label: "Driver Name", defaultChecked: true },
  { id: "employeeId", label: "Employee ID", defaultChecked: true },
  { id: "phoneNumber", label: "Phone Number", defaultChecked: true },
  { id: "email", label: "Email", defaultChecked: true },
  { id: "saldo", label: "Saldo", defaultChecked: true },
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

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  
  const  [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const  [alertMessage, setAlertMessage] = useState("");
  const  [alertType, setAlertType] = useState<"success" | "error">("success"); 

   // Tampilkan alert jika ada succes param di url
    useEffect(() => {
      const success = searchParams.get("success");
      const driver = searchParams.get("driver");
  
      if (success && driver) {
        const action = success === "updated" ? "Update" : "Registration";
        setAlertTitle(`${action} Successful`);
        setAlertMessage(`Driver ${decodeURIComponent(driver)} has been ${success} successfully.`);
        setAlertType("success");
        setIsAlertOpen(true);
  
        // Hapus query params dari URL agar alert tidak muncul lagi saat refresh
        window.history.replaceState({}, "", "/dashboard/driver");
      }
  
    }, [searchParams]);

  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const handleDeleteConfirm = async () => {
    if (driverToDelete && onDeleteDriver) {
      try {
        await onDeleteDriver(driverToDelete.employeeId);
        setAlertTitle("Delete Successful");
        setAlertMessage(`Driver ${driverToDelete.name} (${driverToDelete.employeeId}) has been deleted successfully`);
        setAlertType("success");
        setIsAlertOpen(true);
      } catch (err: any) {
        const msg = err?.message || `Failed to delete driver ${driverToDelete.name}. They may have active transactions.`;
        setAlertTitle("Delete Failed");
        setAlertMessage(msg);
        setAlertType("error");
        setIsAlertOpen(true);
      }
    }
    setIsConfirmDeleteOpen(false);
    setDriverToDelete(null);
  };

   const handleAlertClose = () => {
    setIsAlertOpen(false);
  }

  return (
    <>
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Driver Management
        </h2>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined text-base">download</span>
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4">Profile</th>
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Saldo</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {drivers.map((driver) => (
              <DriverTableRow
                key={driver.employeeId}
                driver={driver}
                onDeleteClick={setDriverToDelete}
                onDetailsClick={onDetailsDriver}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Dialog di luar tabel - tidak akan menyebabkan nesting error */}
      <ConfirmDialog
        isOpen={!!driverToDelete}
        onClose={() => setDriverToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Driver"
        message={
          driverToDelete
            ? `Are you sure you want to delete ${driverToDelete.name}? This action cannot be undone.`
            : ""
        }
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

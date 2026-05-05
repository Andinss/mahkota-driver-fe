import { useState, useEffect } from "react";
import { DriverTableRow, Driver } from "./driver-table-row";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useSearchParams } from "next/navigation";
import { AlertDialog } from "@/components/ui/alert";

interface DriverTableProps {
  drivers: Driver[];
  onDeleteDriver?: (driverId: string) => void;
}

export function DriverTable({ drivers, onDeleteDriver }: DriverTableProps) {
  const searchParams = useSearchParams();

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

  const handleDeleteConfirm = () => {
    if (driverToDelete && onDeleteDriver) {
      onDeleteDriver(driverToDelete.employeeId);
      console.log(`Deleting driver: ${driverToDelete.name} (${driverToDelete.employeeId})`,
      );
    }
    setIsConfirmDeleteOpen(false);
    setAlertTitle("Delete Successful");
    setAlertMessage(`Driver ${driverToDelete?.employeeId} has been deleted successfully`);
    setAlertType("success");
    setIsAlertOpen(true);
    setDriverToDelete(null);
  };

   const handleAlertClose = () => {
    setIsAlertOpen(false);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4">Profile</th>
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">License Type</th>
              <th className="px-6 py-4">Total Trips</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {drivers.map((driver) => (
              <DriverTableRow
                key={driver.employeeId}
                driver={driver}
                onDeleteClick={setDriverToDelete}
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

    </>
  );
}

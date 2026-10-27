"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  toastError,
  toastSuccess,
  confirmToast,
} from "@/components/ui/toast-provider";
import { driverApi } from "@/lib/api/driver";
import type { DriverItem, SupervisorOption } from "@/lib/types/driver";
import { getErrorMessage } from "@/lib/utils/error-message";

interface SupervisorCardProps {
  driver: DriverItem;
  /** Hanya Administrator & Owner (driver.assign_supervisor) yang boleh mengubah. */
  canAssign: boolean;
  /** Dipanggil dengan data driver terbaru agar UI langsung ter-update. */
  onChanged?: (driver: DriverItem) => void;
}

export function SupervisorCard({
  driver,
  canAssign,
  onChanged,
}: SupervisorCardProps) {
  const [options, setOptions] = useState<SupervisorOption[]>([]);
  const [selectedId, setSelectedId] = useState(driver.supervisor_id ?? "");
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedId(driver.supervisor_id ?? "");
  }, [driver.id, driver.supervisor_id]);

  useEffect(() => {
    if (!canAssign) return;
    let cancelled = false;
    setIsLoadingOptions(true);
    driverApi
      .getSupervisorOptions()
      .then((res) => {
        if (!cancelled) setOptions(res.data ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          toastError(getErrorMessage(err, "Gagal memuat daftar supervisor."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingOptions(false);
      });
    return () => {
      cancelled = true;
    };
  }, [canAssign]);

  const supervisorName = useMemo(() => {
    if (!driver.supervisor) return null;
    return driver.supervisor.fullname || driver.supervisor.username;
  }, [driver.supervisor]);

  const hasChanges = selectedId !== (driver.supervisor_id ?? "");

  const assign = async (
    supervisorId: string | null,
    successMessage: string,
  ) => {
    setIsSaving(true);
    try {
      const res = await driverApi.assignSupervisor(driver.id, supervisorId);
      toastSuccess(successMessage);
      setSelectedId(supervisorId ?? "");
      if (res.data) {
        onChanged?.(res.data);
      }
    } catch (err) {
      toastError(
        getErrorMessage(err, "Gagal menyimpan penunjukan supervisor."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const unassign = async () => {
    const confirmed = await confirmToast({
      title: "Lepas Penunjukan Supervisor?",
      message: `Lepas penunjukan supervisor untuk ${driver.first_name} ${driver.last_name}? Driver ini akan menjadi "belum ditunjuk".`,
      confirmText: "Lepas",
      cancelText: "Batal",
      variant: "warning",
    });
    if (!confirmed) return;
    await assign(null, "Penunjukan supervisor dilepas.");
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
      <div className="flex items-center gap-2 shrink-0">
        <span className="material-symbols-outlined text-indigo-500 text-lg">
          supervisor_account
        </span>
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Supervisor:
        </span>
        {supervisorName ? (
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {supervisorName}
          </span>
        ) : (
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
            Belum ditunjuk
          </span>
        )}
      </div>

      {canAssign && (
        <div className="flex items-center gap-2 w-full md:max-w-md md:ml-auto">
          <div className="flex-1">
            <Select
              value={selectedId}
              disabled={isLoadingOptions || isSaving}
              onChange={(e) => setSelectedId(e.target.value)}
              className="h-9 text-sm" // Sedikit lebih kecil agar pas di header
            >
              <option value="">
                {isLoadingOptions ? "Memuat..." : "Pilih Supervisor"}
              </option>
              {options.map((option) => {
                const isFull = option.remaining <= 0;
                const isCurrent = option.id === driver.supervisor_id;
                return (
                  <option
                    key={option.id}
                    value={option.id}
                    disabled={isFull && !isCurrent}
                  >
                    {option.fullname || option.username} ({option.driver_count}/
                    {option.max_drivers}
                    {isFull && !isCurrent ? " - penuh" : ""})
                  </option>
                );
              })}
            </Select>
          </div>
          <Button
            onClick={() =>
              void assign(
                selectedId || null,
                selectedId
                  ? "Supervisor berhasil ditunjuk."
                  : "Penunjukan supervisor dilepas.",
              )
            }
            disabled={
              isSaving ||
              (!hasChanges && Boolean(driver.supervisor_id)) ||
              (!driver.supervisor_id && !selectedId)
            }
            className="h-9 px-3 text-sm shrink-0"
          >
            {isSaving ? "..." : "Simpan"}
          </Button>
          {driver.supervisor_id && (
            <Button
              variant="danger"
              onClick={() => void unassign()}
              disabled={isSaving}
              className="h-9 px-3 text-sm shrink-0"
            >
              Lepas
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

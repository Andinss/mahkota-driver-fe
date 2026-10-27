"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { toastError, toastSuccess, confirmToast } from "@/components/ui/toast-provider";
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

export function SupervisorCard({ driver, canAssign, onChanged }: SupervisorCardProps) {
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

  const assign = async (supervisorId: string | null, successMessage: string) => {
    setIsSaving(true);
    try {
      const res = await driverApi.assignSupervisor(driver.id, supervisorId);
      toastSuccess(successMessage);
      setSelectedId(supervisorId ?? "");
      if (res.data) {
        onChanged?.(res.data);
      }
    } catch (err) {
      toastError(getErrorMessage(err, "Gagal menyimpan penunjukan supervisor."));
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
    <>
      <div className="bg-white dark:bg-slate-900 p-6 mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <span className="material-symbols-outlined text-indigo-500">
                supervisor_account
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
                Supervisor
              </p>
              {supervisorName ? (
                <>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {supervisorName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {driver.supervisor?.email}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  Belum ditunjuk
                </p>
              )}
            </div>
          </div>

          {canAssign && (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end lg:w-auto">
              <div className="w-full sm:w-72">
                <Select
                  label="Tunjuk / ganti supervisor"
                  value={selectedId}
                  disabled={isLoadingOptions || isSaving}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  <option value="">
                    {isLoadingOptions ? "Memuat supervisor..." : "Belum ditunjuk"}
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
              <div className="flex gap-2">
                <Button
                  onClick={() => void assign(selectedId || null, selectedId ? "Supervisor berhasil ditunjuk." : "Penunjukan supervisor dilepas.")}
                  disabled={
                    isSaving ||
                    (!hasChanges && Boolean(driver.supervisor_id)) ||
                    (!driver.supervisor_id && !selectedId)
                  }
                >
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </Button>
                {driver.supervisor_id && (
                  <Button
                    variant="danger"
                    onClick={() => void unassign()}
                    disabled={isSaving}
                  >
                    Lepas
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

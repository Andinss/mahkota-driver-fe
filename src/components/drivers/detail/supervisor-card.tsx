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
  canAssign: boolean;
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header Card */}
      <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-indigo-500 text-xl">
            supervisor_account
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Penanggung Jawab
          </p>
          {supervisorName ? (
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {supervisorName}
            </p>
          ) : (
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 leading-tight">
              Belum ditunjuk
            </p>
          )}
        </div>
      </div>

      {/* Body Card (Form) */}
      {canAssign && (
        <div className="p-4 md:p-6 flex-1 flex flex-col justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
              Tunjuk / Ganti Supervisor
            </label>
            <Select
              value={selectedId}
              disabled={isLoadingOptions || isSaving}
              onChange={(e) => setSelectedId(e.target.value)}
              className="h-10 text-sm w-full"
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
                    {isFull && !isCurrent ? " - Penuh" : ""})
                  </option>
                );
              })}
            </Select>
          </div>

          <div className="flex gap-2 w-full">
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
              className="flex-1 h-10 text-sm"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
            {driver.supervisor_id && (
              <Button
                variant="danger"
                onClick={() => void unassign()}
                disabled={isSaving}
                className="h-10 px-4 text-sm shrink-0"
              >
                Lepas
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Jika tidak punya akses edit, tampilkan info saja */}
      {!canAssign && (
        <div className="p-4 md:p-6 flex-1 bg-slate-50/50 dark:bg-slate-800/20 text-sm text-slate-500">
          {supervisorName
            ? `Email: ${driver.supervisor?.email || "-"}`
            : "Supervisor belum ditunjuk oleh Administrator."}
        </div>
      )}
    </div>
  );
}

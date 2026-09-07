"use client";
import { useState, useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { driverApi } from "@/lib/api/driver";
import type { DriverItem } from "@/lib/types/driver";

const imageBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");

const photoUrl = (path?: string) =>
  path
    ? path.startsWith("http") ? path : `${imageBase}/${path.replace(/^\//, "")}`
    : "";

interface DriverOption {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
}

interface PayerInfoProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onPayerSelect?: (name: string, id: string, employeeId: string) => void;
  selectedPayerId?: string; 
  hasSubmitted?: boolean;
  serverError?: string;
}

const PayerInfo = ({ 
  searchValue = "", 
  onSearchChange,
  onPayerSelect,
  selectedPayerId,
  hasSubmitted = false,
  serverError,
}: PayerInfoProps) => {
  const [filteredDrivers, setFilteredDrivers] = useState<DriverOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverOption | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedDriver && searchValue === selectedDriver.name) return;
    if (searchValue && searchValue.length >= 1) {
      setIsSearching(true);
      driverApi.getList({ search: searchValue, limit: 10 })
        .then((res) => {
          const items = (res?.data ?? []) as DriverItem[];
          const mapped: DriverOption[] = items.map((d) => ({
            id: d.id,
            employeeId: d.employee_id,
            name: `${d.first_name} ${d.last_name}`.trim(),
            avatar: photoUrl(d.profile_photo) || "",
          }));
          setFilteredDrivers(mapped);
          setShowDropdown(true);
        })
        .catch(() => {
          setFilteredDrivers([]);
        })
        .finally(() => setIsSearching(false));
    } else {
      setFilteredDrivers([]);
      setShowDropdown(false);
    }
  }, [searchValue, selectedDriver]);

  useEffect(() => {
    if (selectedPayerId) {
      driverApi.getList({ search: selectedPayerId, limit: 1 })
        .then((res) => {
          const items = (res?.data ?? []) as DriverItem[];
          if (items.length > 0) {
            const d = items[0];
            const driver: DriverOption = {
              id: d.id,
              employeeId: d.employee_id,
              name: `${d.first_name} ${d.last_name}`.trim(),
              avatar: photoUrl(d.profile_photo) || "",
            };
            setSelectedDriver(driver);
            onSearchChange?.(driver.name);
          }
        })
        .catch(() => {});
    }
  }, [selectedPayerId]);

  const handleSelectDriver = (driver: DriverOption) => {
    setSelectedDriver(driver);
    onSearchChange?.(driver.name);
    onPayerSelect?.(driver.name, driver.id, driver.employeeId);
    setShowDropdown(false);
  };

  const handleClearSelection = () => {
    onSearchChange?.("");
    setSelectedDriver(null);
    onPayerSelect?.("", "", "");
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-500 text-xl">person_search</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Informasi Payer
          </h3>
          <p className="text-xs text-slate-400">Cari dan pilih driver sebagai payer</p>
        </div>
      </div>

        {hasSubmitted && !selectedDriver && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2.5">
            <div className="size-6 rounded-full bg-red-100 dark:bg-red-800/40 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-red-500 text-sm">error</span>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{serverError || "Please select a valid driver as payer"}</p>
          </div>
        )}

        <div className="relative" ref={wrapperRef}>
          {selectedDriver ? (
            <div className="group flex items-center gap-4 rounded-xl bg-blue-50/80 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800/50 p-4">
              <div className="relative shrink-0">
                <Avatar
                  src={selectedDriver.avatar}
                  alt={selectedDriver.name}
                  size="lg"
                  className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 bg-center bg-cover shrink-0 ring-2 ring-white dark:ring-slate-800 shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {selectedDriver.name}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  {selectedDriver.employeeId && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-xs">badge</span>
                      <span className="font-mono text-xs font-medium">{selectedDriver.employeeId}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <span className="size-1.5 rounded-full bg-green-500" />
                    Active
                  </span>
                </div>
              </div>
              <button
                onClick={handleClearSelection}
                className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
                title="Change payer"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ring-1 ring-inset ring-transparent focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary focus-within:border-primary transition-all h-12">
                <div className="flex items-center justify-center pl-4 text-slate-400 dark:text-slate-500">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  placeholder="Cari ber nama atau ID karyawan..."
                  className="flex w-full flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 focus:ring-0 focus:outline-none h-full text-sm"
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value.replace(/[^a-zA-Z0-9\s'-]/g, ""))}
                  autoComplete="off"
                />
                {searchValue && (
                  <button
                    onClick={() => {
                      onSearchChange?.("");
                      setShowDropdown(false);
                    }}
                    className="flex items-center justify-center mr-2 size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}
              </div>

              {isSearching && (
                <div className="absolute z-10 w-full mt-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl p-5 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    Searching drivers...
                  </div>
                </div>
              )}

              {!isSearching && showDropdown && filteredDrivers.length > 0 && (
                <div className="absolute z-10 w-full mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-72 overflow-auto">
                  {filteredDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
                      onClick={() => handleSelectDriver(driver)}
                    >
                      <Avatar
                        src={driver.avatar}
                        alt={driver.name}
                        size="md"
                        className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-center bg-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{driver.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {driver.employeeId && (
                            <span className="inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[10px]">badge</span>
                              {driver.employeeId}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-base">chevron_right</span>
                    </div>
                  ))}
                </div>
              )}

              {!isSearching && showDropdown && searchValue.length >= 1 && filteredDrivers.length === 0 && (
                <div className="absolute z-10 w-full mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-6 text-center">
                  <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-2xl text-slate-400">search_off</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Driver tidak ditemukan</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Coba dengan nama atau ID lain</p>
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
};

export default PayerInfo;

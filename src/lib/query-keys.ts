/**
 * Kumpulan query key terpusat.
 *
 * Dipakai bersama oleh banyak halaman supaya cache bisa dipakai ulang:
 * mis. `driverKeys.me()` diambil sekali di halaman dashboard, lalu halaman
 * lain (profil, out-of-town, payment) memakai data yang sama dari cache.
 */
export const driverKeys = {
  all: ["driver"] as const,
  me: () => [...driverKeys.all, "me"] as const,
};

export const koinKeys = {
  all: ["koin"] as const,
  balance: (driverId: string) =>
    [...koinKeys.all, "balance", driverId] as const,
  /** Riwayat koin milik driver yang login (halaman "Koin Saya"). */
  myTransactions: (params?: Record<string, string | number | undefined>) =>
    [...koinKeys.all, "my-transactions", params ?? {}] as const,
};

export const financeKeys = {
  all: ["finance"] as const,
  myList: (params?: Record<string, string | number | undefined>) =>
    [...financeKeys.all, "my-list", params ?? {}] as const,
  myAdminFee: () => [...financeKeys.all, "my-admin-fee"] as const,
  myDailyPayments: (params?: Record<string, string | number | undefined>) =>
    [...financeKeys.all, "my-daily-payments", params ?? {}] as const,
};

export const outOfTownKeys = {
  all: ["out-of-town"] as const,
  myList: () => [...outOfTownKeys.all, "my-list"] as const,
  myStats: () => [...outOfTownKeys.all, "my-stats"] as const,
  list: (status?: string) =>
    [...outOfTownKeys.all, "list", status ?? "all"] as const,
  stats: () => [...outOfTownKeys.all, "stats"] as const,
};

export const rentalKeys = {
  all: ["rental"] as const,
  list: (params?: Record<string, string | number | undefined>) =>
    [...rentalKeys.all, "list", params ?? {}] as const,
  summary: () => [...rentalKeys.all, "summary"] as const,
};

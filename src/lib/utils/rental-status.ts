import { getTodayLocal } from "./format";

/**
 * Status tampilan rental.
 * - `active`    : kontrak sedang berjalan (hari ini di dalam rentang tanggal)
 * - `upcoming`  : kontrak belum mulai
 * - `completed` : kontrak sudah selesai (tanggal akhir terlewat)
 * - `stopped`   : dihentikan manual sebelum tanggal akhir
 */
export type RentalDisplayStatus =
  | "active"
  | "upcoming"
  | "completed"
  | "stopped";

/**
 * Menentukan status rental untuk keperluan tampilan.
 *
 * Kolom `status` dari backend hanya menandai penghentian manual (`stopped`),
 * sedangkan kontrak yang sudah lewat tanggal akhir tetap tersimpan sebagai
 * `active`. Karena itu status "berjalan/selesai" dihitung dari rentang tanggal,
 * sama seperti filter `active`/`upcoming`/`completed` di backend.
 */
export const getRentalDisplayStatus = (
  status: string | undefined | null,
  startDate: string | undefined | null,
  endDate: string | undefined | null,
): RentalDisplayStatus => {
  if (status === "stopped") return "stopped";

  // Tanggal dibandingkan sebagai string "YYYY-MM-DD" (zona waktu lokal).
  const today = getTodayLocal();
  if (startDate && today < startDate) return "upcoming";
  if (endDate && today > endDate) return "completed";
  return "active";
};

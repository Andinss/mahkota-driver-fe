// Tanggal dalam format YYYY-MM-DD sesuai zona waktu lokal.
export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Tanggal hari ini (YYYY-MM-DD) sesuai zona waktu lokal.
// Jangan pakai toISOString() untuk "hari ini": itu tanggal UTC, sehingga
// pukul 00.00-06.59 WIB tanggalnya masih tertinggal sehari.
export const getTodayLocal = (): string => formatLocalDate(new Date());

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const isDateOnly = (value: string): string | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? match[0] : null;
};

export const formatDateOnly = (value?: string | null): string => {
  if (!value) return "-";
  const dateOnlyPart = isDateOnly(value);
  if (dateOnlyPart) {
    const [y, m, d] = dateOnlyPart.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value?: string | null): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
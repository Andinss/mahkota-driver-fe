const imageBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

/**
 * Ubah path gambar dari backend (`image/...`) jadi URL lengkap.
 * - `blob:` / `data:` (pratinjau lokal) & URL absolut dibiarkan apa adanya.
 * - Path yang diawali `/` selain `/image/` dianggap aset frontend (public/).
 */
export const resolveImageUrl = (src?: string | null): string | null => {
  if (!src) return null;
  if (/^(https?:|blob:|data:)/.test(src)) return src;
  if (src.startsWith("/") && !src.startsWith("/image/")) return src;
  return `${imageBase}/${src.replace(/^\//, "")}`;
};

import { HttpClientError } from "../api-http";

/**
 * Pusat penanganan pesan error.
 *
 * Tujuan:
 * 1. Semua pesan gagal memakai bahasa Indonesia yang konsisten.
 * 2. Pesan dari backend tidak pernah membocorkan data internal
 *    (id, uuid, nomor, email, nama record, struktur database, dll).
 * 3. Setiap kegagalan selalu punya pesan fallback yang jelas.
 */

export const GENERIC_ERROR_MESSAGE = "Terjadi kesalahan. Silakan coba lagi.";
export const NETWORK_ERROR_MESSAGE =
  "Tidak bisa terhubung ke server. Periksa koneksi Anda.";
export const LOGIN_FAILED_MESSAGE = "Email atau password salah.";
export const FORBIDDEN_MESSAGE =
  "Anda tidak memiliki izin untuk melakukan aksi ini.";
export const SESSION_EXPIRED_MESSAGE =
  "Sesi Anda berakhir. Silakan login kembali.";
export const LOAD_FAILED_MESSAGE =
  "Gagal memuat data. Silakan coba muat ulang halaman.";
export const SERVER_ERROR_MESSAGE =
  "Server sedang bermasalah. Silakan coba lagi beberapa saat lagi.";

/** StatusText bawaan browser / framework yang tidak berguna untuk user. */
const NOISE_PATTERNS: RegExp[] = [
  /^(?:error|failed|failure|unknown|undefined|null|n\/a|—|-)\.?$/i,
  /^(?:bad request|unauthorized|forbidden|not found|method not allowed|internal server error|service unavailable|gateway time-?out)\.?$/i,
  /^http\/\d(?:\.\d)?\s+\d{3}.*$/i,
  /^\d{3}$/,
];

/**
 * Pola yang menandakan pesan berisi data/internal id
 * → pesan dibuang total dan diganti fallback.
 */
const SENSITIVE_PATTERNS: RegExp[] = [
  // uuid / hash / token
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
  /\b[A-Za-z0-9_-]{20,}\b/,
  // email
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
  // referensi id / primary key (internal field: driver_id, user_id, dsb.)
  /\b(?:id|ids|uuid|guid|nik|nip)\b/i,
  /_ids?\b/i,
  // nomor record / invoice / telepon panjang
  /#\d+/,
  /\b\d{4,}\b/,
  // isi struktur database & pesan exception framework
  /\b(?:sqlstate|pdoexception|stack ?trace|duplicate entry|foreign key|primary key|constraint|query builder|syntax error|undefined array key|null value|table|column|migration|eloquent)\b/i,
  // record spesifik: "record #1", "row with id", "model having ..."
  /\b(?:record|row|model|entity|object|instance)\s*(?:#|with|having|named|of type)\b/i,
];

/**
 * Terjemahan pesan error umum (backend / HTTP) ke bahasa Indonesia.
 * Hanya pesan yang aman (tanpa data) yang diterjemahkan di sini.
 */
const MESSAGE_TRANSLATIONS: Array<[RegExp, string]> = [
  [/^(?:unauthenticated|unauthorized)\.?$/i, SESSION_EXPIRED_MESSAGE],
  [/^forbidden\.?$/i, FORBIDDEN_MESSAGE],
  [/^not found\.?$/i, "Data tidak ditemukan."],
  [/^internal server error\.?$/i, SERVER_ERROR_MESSAGE],
  [/^bad request\.?$/i, "Permintaan tidak valid. Periksa kembali isian Anda."],
  [/^method not allowed\.?$/i, "Permintaan tidak diizinkan."],
  [/^unsupported media type\.?$/i, "Format berkas tidak didukung."],
  [/^payload too large\.?$/i, "Ukuran berkas terlalu besar."],
  [/^too many requests\.?$/i, "Terlalu banyak permintaan. Coba lagi dalam beberapa saat."],
  [/^service unavailable\.?$/i, "Layanan sedang tidak tersedia. Coba lagi nanti."],
  [/^gateway time-?out\.?$/i, "Server terlalu lama merespons. Coba lagi."],
  [/these credentials do not match our records/i, LOGIN_FAILED_MESSAGE],
  [/the given data was invalid\.?$/i, "Data yang dikirim tidak valid. Periksa kembali isian Anda."],
  [/has already been taken/i, "Data tersebut sudah digunakan."],
  [/^the password (?:field )?must be at least/i, "Password minimal 8 karakter."],
  [/\b(?:captcha|turnstile|security check)\b.*\b(?:fail(?:ed|ure)?|invalid|expired|missing)\b/i, "Verifikasi keamanan gagal. Selesaikan ulang verifikasi."],
  [/\btoken\b[^.]{0,40}\b(?:invalid|expired|is invalid|sudah kedaluwarsa)\b/i, "Tautan tidak valid atau sudah kedaluwarsa. Minta tautan baru."],
  [/\bnot found\.?$/i, "Data yang dicari tidak ditemukan."],
];

const truncate = (value: string, max = 200): string =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

/**
 * Tanggal/tahun sah (mis. rentang kontrak di pesan validasi) bukan data
 * sensitif — disembunyikan dulu supaya tidak ikut terdeteksi sebagai "id".
 */
const maskDates = (value: string): string =>
  value
    .replace(/\b(?:19|20)\d{2}-\d{2}-\d{2}\b/g, "TANGGAL")
    .replace(/\b\d{1,2}\/\d{1,2}\/(?:19|20)\d{2}\b/g, "TANGGAL")
    .replace(/\b(?:19|20)\d{2}\b/g, "TAHUN");

const containsSensitiveData = (message: string): boolean => {
  const masked = maskDates(message);
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(masked));
};

const isNoise = (message: string): boolean =>
  NOISE_PATTERNS.some((pattern) => pattern.test(message));

/**
 * Bersihkan pesan error mentah (biasanya dari backend).
 *
 * - Pesan kosong / noise  → `fallback`
 * - Pesan berisi id/data  → `fallback` (tidak pernah bocorkan data)
 * - Pesan umum dikenal     → terjemahan Indonesia
 * - Selain itu             → pesan asli (sudah pasti tanpa data)
 */
export function sanitizeErrorMessage(
  raw: unknown,
  fallback: string = GENERIC_ERROR_MESSAGE,
): string {
  const message = typeof raw === "string" ? raw.trim() : "";
  if (!message) return fallback;

  const translated =
    MESSAGE_TRANSLATIONS.find(([pattern]) => pattern.test(message))?.[1] ??
    message;

  // Pesan yang berisi id/data internal tidak pernah ditampilkan.
  if (containsSensitiveData(message) || containsSensitiveData(translated)) {
    return fallback;
  }
  // StatusText / pesan noise framework tidak bermakna untuk user.
  if (isNoise(translated)) return fallback;

  return truncate(translated);
}

/** Ambil pesan error dari objek error apa pun, selalu aman untuk ditampilkan. */
export function getErrorMessage(
  error: unknown,
  fallback: string = GENERIC_ERROR_MESSAGE,
): string {
  if (error instanceof HttpClientError) {
    if (error.statusCode === 0) return NETWORK_ERROR_MESSAGE;
    if (error.statusCode === 401) return SESSION_EXPIRED_MESSAGE;
    if (error.statusCode === 403) return FORBIDDEN_MESSAGE;
    if (error.statusCode >= 500) return SERVER_ERROR_MESSAGE;
    return sanitizeErrorMessage(error.message, fallback);
  }

  if (error instanceof Error) {
    return sanitizeErrorMessage(error.message, fallback);
  }

  return fallback;
}

/** Pesan untuk kegagalan login — tidak pernah menyinggung data akun. */
export function getLoginErrorMessage(error: unknown): string {
  if (error instanceof HttpClientError) {
    if (error.statusCode === 0) return NETWORK_ERROR_MESSAGE;
    if (error.statusCode === 401) return LOGIN_FAILED_MESSAGE;
    if (error.statusCode >= 500) return SERVER_ERROR_MESSAGE;

    const message = (error.message || "").toLowerCase();
    if (
      /credential|password|username|email|account|user|login|masuk|salah/.test(
        message,
      )
    ) {
      return LOGIN_FAILED_MESSAGE;
    }
    return sanitizeErrorMessage(error.message, "Login gagal. Silakan coba lagi.");
  }

  return "Login gagal. Silakan coba lagi.";
}

import type { Rekening } from "@/lib/types/rekening";

export const dummyRekening: Rekening[] = [
  {
    id: "rkn-001",
    code: "RKN-001",
    name: "Rekening Operasional Utama",
    bank_name: "Bank Central Asia (BCA)",
    account_number: "1234567890",
    account_holder: "PT Mahkota Drive",
    type: "utama",
    balance: 128450000,
    description: "Rekening utama untuk menerima pembayaran sewa harian dan bulanan.",
    is_active: true,
    created_at: "2025-01-15T08:00:00.000Z",
    updated_at: "2025-09-20T10:30:00.000Z",
  },
  {
    id: "rkn-002",
    code: "RKN-002",
    name: "Rekening Kas Operasional Mandiri",
    bank_name: "Bank Mandiri",
    account_number: "0987654321",
    account_holder: "PT Mahkota Drive",
    type: "reguler",
    balance: 37500000,
    description: "Rekening cadangan untuk transaksi kas dan pembayaran vendor kendaraan.",
    is_active: true,
    created_at: "2025-03-02T09:15:00.000Z",
    updated_at: "2025-08-11T14:05:00.000Z",
  },
];

export const bankOptions: string[] = [
  "Bank Central Asia (BCA)",
  "Bank Mandiri",
  "Bank Negara Indonesia (BNI)",
  "Bank Rakyat Indonesia (BRI)",
  "Bank Syariah Indonesia (BSI)",
  "Bank Permata",
  "Bank CIMB Niaga",
  "Bank Danamon",
];
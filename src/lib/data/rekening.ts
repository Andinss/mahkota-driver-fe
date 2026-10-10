import type { Rekening } from "@/lib/types/rekening";

export const dummyRekening: Rekening[] = [
  {
    id: "rkn-001",
    code: "RKN-001",
    method: "bank",
    name: "Rekening Operasional Utama",
    provider: "Bank Central Asia (BCA)",
    account_number: "1234567890",
    account_holder: "PT Mahkota Drive",
    image_url: null,
    description: "Rekening utama untuk menerima pembayaran sewa harian dan bulanan.",
    is_active: true,
    created_at: "2025-01-15T08:00:00.000Z",
    updated_at: "2025-09-20T10:30:00.000Z",
  },
  {
    id: "rkn-002",
    code: "RKN-002",
    method: "e_wallet",
    name: "E-Wallet Operasional Driver",
    provider: "GoPay",
    account_number: "081234567890",
    account_holder: "PT Mahkota Drive",
    image_url: null,
    description: "E-Wallet untuk top up saldo driver dan pembayaran vendor.",
    is_active: true,
    created_at: "2025-03-02T09:15:00.000Z",
    updated_at: "2025-08-11T14:05:00.000Z",
  },
  {
    id: "rkn-003",
    code: "RKN-003",
    method: "qris",
    name: "QRIS Merchant Mahkota",
    provider: null,
    account_number: null,
    account_holder: null,
    image_url: "/qris-placeholder.svg",
    description: "Kode QRIS untuk penerimaan pembayaran tunai driver & pelanggan.",
    is_active: true,
    created_at: "2025-05-19T07:45:00.000Z",
    updated_at: "2025-07-28T16:20:00.000Z",
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

export const eWalletOptions: string[] = [
  "GoPay",
  "OVO",
  "DANA",
  "ShopeePay",
  "LinkAja",
  "Sakuku (BCA)",
  "Livin' Mandiri",
];
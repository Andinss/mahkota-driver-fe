import { getAccessToken } from "../token";
import { HttpClientError } from "../api-http";

const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
};

export interface ContractPreviewPayload {
  driver_id?: string;
  vehicle_id?: string;
  rental_id?: string;
  start_date?: string;
  end_date?: string;
  total_duration?: number;
  daily_rate?: number;
  rental_duration?: string;
  rental_service?: string;
}

export interface ContractPreviewFile {
  blob: Blob;
  filename: string;
}

export const rentalContractApi = {
  // Ambil dokumen kontrak (.docx) hasil generate backend berdasarkan
  // driver & kendaraan yang dipilih pada form rental.
  getPreview: async (payload: ContractPreviewPayload): Promise<ContractPreviewFile> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(`${getBaseUrl()}/rental-contract/preview`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
    } catch {
      throw new HttpClientError(
        "Tidak bisa terhubung ke server. Periksa koneksi Anda.",
        0,
      );
    }

    if (!response.ok) {
      let message = "Gagal membuat preview kontrak";
      try {
        const data = (await response.json()) as { message?: string | string[] };
        if (Array.isArray(data?.message)) message = data.message[0] || message;
        else if (typeof data?.message === "string" && data.message) message = data.message;
      } catch {
        // ignore
      }
      throw new HttpClientError(message, response.status);
    }

    const disposition = response.headers.get("Content-Disposition") || "";
    let filename = "kontrak-sewa.docx";
    const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?(.+?)["']?$/);
    if (match) filename = match[1];

    return { blob: await response.blob(), filename };
  },
};

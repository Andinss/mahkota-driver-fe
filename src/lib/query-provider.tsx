"use client";

import { useState, type ReactNode } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { toastError } from "@/components/ui/toast-provider";
import {
  LOAD_FAILED_MESSAGE,
  getErrorMessage,
} from "@/lib/utils/error-message";

/**
 * Default cache policy untuk seluruh aplikasi.
 * - `staleTime` 30 detik: pindah halaman bolak-balik langsung menampilkan data
 *   dari cache (tanpa spinner), lalu disinkronkan ulang di belakang layar.
 * - `retry` 1: cukup untuk menutupi backend dev yang sedang recompile.
 * - `refetchOnWindowFocus`: data diperbarui saat tab kembali aktif.
 *
 * Setiap kegagalan load data selalu memunculkan toast error (pesan aman,
 * tanpa bocoran id/data) supaya user tahu apa yang gagal.
 */
function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Refetch di belakang layar yang gagal: senyap, hanya yang initial load
        // (belum ada data sama sekali) yang ditampilkan ke user.
        if (query.state.data !== undefined) return;
        toastError(getErrorMessage(error, LOAD_FAILED_MESSAGE));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: true,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    // Server: selalu buat client baru agar tidak ada cache antar-request.
    return makeQueryClient();
  }
  // Browser: pakai singleton supaya cache bertahan navigasi klien.
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // useState agar client tidak dibuat ulang saat render pertama (Suspense).
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

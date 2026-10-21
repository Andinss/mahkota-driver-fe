"use client";

import { useState, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";

/**
 * Default cache policy untuk seluruh aplikasi.
 * - `staleTime` 30 detik: pindah halaman bolak-balik langsung menampilkan data
 *   dari cache (tanpa spinner), lalu disinkronkan ulang di belakang layar.
 * - `retry` 1: cukup untuk menutupi backend dev yang sedang recompile.
 * - `refetchOnWindowFocus`: data diperbarui saat tab kembali aktif.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
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
  // Browser: pakai singleton supaya cache bertahan antar navigasi klien.
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

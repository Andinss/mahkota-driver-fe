"use client";

import { Pagination } from "@/components/ui/pagination";

interface VendorPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPageSize?: boolean;
}

export function VendorPagination(props: VendorPaginationProps) {
  return <Pagination {...props} />;
}
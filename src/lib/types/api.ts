export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiResponsePaginated<T> {
  statusCode: number;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}

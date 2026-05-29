import { getAccessToken, clearTokens } from "./token";
import type { ApiError } from "./types/api";

class HttpClientError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "HttpClientError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
};

const buildUrl = (endpoint: string, params?: Record<string, string | number | undefined>): string => {
  const base = `${getBaseUrl()}${endpoint}`;
  if (!params) return base;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const qs = searchParams.toString();
  return qs ? `${base}?${qs}` : base;
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string | number | undefined>,
): Promise<T> => {
  const url = buildUrl(endpoint, params);
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    throw new HttpClientError("Unauthorized", 401);
  }

  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        statusCode: response.status,
        message: response.statusText || "An error occurred",
      };
    }
    throw new HttpClientError(
      errorData.message || "Request failed",
      response.status,
      errorData.errors,
    );
  }

  const result = await response.json();
  return result as T;
};

export const api = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
  ) => request<T>(endpoint, { method: "GET" }, params),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),

  upload: <T>(endpoint: string, formData: FormData) =>
    request<T>(endpoint, {
      method: "POST",
      body: formData,
    }),

  uploadPut: <T>(endpoint: string, formData: FormData) =>
    request<T>(endpoint, {
      method: "PUT",
      body: formData,
    }),
};

export { HttpClientError };

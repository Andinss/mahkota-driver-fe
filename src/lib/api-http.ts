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

const extractMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as ApiError | { message?: string | string[] };
    const message = data?.message;
    if (Array.isArray(message)) return message[0] || "Request failed";
    if (typeof message === "string" && message) return message;
    return response.statusText || "Request failed";
  } catch {
    return response.statusText || "Request failed";
  }
};

const isJwtExpired = (token: string): boolean => {
  try {
    const part = token.split(".")[1];
    if (!part) return false;
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
};

let unauthorizedRedirecting = false;

const redirectToLogin = (): void => {
  if (typeof window === "undefined") return;
  if (unauthorizedRedirecting) return;
  unauthorizedRedirecting = true;
  clearTokens();
  window.location.href = "/auth/login";
};

const handle401 = async (
  response: Response,
  hadToken: boolean,
  retry: () => Promise<Response>,
): Promise<never> => {
  const message = await extractMessage(response);

  if (!hadToken) {
    throw new HttpClientError(message, 401);
  }

  const token = getAccessToken();
  if (token && isJwtExpired(token)) {
    redirectToLogin();
    throw new HttpClientError(message, 401);
  }

  let retried: Response;
  try {
    retried = await retry();
  } catch {
    throw new HttpClientError(message, 401);
  }

  if (retried.status === 401) {
    const retryMessage = await extractMessage(retried);
    redirectToLogin();
    throw new HttpClientError(retryMessage, 401);
  }

  if (!retried.ok) {
    const retryErr = await extractMessage(retried);
    throw new HttpClientError(retryErr, retried.status);
  }

  try {
    return (await retried.json()) as never;
  } catch {
    return undefined as never;
  }
};

const parseJsonOrThrow = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    const message = await extractMessage(response);
    let errors: Record<string, string[]> | undefined;
    try {
      const body = (await response.json()) as ApiError;
      errors = body?.errors;
    } catch {
      // ignore
    }
    throw new HttpClientError(message, response.status, errors);
  }

  if (response.status === 204) return undefined;
  return response.json();
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string | number | undefined>,
): Promise<T> => {
  const url = buildUrl(endpoint, params);
  const accessToken = getAccessToken();
  const hadToken = !!accessToken;

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

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch {
    throw new HttpClientError("Tidak bisa terhubung ke server. Periksa koneksi Anda.", 0);
  }

  if (response.status === 401) {
    return handle401(response, hadToken, async () => {
      const retryHeaders: Record<string, string> = { ...headers };
      const current = getAccessToken();
      if (current) {
        retryHeaders["Authorization"] = `Bearer ${current}`;
      } else {
        delete retryHeaders["Authorization"];
      }
      return fetch(url, { ...options, headers: retryHeaders });
    }) as Promise<T>;
  }

  const result = await parseJsonOrThrow(response);
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

  deleteWithBody: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "DELETE",
      body: JSON.stringify(body),
    }),

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

  download: async (
    endpoint: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<{ blob: Blob; filename: string; contentType: string }> => {
    const url = buildUrl(endpoint, params);
    const accessToken = getAccessToken();
    const hadToken = !!accessToken;

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let response: Response;
    try {
      response = await fetch(url, { headers });
    } catch {
      throw new HttpClientError("Tidak bisa terhubung ke server. Periksa koneksi Anda.", 0);
    }

    if (response.status === 401) {
      const message = await extractMessage(response);
      if (hadToken) {
        const token = getAccessToken();
        if (!token || isJwtExpired(token)) {
          redirectToLogin();
          throw new HttpClientError(message, 401);
        }
        try {
          const retryHeaders: Record<string, string> = { ...headers };
          const current = getAccessToken();
          if (current) retryHeaders["Authorization"] = `Bearer ${current}`;
          response = await fetch(url, { headers: retryHeaders });
        } catch {
          throw new HttpClientError(message, 401);
        }
        if (response.status === 401) {
          redirectToLogin();
          throw new HttpClientError(message, 401);
        }
      } else {
        throw new HttpClientError(message, 401);
      }
    }

    if (!response.ok) {
      const errorData = await extractMessage(response);
      throw new HttpClientError(errorData, response.status);
    }

    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") || "";
    let filename = `export_${Date.now()}`;
    const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?(.+?)["']?$/);
    if (match) {
      filename = match[1];
    }

    return {
      blob,
      filename,
      contentType: response.headers.get("Content-Type") || "",
    };
  },
};

export { HttpClientError };

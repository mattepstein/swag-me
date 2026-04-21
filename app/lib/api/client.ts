import type { ApiErrorResponse } from "@/app/lib/models";

function getBaseUrl(): string {
  const url = process.env.SWAG_API_BASE_URL;
  if (!url) throw new Error("SWAG_API_BASE_URL is not set");
  return url;
}

function getBypassToken(): string {
  const token = process.env.SWAG_API_BYPASS_TOKEN;
  if (!token) throw new Error("SWAG_API_BYPASS_TOKEN is not set");
  return token;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "method"> & {
  params?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const baseUrl = getBaseUrl();
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const segment = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${segment}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; headers: Headers }> {
  const { params, headers: extraHeaders, ...fetchOptions } = options;
  const url = buildUrl(path, params);

  const res = await fetch(url, {
    method,
    ...fetchOptions,
    headers: {
      "x-vercel-protection-bypass": getBypassToken(),
      ...extraHeaders,
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new ApiError(
      res.status,
      "INVALID_RESPONSE",
      `Expected JSON but received ${contentType || "unknown content-type"} from ${method} ${url}`,
    );
  }

  const json = await res.json();
  if (!res.ok || json.success === false) {
    const err = (json as ApiErrorResponse).error ?? {
      code: "UNKNOWN",
      message: res.statusText,
    };
    throw new ApiError(res.status, err.code, err.message, err.details);
  }

  return { data: json as T, headers: res.headers };
}

export function get<T>(path: string, options?: RequestOptions) {
  return request<T>("GET", path, options);
}

export function post<T>(path: string, options?: RequestOptions) {
  return request<T>("POST", path, options);
}

export function patch<T>(path: string, options?: RequestOptions) {
  return request<T>("PATCH", path, options);
}

export function del<T>(path: string, options?: RequestOptions) {
  return request<T>("DELETE", path, options);
}

import { ApiError, createApiError } from './apiErrors';

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://brainmintcrewpal.onrender.com';

export const TOKEN_STORAGE_KEY = 'crewpal_access_token';

const DEFAULT_TIMEOUT_MS = 15000;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

const buildUrl = (
  path: string,
  params?: ApiRequestOptions['params']
): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  if (!params) {
    return url;
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();

  return query ? `${url}?${query}` : url;
};

const buildHeaders = (
  options: ApiRequestOptions,
  token: string | null
): Headers => {
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

const emitUnauthorized = (): void => {
  window.dispatchEvent(new Event('crewpal:unauthorized'));
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const token =
    window.localStorage.getItem(TOKEN_STORAGE_KEY) ||
    window.localStorage.getItem('crewpal_token') ||
    window.sessionStorage.getItem('crewpal_token');

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  const externalSignal = options.signal;

  if (externalSignal?.aborted) {
    controller.abort();
  } else {
    externalSignal?.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(buildUrl(path, options.params), {
      method: options.method ?? 'GET',
      headers: buildHeaders(options, token),
      body:
        options.body === undefined
          ? undefined
          : JSON.stringify(options.body),
      signal: controller.signal,
    });

    if (response.status === 401) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      emitUnauthorized();
    }

    if (!response.ok) {
      throw new ApiError(
        response.status === 401
          ? 'unauthorized'
          : response.status === 403
            ? 'forbidden'
            : response.status === 404
              ? 'not_found'
              : 'server',
        response.status === 401
          ? 'Your session has expired. Please log in again.'
          : response.status === 403
            ? 'You do not have permission to perform this action.'
            : response.status === 404
              ? 'The requested resource was not found.'
              : 'Something went wrong on the server. Please try again later.',
        response.status
      );
    }

    const contentType = response.headers.get('Content-Type') ?? '';

    if (contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    return (await response.text()) as T;
  } catch (error) {
    throw createApiError(error);
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const api = {
  get: <T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};

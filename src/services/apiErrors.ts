export type ApiErrorCode =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'server'
  | 'unknown';

const STATUS_TO_CODE: Record<number, ApiErrorCode> = {
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  500: 'server',
};

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  readonly details?: unknown;

  constructor(
    code: ApiErrorCode,
    message: string,
    status?: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const createApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('timeout', 'The request timed out. Please try again.');
  }

  if (error instanceof TypeError) {
    return new ApiError(
      'network',
      'Network error. Please check your internet connection.'
    );
  }

  const status = (error as { status?: number })?.status;

  if (status !== undefined) {
    const code = STATUS_TO_CODE[status] ?? 'server';
    const message =
      code === 'server'
        ? 'Something went wrong on the server. Please try again later.'
        : `Request failed with status ${status}.`;
    return new ApiError(code, message, status);
  }

  return new ApiError('unknown', 'An unexpected error occurred.');
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};

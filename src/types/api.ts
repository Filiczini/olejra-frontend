export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error?: unknown };

export type ApiErrorResponse = {
  message?: string;
  code?: string;
};
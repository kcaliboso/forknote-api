export interface AppError extends Error {
  errors: [];
  statusCode?: number;
  status?: string;
  code?: number;
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
}

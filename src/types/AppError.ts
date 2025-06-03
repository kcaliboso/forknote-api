export interface AppError extends Error {
  errors: [];
  statusCode?: number;
  status?: string;
}

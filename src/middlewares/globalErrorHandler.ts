import { AppError } from "#types/AppError.js";
import type { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
  error.statusCode = error.statusCode ?? 500;
  error.status = error.status ?? "error";

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

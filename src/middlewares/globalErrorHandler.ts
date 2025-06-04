import { AppError } from "#types/AppError.js";
import { ValidationError } from "#types/validations/ValidationError.js";
import type { Request, Response, NextFunction } from "express";

const validationError = (error: AppError, res: Response) => {
  error.message = "Validation Error";
  error.status = error.status ?? "error";
  error.statusCode = error.statusCode ?? 422;

  const details = Object.values(error.errors).map((el: ValidationError) => {
    return {
      message: el.message,
      path: el.path,
    };
  });

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    details,
  });
};

const tokenError = (error: AppError, res: Response) => {
  error.message = "Invalid token. Please make sure you are logged in.";
  error.status = error.status ?? "error";
  error.statusCode = error.statusCode ?? 401;

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

export const globalErrorHandler = (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
  if (error.name === "ValidationError") {
    validationError(error, res);
    return;
  }

  if (error.name === "JsonWebTokenError") {
    tokenError(error, res);
    return;
  }
  error.statusCode = error.statusCode ?? 500;
  error.status = error.status ?? "error";

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    details: error.errors,
  });
};

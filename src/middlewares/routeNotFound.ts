import { AppErrorClass } from "#utils/appErrorClass.js";
import type { NextFunction, Request, Response } from "express";

export const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppErrorClass(`Route ${req.originalUrl} cannot be found`, 404));
};

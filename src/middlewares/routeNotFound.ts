import type { Request, Response } from "express";

export const routeNotFound = (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} cannot be found`,
  });
};

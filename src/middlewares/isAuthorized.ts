import type { Request, Response, NextFunction } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user);

  // if role is admin, we can create, read, update and delete any recipe

  // if role is customer, we can only update and delete recipes we own
  next();
};

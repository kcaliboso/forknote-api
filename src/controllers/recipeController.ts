import type { NextFunction, Request, Response } from "express";

/** Testing only, remove after implementing real id query on checkResource */
const ids = [1, 2, 3];

export const index = (req: Request, res: Response) => {
  res.status(200).json({
    data: null,
    message: "Recipe List",
    status: 200,
  });
};

export const show = (req: Request, res: Response) => {
  const id = req.params.id;

  res.status(200).json({
    data: {
      id,
    },
    message: "Recipe Information",
    status: 200,
  });
};

export const store = (req: Request, res: Response) => {
  // For now we'll not fix this because we are going to use zod later on
  const body = req.body;

  res.status(200).json({
    data: body,
    message: "Recipe Created",
    status: 200,
  });
};

export const update = (req: Request, res: Response) => {
  const body = req.body;

  res.status(200).json({
    data: body,
    message: "Recipe Updated",
    status: 200,
  });
};

export const destroy = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Recipe Deleted",
    status: 200,
  });
};

export const checkResource = (req: Request, res: Response, next: NextFunction, value: string) => {
  // TODO: Change this to real query on next task
  if (!ids.find((id) => id === parseInt(value))) {
    res.status(404).json({
      message: "Recipe ID not found",
    });
  }
  next();
};

import type { Request, Response, NextFunction } from "express";
import { ParsedQs } from "qs";

import type { ParamsDictionary } from "express-serve-static-core";

export type AsyncRequestHandler<P = ParamsDictionary, ResBody = unknown, ReqBody = unknown, ReqQuery = ParsedQs> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
) => Promise<unknown>;

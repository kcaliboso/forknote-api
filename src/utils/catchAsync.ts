import type { RequestHandler } from "express";

import type { AsyncRequestHandler } from "#types/AsyncRequestHandler.js";

export const catchAsync = <P = unknown, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>(
  fn: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    fn(req, res, next).catch((err: unknown) => {
      next(err);
    });
  };
};

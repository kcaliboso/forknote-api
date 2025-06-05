import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import type { AsyncRequestHandler } from "../types/AsyncRequestHandler";
import { ParsedQs } from "qs";
import ApiResponse from "../types/responses/ApiResponse";

export const catchAsync = <P = ParamsDictionary, ResBody = ApiResponse<unknown>, ReqBody = unknown, ReqQuery = ParsedQs>(
  fn: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    fn(req, res, next).catch((err: unknown) => {
      next(err);
    });
  };
};

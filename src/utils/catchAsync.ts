import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import type { AsyncRequestHandler } from "#types/AsyncRequestHandler.js";
import { ParsedQs } from "qs";
import ApiResponse from "#types/responses/ApiResponse.js";
import { UserDocument } from "#types/models/User.js";
import { RecipeDocument } from "#types/models/Recipe.js";

type ResBodies = ApiResponse<unknown>;

type ReqBodies = UserDocument | RecipeDocument;

export const catchAsync = <P = ParamsDictionary, ResBody extends ResBodies = ResBodies, ReqBody extends ReqBodies = ReqBodies, ReqQuery = ParsedQs>(
  fn: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    fn(req, res, next).catch((err: unknown) => {
      next(err);
    });
  };
};

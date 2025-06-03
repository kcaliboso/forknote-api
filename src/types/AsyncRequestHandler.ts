import type { Request, Response, NextFunction } from "express";
import ApiResponse from "./responses/ApiResponse";
import { UserDocument } from "./models/User";
import { RecipeDocument } from "./models/Recipe";
import { ParsedQs } from "qs";

import type { ParamsDictionary } from "express-serve-static-core";

type AllowedResBody = ApiResponse<unknown>;
type AllowedReqBody = UserDocument | RecipeDocument;

export type AsyncRequestHandler<
  P = ParamsDictionary,
  ResBody extends AllowedResBody = AllowedResBody,
  ReqBody extends AllowedReqBody = AllowedReqBody,
  ReqQuery = ParsedQs,
> = (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => Promise<unknown>;

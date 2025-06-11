import { IndexQueryType } from "../../types/filters/RecipeFilters";
import ApiResponse from "../../types/responses/ApiResponse";
import { RequestHandler } from "express";
import { Document } from "mongoose";

import type { ParamsDictionary } from "express-serve-static-core";
import { UserDocument } from "./User";
import { ReviewDocument } from "./Review";

export interface Recipe {
  name: string;
  ingredients: string[];
  likes?: number;
  images?: string[];
  cover?: string;
  createdAt: Date;
  owner: UserDocument;
  reviews: ReviewDocument[];
}

export interface RecipeDocument extends Recipe, Document {}

export interface Query {
  name?: string;
  ratings?: number;
}

// Fourth type goes to QueryBody
// RequestHandler is <Params, Response, Request, QueryBody>
export type ListRecipeHandler = RequestHandler<ParamsDictionary, ApiResponse<RecipeDocument[]>, RecipeDocument, IndexQueryType>;
export type GetRecipeHandler = RequestHandler<ParamsDictionary, ApiResponse<RecipeDocument>, RecipeDocument>;
export type UpdateRecipeHandler = RequestHandler<ParamsDictionary, ApiResponse<RecipeDocument>, Partial<RecipeDocument>>;
export type CreateRecipeHandler = RequestHandler<ParamsDictionary, ApiResponse<RecipeDocument>, RecipeDocument>;
export type DeleteRecipeHandler = RequestHandler<ParamsDictionary, ApiResponse<null>, RecipeDocument>;

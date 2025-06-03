import { IndexQueryType } from "#types/filters/RecipeFilters.js";
import ApiResponse from "#types/responses/ApiResponse.js";
import { RequestHandler } from "express";
import { Document } from "mongoose";

export interface Recipe {
  name: string;
  ingredients: string[];
  ratings?: number;
  likes?: number;
  images?: string[];
  cover?: string;
  createdAt: Date;
}

export interface RecipeDocument extends Recipe, Document {}

export interface Query {
  name?: string;
  ratings?: number;
}

// Fourth type goes to QueryBody
// RequestHandler is <Params, Response, Request, QueryBody>
export type ListRecipeHandler = RequestHandler<unknown, ApiResponse<RecipeDocument[]>, RecipeDocument, IndexQueryType>;
export type GetRecipeHandler = RequestHandler<{ id: string }, ApiResponse<RecipeDocument>, unknown>;
export type UpdateRecipeHandler = RequestHandler<{ id: string }, ApiResponse<RecipeDocument>, Partial<RecipeDocument>>;
export type CreateRecipeHandler = RequestHandler<unknown, ApiResponse<RecipeDocument>, RecipeDocument>;
export type DeleteRecipeHandler = RequestHandler<{ id: string }, ApiResponse<null>, unknown>;

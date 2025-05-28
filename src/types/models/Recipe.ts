import ApiResponse from "#types/responses/ApiResponse.js";
import { RequestHandler } from "express";
import { Document } from "mongoose";

interface Recipe {
  name: string;
  ingredients: string[];
  ratings?: number;
  images?: string[];
  cover?: string;
  createdAt: Date;
}

export interface RecipeDocument extends Recipe, Document {}

export interface Query {
  name?: string;
  ratings?: number;
}

export type ListRecipeHandler = RequestHandler<unknown, ApiResponse<Recipe[]>, Recipe>;
export type GetRecipeHandler = RequestHandler<{ id: string }, ApiResponse<Recipe>, unknown>;
export type UpdateRecipeHandler = RequestHandler<{ id: string }, ApiResponse<Recipe>, Partial<Recipe>>;
export type CreateRecipeHandler = RequestHandler<unknown, ApiResponse<Recipe>, Recipe>;
export type DeleteRecipeHandler = RequestHandler<{ id: string }, ApiResponse<null>, unknown>;

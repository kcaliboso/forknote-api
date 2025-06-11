import { Document } from "mongoose";
import { UserDocument } from "./User";
import { RecipeDocument } from "./Recipe";

export interface Review {
  text: string;
  rating: number;
  user: UserDocument;
  recipe: RecipeDocument;
}

export interface ReviewDocument extends Review, Document {}

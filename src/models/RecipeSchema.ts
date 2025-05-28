import { RecipeDocument } from "#types/models/Recipe.js";
import mongoose, { Model } from "mongoose";
// import User from "./UserSchema";

const recipeSchema = new mongoose.Schema<RecipeDocument>(
  {
    name: {
      type: String,
      required: [true, "A recipe must have a name"],
      trim: true,
    },
    ingredients: {
      type: [String],
      required: [true, "A recipe must have ingredients"],
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0,
        message: "A recipe must have ingredients",
      },
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
    },
    cover: {
      type: String,
    },
    // owner: {
    //   type: User,
    //   required: [true, "A recipe must have an owner"],
    // },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  },
);

export const Recipe: Model<RecipeDocument> = mongoose.model<RecipeDocument>("Recipe", recipeSchema);

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
    // outputted as json and object, we will append the virtual properties
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Query Middleware Practice
// Use mongoose Query type and inside that is the result and raw document types, that's
// why we put two RecipeDocument because our results and raw document is the same.
// recipeSchema.pre<Query<RecipeDocument, RecipeDocument>>(/^find/, function (next) {
//   // remove recipes with 0 ratings
//   // the "this" here refers to the query, so it was just chained.
//   this.find({
//     ratings: {
//       $ne: 0,
//     },
//   });
//   next();
// });

// this also removes it from findById, we can't use findById because
// it's a wrapper, we need to use the under the hook query which is, findOne
// but we can just regex the hook name to /^find/, meaning
// all the hooks that starts with find
// recipeSchema.pre("findOne", function (next) {
// });

// Aggregate Middleware
// recipeSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift() // this can manipulate the pipeline code we have
//   next();
// });

// Custom Validators on column
// validate: {
//   // validators only points to current doc on New document creation
//   validator: function (val) {
//     return ...
//   },
//   message: "custom message"
// }
export const Recipe: Model<RecipeDocument> = mongoose.model<RecipeDocument>("Recipe", recipeSchema);

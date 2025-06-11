import { buildQuery } from "../api/recipe/api";
import { Recipe } from "../models/RecipeSchema";
import {
  CreateRecipeHandler,
  DeleteRecipeHandler,
  GetRecipeHandler,
  ListRecipeHandler,
  RecipeDocument,
  UpdateRecipeHandler,
} from "../types/models/Recipe";
import { UserDocument } from "../types/models/User";
import ApiResponse from "../types/responses/ApiResponse";
import { AppErrorClass } from "../utils/appErrorClass";
import { catchAsync } from "../utils/catchAsync";
import type { Request, Response } from "express";

import type { ParamsDictionary } from "express-serve-static-core";
import { createFilename } from "../utils/createFilename";

// Aggregation Pipeline (match and group) for Mongoose/MongoDB, can  be used for dashboard statistics
export const getRecipeStats = async (req: Request, res: Response) => {
  try {
    // everything in aggregrate goes in one flow, meaning, what you did on the first step/stage
    // it will be available to you on the other step, just like in $group.numOfRecipe
    // we used it at another step which is $sort
    // STEP BY STEP
    // each step is an {object}
    const stats = await Recipe.aggregate([
      {
        $match: {
          ratings: {
            $gte: 5,
          },
        },
      },
      {
        $group: {
          // you can literally put a column here, example $status
          // where status is pending, approved or rejected.
          // _id will group them by status!
          // _id: null, // do null if you don't want them to be grouped!
          _id: "$ratings", // this will group them by ratings
          // avgRatings here can be anything, but we use avgRatings for it to be readable at least
          numOfRecipe: { $sum: 1 },
          avgRatings: {
            // to get the column we need $ inside the qoutations
            $avg: "$ratings",
          },
          minRating: {
            $min: "$ratings",
          },
        },
      },
      {
        $sort: {
          // we need to use the names above
          numOfRecipe: 1, // 1 is for ascending
        },
      },
      // we can repeat stage here, but of course we are just using the above
      // variables now, since _id is not the document _id anymore, just the ratings,
      // we did $ne (not equal to) 12. so all recipes that are not rated 12
      // {
      //   $match: {
      //     // _id here refers to the _id we use above, if null is used above, we can't do this
      //     _id: { $ne: 12 },
      //   },
      // },
    ]);

    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// Aggregation Pipeline (unwind and projecting ) for Mongoose/MongoDB
export const getIngredient = async (req: Request, res: Response) => {
  try {
    const ingredient = req.params.ingredient;

    // this aggregiate helps me get the number of recipes with the given ingrediens
    const result = await Recipe.aggregate([
      {
        // $unwind will unpack a column, for example, an array of ingredients
        // if a document 1 has an array of ingredient with ['pork', 'garlic'] for example,
        // and there is another document 2 with ['chicken', 'garlic']
        // This will unpack them and make documents (which are identical to documents 1 and 2 respectively), but without the ingredients as an array,
        // it will be ingredients: 'pork', and ingredients: 'garlic'.
        // So with that, if the number of documents you have in your database is only 2, the examples.
        // it will become 4, but still identified with the same documnent _id

        $unwind: "$ingredients",
      },
      // after, we can search for the ingredient. in this logic, instead of making a query to get
      // all recipe with the given params ingredient, we can also make it like this.
      {
        $match: {
          ingredients: {
            $in: [ingredient],
          },
        },
      },
      {
        $group: {
          _id: "$ingredients",
          numOfRecipe: {
            $sum: 1,
          },
          recipes: {
            // $push makes an array, so in here, i'm getting all the recipe names with the given ingredient
            $push: "$name",
          },
        },
      },
      {
        // just add fields on the current collection above, from last step
        $addFields: {
          // this is just to show that we can add another field here, BUT make sure that the field (e.g ingredients, not $ingredients)
          // is available at is used above, earlier stages
          ingredients: "$_id",
        },
      },
      {
        // $project removes fields, so 0 will remove it 1 will make it stay
        $project: {
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: result.length,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const index: ListRecipeHandler = catchAsync(async (req, res, _next) => {
  const query = buildQuery(req.query);
  const recipes = await query;

  res.status(200).json({
    message: "Recipe List",
    status: "success",
    results: recipes.length,
    data: recipes,
  });
});

export const show: GetRecipeHandler = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id).populate([
    {
      path: "owner",
      select: "-__v -passwordChangedAt -createdAt -updatedAt -savedRecipes -role",
    },
    {
      path: "reviews",
      select: "text rating createdAt id",
    },
  ]);

  if (!recipe) {
    next(new AppErrorClass("Recipe not found", 404));
    return;
  }

  res.status(200).json({
    data: recipe,
    message: "Recipe Information",
    status: "success",
  });
});

export const store: CreateRecipeHandler = catchAsync(async (req, res, next) => {
  if (!req.file) {
    next(new AppErrorClass("Cover photos is required to create a recipe.", 422));
    return;
  }

  const user = req.user as UserDocument;

  const recipe = await Recipe.create({
    ...req.body,
    owner: user._id,
    cover: createFilename(req),
  });

  res.status(200).json({
    data: recipe,
    message: "Recipe Created",
    status: "success",
  });
});

export const update: UpdateRecipeHandler = catchAsync<ParamsDictionary, ApiResponse<RecipeDocument>, Partial<RecipeDocument>>(
  async (req, res, _next) => {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        cover: createFilename(req),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      data: recipe,
      message: "Recipe Updated",
      status: "success",
    });
  },
);

export const destroy: DeleteRecipeHandler = catchAsync(async (req, res, _next) => {
  await Recipe.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Recipe Deleted",
    status: "success",
  });
});

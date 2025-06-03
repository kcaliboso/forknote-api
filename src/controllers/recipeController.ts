import { buildQuery } from "#api/recipe/api.js";
import { Recipe } from "#models/RecipeSchema.js";
import { CreateRecipeHandler, DeleteRecipeHandler, GetRecipeHandler, ListRecipeHandler, UpdateRecipeHandler } from "#types/models/Recipe.js";
import { AppError } from "#utils/appError.js";
import type { Request, Response } from "express";

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

export const index: ListRecipeHandler = async (req, res, next) => {
  try {
    const query = buildQuery(req.query);
    const recipes = await query;

    res.status(200).json({
      message: "Recipe List",
      status: "success",
      results: recipes.length,
      data: recipes,
    });
  } catch (_error) {
    next(new AppError("Something went wrong"));
  }
};

export const show: GetRecipeHandler = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(404).json({
        status: "fail",
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      data: recipe,
      message: "Recipe Information",
      status: "success",
    });
  } catch (_error) {
    next(new AppError("Something went wrong"));
  }
};

export const store: CreateRecipeHandler = async (req, res, next) => {
  try {
    const recipe = await Recipe.create(req.body);

    res.status(200).json({
      data: recipe,
      message: "Recipe Created",
      status: "success",
    });
  } catch (_error) {
    next(new AppError("Something went wrong"));
  }
};

export const update: UpdateRecipeHandler = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      data: recipe,
      message: "Recipe Updated",
      status: "success",
    });
  } catch (_error) {
    next(new AppError("Something went wrong"));
  }
};

export const destroy: DeleteRecipeHandler = async (req, res, next) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Recipe Deleted",
      status: "success",
    });
  } catch (_error) {
    next(new AppError("Something went wrong"));
  }
};

import { Recipe } from "#models/RecipeSchema.js";
import {
  CreateRecipeHandler,
  DeleteRecipeHandler,
  GetRecipeHandler,
  ListRecipeHandler,
  RecipeDocument,
  UpdateRecipeHandler,
} from "#types/models/Recipe.js";
import { FilterQuery } from "mongoose";

export const index: ListRecipeHandler = async (req, res) => {
  try {
    const { name, ratings } = req.query;

    const filter: FilterQuery<RecipeDocument> = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (ratings) {
      const num = Number(ratings);
      if (!Number.isNaN(num)) {
        filter.ratings = num;
      }
    }

    const recipes = await Recipe.find(filter);

    res.status(200).json({
      message: "Recipe List",
      status: "success",
      results: recipes.length,
      data: recipes,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const show: GetRecipeHandler = async (req, res) => {
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
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const store: CreateRecipeHandler = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);

    res.status(200).json({
      data: recipe,
      message: "Recipe Created",
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const update: UpdateRecipeHandler = async (req, res) => {
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
  } catch (error) {
    res.status(400).json({
      message: error,
      status: "fail",
    });
  }
};

export const destroy: DeleteRecipeHandler = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Recipe Deleted",
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      status: "fail",
    });
  }
};

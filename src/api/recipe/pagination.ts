import { Recipe } from "../../models/RecipeSchema";
import { IndexQueryType } from "../../types/filters/RecipeFilters";

export const pagination = async (req: IndexQueryType) => {
  const page = req.page ?? 1;
  const limit = req.limit ?? 5;

  const skip = (page - 1) * limit;

  if (page) {
    const recipeCount = await Recipe.countDocuments();

    if (skip >= recipeCount) throw Error("Page does not exist");
  }

  return {
    skip,
    limit,
  };
};

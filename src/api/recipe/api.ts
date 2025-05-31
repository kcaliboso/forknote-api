import { Recipe } from "#models/RecipeSchema.js";
import { IndexQueryType } from "#types/filters/RecipeFilters.js";
import { fields } from "./fields";
import { filter } from "./filters";
import { sort } from "./sort";

export const buildQuery = (query: IndexQueryType) => {
  const selectedFields = fields(query);
  const advancedSort = sort(query);

  const queryFilter = filter(query);

  return Recipe.find(queryFilter).sort(advancedSort).select(selectedFields);
};

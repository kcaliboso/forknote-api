import { Recipe } from "#models/RecipeSchema.js";
import { IndexQueryType } from "#types/filters/RecipeFilters.js";
import { fields } from "./fields";
import { filter } from "./filters";
import { pagination } from "./pagination";
import { sort } from "./sort";

export const buildQuery = async (query: IndexQueryType) => {
  const selectedFields = fields(query);
  const advancedSort = sort(query);
  const queryFilter = filter(query);
  const paginationObj = await pagination(query);

  return Recipe.find(queryFilter).sort(advancedSort).select(selectedFields).skip(paginationObj.skip).limit(paginationObj.limit);
};
